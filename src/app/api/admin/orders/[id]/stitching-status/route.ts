import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';

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

    if (status) {
        item.stitchingDetails.status = status;
    }
    
    if (adminNotes !== undefined) {
        item.stitchingDetails.adminNotes = adminNotes;
    }

    await order.save();

    // OPTIONAL: Trigger WhatsApp notification here if status changed

    return NextResponse.json({ success: true, item });
}
