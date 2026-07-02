import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';

function last7DaysZeroSeries() {
    return Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return { date: date.toISOString().slice(0, 10), amount: 0 };
    });
}

function emptyPayload(lowStockCount = 0) {
    return {
        success: true,
        metrics: {
            todayRevenue: 0,
            totalOrders: 0,
            pendingStitching: 0,
            lowStockCount,
        },
        revenueByDay: last7DaysZeroSeries(),
        ordersByType: [] as { name: string; value: number }[],
        recentOrders: [] as {
            orderNumber: string;
            customerName: string;
            total: number;
            status: string;
        }[],
    };
}

export async function GET() {
    const { userId } = await auth();
    let user: Awaited<ReturnType<typeof currentUser>> = null;

    try {
        user = await currentUser();
    } catch (e) {
        console.error('Analytics auth error:', e);
    }

    if (!userId || user?.publicMetadata?.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfTomorrow = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

        const startOf7DaysAgo = new Date(startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000);
        const endOfToday = startOfTomorrow;

        const [lowStockAgg, ordersAgg] = await Promise.all([
            Product.aggregate([
                {
                    $project: {
                        type: 1,
                        stockInMeters: 1,
                        stock: 1,
                        sizeStock: 1,
                    },
                },
                {
                    $addFields: {
                        lowStock: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $eq: ['$type', 'fabric'] },
                                        then: { $lt: [{ $ifNull: ['$stockInMeters', 0] }, 5] },
                                    },
                                    {
                                        case: { $eq: ['$type', 'accessory'] },
                                        then: { $lt: [{ $ifNull: ['$stock', 0] }, 5] },
                                    },
                                    {
                                        case: { $eq: ['$type', 'readymade'] },
                                        then: {
                                            $or: [
                                                { $lt: [{ $ifNull: ['$sizeStock.S', 0] }, 2] },
                                                { $lt: [{ $ifNull: ['$sizeStock.M', 0] }, 2] },
                                                { $lt: [{ $ifNull: ['$sizeStock.L', 0] }, 2] },
                                                { $lt: [{ $ifNull: ['$sizeStock.XL', 0] }, 2] },
                                                { $lt: [{ $ifNull: ['$sizeStock.XXL', 0] }, 2] },
                                            ],
                                        },
                                    },
                                ],
                                default: false,
                            },
                        },
                    },
                },
                { $match: { lowStock: true } },
                { $count: 'count' },
            ]),

            Order.aggregate([
                {
                    $facet: {
                        metrics: [
                            {
                                $group: {
                                    _id: null,
                                    totalOrders: { $sum: 1 },
                                    // Revenue earned from completed or in-progress paid orders
                                    totalRevenue: {
                                        $sum: {
                                            $cond: [
                                                {
                                                    $and: [
                                                        { $eq: ['$paymentStatus', 'paid'] },
                                                        {
                                                            $in: [
                                                                '$status',
                                                                ['delivered', 'processing', 'shipped', 'confirmed'],
                                                            ],
                                                        },
                                                    ],
                                                },
                                                { $ifNull: ['$totalAmount', 0] },
                                                0,
                                            ],
                                        },
                                    },
                                    todayRevenue: {
                                        $sum: {
                                            $cond: [
                                                {
                                                    $and: [
                                                        { $eq: ['$paymentStatus', 'paid'] },
                                                        { $gte: ['$createdAt', startOfToday] },
                                                        { $lt: ['$createdAt', endOfToday] },
                                                    ],
                                                },
                                                { $ifNull: ['$totalAmount', 0] },
                                                0,
                                            ],
                                        },
                                    },
                                    pendingStitching: {
                                        $sum: {
                                            $cond: [
                                                {
                                                    $gt: [
                                                        {
                                                            $size: {
                                                                $filter: {
                                                                    input: { $ifNull: ['$items', []] },
                                                                    as: 'it',
                                                                    cond: {
                                                                        $and: [
                                                                            { $ne: ['$$it.stitchingDetails', null] },
                                                                            { $eq: ['$$it.stitchingDetails.status', 'pending'] },
                                                                        ],
                                                                    },
                                                                },
                                                            },
                                                        },
                                                        0,
                                                    ],
                                                },
                                                1,
                                                0,
                                            ],
                                        },
                                    },
                                },
                            },
                            {
                                $project: {
                                    _id: 0,
                                    totalOrders: 1,
                                    totalRevenue: 1,
                                    todayRevenue: 1,
                                    pendingStitching: 1,
                                },
                            },
                        ],

                        // Count of all order-items that have stitching details
                        stitchingJobs: [
                            { $unwind: { path: '$items', preserveNullAndEmptyArrays: false } },
                            { $match: { 'items.stitchingDetails': { $ne: null } } },
                            { $count: 'total' },
                        ],

                        revenueByDay: [
                            { $match: { createdAt: { $gte: startOf7DaysAgo } } },
                            {
                                $group: {
                                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                                    amount: {
                                        $sum: {
                                            $cond: [
                                                { $eq: ['$paymentStatus', 'paid'] },
                                                { $ifNull: ['$totalAmount', 0] },
                                                0,
                                            ],
                                        },
                                    },
                                },
                            },
                            { $project: { _id: 0, date: '$_id', amount: 1 } },
                            { $sort: { date: 1 } },
                        ],

                        ordersByType: [
                            { $unwind: { path: '$items', preserveNullAndEmptyArrays: false } },
                            {
                                $addFields: {
                                    productType: {
                                        $switch: {
                                            branches: [
                                                { case: { $eq: ['$items.itemType', 'readymade'] }, then: 'readymade' },
                                                {
                                                    case: {
                                                        $and: [
                                                            { $eq: ['$items.itemType', 'fabric'] },
                                                            { $ne: ['$items.stitchingDetails', null] },
                                                        ],
                                                    },
                                                    then: 'stitching',
                                                },
                                                { case: { $eq: ['$items.itemType', 'fabric'] }, then: 'fabric' },
                                                { case: { $eq: ['$items.itemType', 'accessory'] }, then: 'accessory' },
                                            ],
                                            default: 'other',
                                        },
                                    },
                                    qty: { $ifNull: ['$items.quantity', 1] },
                                },
                            },
                            { $group: { _id: '$productType', value: { $sum: '$qty' } } },
                            { $project: { _id: 0, name: '$_id', value: 1 } },
                            { $sort: { value: -1 } },
                        ],

                        recentOrders: [
                            { $sort: { createdAt: -1 } },
                            { $limit: 5 },
                            {
                                $project: {
                                    _id: 0,
                                    orderNumber: 1,
                                    customerName: { $ifNull: ['$shippingAddress.fullName', 'Customer'] },
                                    total: { $ifNull: ['$totalAmount', 0] },
                                    status: 1,
                                },
                            },
                        ],
                    },
                },
            ]),
        ]);

        const lowStockCount = lowStockAgg?.[0]?.count ?? 0;

        const agg = ordersAgg?.[0] ?? null;
        const metricsRow = agg?.metrics?.[0] ?? null;
        const stitchingJobsTotal = agg?.stitchingJobs?.[0]?.total ?? 0;

        if (!metricsRow) {
            return NextResponse.json(emptyPayload(lowStockCount));
        }

        const revenueByDay = agg.revenueByDay ?? [];
        const ordersByType = (agg.ordersByType ?? []).filter((e: any) => e?.value > 0);
        const recentOrders = agg.recentOrders ?? [];

        return NextResponse.json({
            success: true,
            metrics: {
                todayRevenue: metricsRow.todayRevenue ?? 0,
                totalRevenue: metricsRow.totalRevenue ?? 0,
                totalOrders: metricsRow.totalOrders ?? 0,
                pendingStitching: metricsRow.pendingStitching ?? 0,
                stitchingJobsTotal,
                lowStockCount,
            },
            revenueByDay,
            ordersByType,
            recentOrders,
        });
    } catch (error: unknown) {
        console.error('Analytics Error:', error);
        return NextResponse.json(emptyPayload(0));
    }
}
