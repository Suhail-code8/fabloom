import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';

export type StitchingStatus = 'pending' | 'cutting' | 'stitching' | 'quality_check' | 'ready' | 'delivered';

export interface KanbanItem {
    id: string;
    orderId: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    garmentType: string; // Kurta, Thobe, etc (this isn't explicitly in the item, we'll infer or pass it if possible, wait, orderItem has productName)
    productName: string; // The fabric name
    productImage: string;
    meters: number;
    measurements: any;
    status: StitchingStatus;
    daysSinceOrder: number;
    adminNotes?: string;
    createdAt: string;
}

export async function GET() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || user?.publicMetadata?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find all orders that have stitching items and are not completely cancelled/delivered
    // To be precise, we look for items.stitchingDetails existing, where status is not delivered
    const orders = await Order.find({
        'items.stitchingDetails': { $exists: true },
        'items.stitchingDetails.status': { $ne: 'delivered' }
    }).lean();

    const kanbanItems: KanbanItem[] = [];
    const now = new Date().getTime();

    for (const order of (orders as any[])) {
        const orderDate = new Date(order.createdAt).getTime();
        const daysSinceOrder = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));

        for (const item of order.items) {
            if (item.stitchingDetails && item.stitchingDetails.status !== 'delivered') {
                kanbanItems.push({
                    id: item._id.toString(),
                    orderId: order._id.toString(),
                    orderNumber: order.orderNumber,
                    customerName: order.shippingAddress.fullName,
                    customerPhone: order.shippingAddress.phone,
                    garmentType:
                        item.stitchingDetails.specialInstructions?.match(/Garment:\s*([^|]+)/i)?.[1]?.trim() ||
                        'Garment',
                    productName: item.productName,
                    productImage: item.productImage,
                    meters: item.meters || 0,
                    measurements: item.stitchingDetails.measurements,
                    status: item.stitchingDetails.status as StitchingStatus,
                    daysSinceOrder,
                    adminNotes: item.stitchingDetails.adminNotes,
                    createdAt: order.createdAt.toISOString(),
                });
            }
        }
    }

    return NextResponse.json({ items: kanbanItems });
}
