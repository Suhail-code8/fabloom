import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';
import { sendStitchingReady, sendStitchingStarted } from '@/lib/notifications/whatsapp';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || user?.publicMetadata?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId, status, adminNotes } = await req.json();

    if (!itemId) {
        return NextResponse.json({ error: 'itemId is required' }, { status: 400 });
    }

    await dbConnect();

    const { id } = await params;
    const order = await Order.findById(id);
    if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const item = order.items.id(itemId);
    if (!item || !item.stitchingDetails) {
        return NextResponse.json({ error: 'Stitching item not found' }, { status: 404 });
    }

    const previousStatus = item.stitchingDetails.status;

    if (status) {
        item.stitchingDetails.status = status;
    }
    
    if (adminNotes !== undefined) {
        item.stitchingDetails.adminNotes = adminNotes;
    }

    await order.save();

    // WhatsApp notification stub: fire-and-forget on stage changes.
    // Never block production moves on external notification failures.
    try {
        const nextStatus = item.stitchingDetails.status;
        if (status && nextStatus !== previousStatus) {
            const specialInstructions = item.stitchingDetails.specialInstructions || '';
            const garmentType =
                specialInstructions.match(/Garment:\s*([^|]+)/i)?.[1]?.trim() ||
                (item as any).productName ||
                'Garment';

            const phone = order.shippingAddress.phone;
            const customerName = order.shippingAddress.fullName;

            if (nextStatus === 'ready') {
                void sendStitchingReady(phone, {
                    orderNumber: order.orderNumber,
                    customerName,
                    garmentType,
                });
            } else {
                void sendStitchingStarted(phone, {
                    orderNumber: order.orderNumber,
                    customerName,
                    garmentType,
                });
            }
        }
    } catch (e) {
        // Ignore notification failures
    }

    return NextResponse.json({ success: true, item });
}
