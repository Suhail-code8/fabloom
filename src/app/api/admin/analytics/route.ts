import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { User } from '@/models/User';

/** Safe empty payload — dashboard must never crash on missing/failed data */
function emptyAnalyticsPayload() {
    const revenueData = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
            name: date.toLocaleDateString('en-US', { weekday: 'short' }),
            readymade: 0,
            stitching: 0,
        };
    });

    return {
        success: true,
        metrics: {
            todayRevenue: 0,
            revenueTrend: 0,
            ordersToday: 0,
            stitchingToday: 0,
            readymadeToday: 0,
            pendingStitchingCount: 0,
            lowStockCount: 0,
        },
        charts: {
            revenueData,
            ordersByType: [] as { name: string; value: number }[],
            pipelineData: [
                { name: 'Pending', orders: 0 },
                { name: 'Cutting', orders: 0 },
                { name: 'Stitching', orders: 0 },
                { name: 'QA', orders: 0 },
                { name: 'Ready', orders: 0 },
            ],
        },
        activityFeed: [] as { id: string; type: string; title: string; desc: string; timestamp: string }[],
    };
}

export async function GET() {
    const { userId } = await auth();
    let user: Awaited<ReturnType<typeof currentUser>> = null;

    try {
        user = await currentUser();
    } catch (e) {
        console.error('Analytics auth (currentUser) error:', e);
    }

    const role = user?.publicMetadata?.role;
    if (!userId || role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
        const startOf7DaysAgo = new Date(startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000);

        // 1. Core Metrics
        const [
            ordersToday,
            ordersYesterday,
            allOrders,
            allProducts,
            recentUsers
        ] = (await Promise.all([
            Order.find({ createdAt: { $gte: startOfToday } }).lean(),
            Order.find({ createdAt: { $gte: startOfYesterday, $lt: startOfToday } }).lean(),
            Order.find().sort({ createdAt: -1 }).lean(),
            Product.find().lean(),
            User.find().sort({ createdAt: -1 }).limit(5).lean()
        ])) as any[];

        const todayRevenue = ordersToday.reduce((sum: number, o: any) => sum + (Number(o.totalAmount) || 0), 0);
        const yesterdayRevenue = ordersYesterday.reduce((sum: number, o: any) => sum + (Number(o.totalAmount) || 0), 0);
        const revenueTrend = yesterdayRevenue === 0 ? 0 : Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100);

        const ordersTodayCount = ordersToday.length;

        if (allOrders.length === 0) {
            return NextResponse.json(emptyAnalyticsPayload());
        }

        const orderItems = (order: any) => (Array.isArray(order?.items) ? order.items : []);

        let pendingStitchingCount = 0;
        let stitchingToday = 0;
        let readymadeToday = 0;

        allOrders.forEach((order: any) => {
            orderItems(order).forEach((item: any) => {
                if (item.stitchingDetails && item.stitchingDetails.status === 'pending') {
                    pendingStitchingCount++;
                }
            });
        });

        ordersToday.forEach((order: any) => {
            let hasStitching = false;
            orderItems(order).forEach((item: any) => {
                if (item.stitchingDetails) hasStitching = true;
            });
            if (hasStitching) stitchingToday++;
            else readymadeToday++;
        });

        // 2. Low Stock calculation
        let lowStockCount = 0;
        allProducts.forEach((p: any) => {
            if (p.type === 'fabric' && (p as any).stockInMeters < 5) lowStockCount++;
            else if (p.type === 'readymade') {
                const sizes = (p as any).sizeStock || {};
                if (Object.values(sizes).some((qty: any) => qty < 2)) lowStockCount++;
            }
            else if (p.type === 'accessory' && (p as any).stock < 5) lowStockCount++;
        });

        // 3. Revenue Chart (7 Days)
        const revenueData = Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(startOf7DaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
            const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
            return { name: dateStr, readymade: 0, stitching: 0 };
        });

        allOrders.forEach((order: any) => {
            if (new Date(order.createdAt) >= startOf7DaysAgo) {
                const dayIndex = Math.floor((new Date(order.createdAt).getTime() - startOf7DaysAgo.getTime()) / (24 * 60 * 60 * 1000));
                if (dayIndex >= 0 && dayIndex < 7) {
                    orderItems(order).forEach((item: any) => {
                        const price = Number(item.totalPrice) || 0;
                        if (item.stitchingDetails) {
                            revenueData[dayIndex].stitching += price;
                        } else {
                            revenueData[dayIndex].readymade += price;
                        }
                    });
                }
            }
        });

        // 4. Orders by Product Type Donut
        let rmCount = 0;
        let stCount = 0;
        let fbCount = 0;
        let acCount = 0;

        allOrders.forEach((order: any) => {
            orderItems(order).forEach((item: any) => {
                const qty = Number(item.quantity) || 1;
                if (item.itemType === 'readymade') rmCount += qty;
                else if (item.itemType === 'accessory') acCount += qty;
                else if (item.itemType === 'fabric' && item.stitchingDetails) stCount++;
                else if (item.itemType === 'fabric') fbCount++;
            });
        });

        const ordersByType = [
            { name: 'Readymade', value: rmCount },
            { name: 'Stitching', value: stCount },
            { name: 'Fabrics (Raw)', value: fbCount },
            { name: 'Accessories', value: acCount },
        ].filter(i => i.value > 0);

        // 5. Pipeline Bar Chart
        const pipelineStages = { pending: 0, cutting: 0, stitching: 0, quality_check: 0, ready: 0 };
        allOrders.forEach((order: any) => {
            orderItems(order).forEach((item: any) => {
                if (item.stitchingDetails && item.stitchingDetails.status !== 'delivered') {
                    const status = item.stitchingDetails.status;
                    if (pipelineStages[status as keyof typeof pipelineStages] !== undefined) {
                        pipelineStages[status as keyof typeof pipelineStages]++;
                    }
                }
            });
        });
        const pipelineData = [
            { name: 'Pending', orders: pipelineStages.pending },
            { name: 'Cutting', orders: pipelineStages.cutting },
            { name: 'Stitching', orders: pipelineStages.stitching },
            { name: 'QA', orders: pipelineStages.quality_check },
            { name: 'Ready', orders: pipelineStages.ready },
        ];

        // 6. Activity Feed (Mocked dynamically)
        const activityFeed: any[] = [];
        
        // Add recent orders
        allOrders.slice(0, 5).forEach((o: any) => {
            activityFeed.push({
                id: `order_${o._id}`,
                type: 'order',
                title: 'Order placed',
                desc: `${o.orderNumber} - ₹${o.totalAmount.toLocaleString('en-IN')}`,
                timestamp: o.createdAt
            });
        });

        // Add recent users
        recentUsers.forEach((u: any) => {
            activityFeed.push({
                id: `user_${u._id}`,
                type: 'user',
                title: 'New customer registered',
                desc: u.name,
                timestamp: u.createdAt
            });
        });

        // Sort feed chronologically
        activityFeed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        // Return unified dashboard payload
        return NextResponse.json({
            success: true,
            metrics: {
                todayRevenue,
                revenueTrend,
                ordersToday: ordersTodayCount,
                stitchingToday,
                readymadeToday,
                pendingStitchingCount,
                lowStockCount,
            },
            charts: {
                revenueData,
                ordersByType,
                pipelineData,
            },
            activityFeed: activityFeed.slice(0, 10),
        });

    } catch (error: any) {
        console.error('Analytics Error:', error);
        // Return 200 with empty safe data so the dashboard UI never hard-crashes
        return NextResponse.json(emptyAnalyticsPayload());
    }
}
