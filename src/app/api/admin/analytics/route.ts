import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';

function emptyPayload() {
    const revenueByDay = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
            date: date.toISOString().slice(0, 10),
            amount: 0,
        };
    });

    return {
        success: true,
        metrics: {
            revenue: 0,
            totalOrders: 0,
            pendingStitching: 0,
            lowStock: 0,
        },
        revenueByDay,
        ordersByType: [] as { name: string; value: number }[],
        recentOrders: [] as {
            orderNumber: string;
            customerName: string;
            total: number;
            status: string;
        }[],
    };
}

function countLowStock(products: any[]): number {
    let count = 0;
    for (const p of products) {
        if (p.type === 'fabric' && (p.stockInMeters ?? 0) < 5) count++;
        else if (p.type === 'readymade') {
            const sizes = p.sizeStock || {};
            if (Object.values(sizes).some((qty: any) => (qty as number) < 2)) count++;
        } else if (p.type === 'accessory' && (p.stock ?? 0) < 5) count++;
    }
    return count;
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
        const startOf7DaysAgo = new Date(startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000);

        const [allOrders, allProducts] = await Promise.all([
            Order.find().sort({ createdAt: -1 }).lean(),
            Product.find().lean(),
        ]);

        if (allOrders.length === 0) {
            return NextResponse.json({
                ...emptyPayload(),
                metrics: {
                    revenue: 0,
                    totalOrders: 0,
                    pendingStitching: 0,
                    lowStock: countLowStock(allProducts as any[]),
                },
            });
        }

        const ordersToday = (allOrders as any[]).filter(
            (o) => new Date(o.createdAt) >= startOfToday
        );
        const todayRevenue = ordersToday.reduce(
            (sum, o) => sum + (Number(o.totalAmount) || 0),
            0
        );

        let pendingStitching = 0;
        let rmCount = 0;
        let stCount = 0;
        let fbCount = 0;
        let acCount = 0;

        for (const order of allOrders as any[]) {
            const items = Array.isArray(order.items) ? order.items : [];
            for (const item of items) {
                const qty = Number(item.quantity) || 1;
                if (item.itemType === 'readymade') rmCount += qty;
                else if (item.itemType === 'accessory') acCount += qty;
                else if (item.itemType === 'fabric' && item.stitchingDetails) stCount++;
                else if (item.itemType === 'fabric') fbCount++;

                if (
                    item.stitchingDetails &&
                    ['pending', 'cutting', 'stitching', 'quality_check'].includes(
                        item.stitchingDetails.status
                    )
                ) {
                    pendingStitching++;
                }
            }
        }

        const revenueByDay = Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(startOf7DaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
            return { date: date.toISOString().slice(0, 10), amount: 0 };
        });

        for (const order of allOrders as any[]) {
            const created = new Date(order.createdAt);
            if (created >= startOf7DaysAgo) {
                const dayIndex = Math.floor(
                    (created.getTime() - startOf7DaysAgo.getTime()) / (24 * 60 * 60 * 1000)
                );
                if (dayIndex >= 0 && dayIndex < 7) {
                    revenueByDay[dayIndex].amount += Number(order.totalAmount) || 0;
                }
            }
        }

        const ordersByType = [
            { name: 'Readymade', value: rmCount },
            { name: 'Stitching', value: stCount },
            { name: 'Fabrics', value: fbCount },
            { name: 'Accessories', value: acCount },
        ].filter((e) => e.value > 0);

        const recentOrders = (allOrders as any[]).slice(0, 5).map((o) => ({
            orderNumber: o.orderNumber,
            customerName: o.shippingAddress?.fullName || 'Customer',
            total: Number(o.totalAmount) || 0,
            status: o.status,
        }));

        return NextResponse.json({
            success: true,
            metrics: {
                revenue: todayRevenue,
                totalOrders: allOrders.length,
                pendingStitching,
                lowStock: countLowStock(allProducts as any[]),
            },
            revenueByDay,
            ordersByType,
            recentOrders,
        });
    } catch (error: unknown) {
        console.error('Analytics Error:', error);
        return NextResponse.json(emptyPayload());
    }
}
