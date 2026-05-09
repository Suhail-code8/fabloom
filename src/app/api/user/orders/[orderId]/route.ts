import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { orderId } = await params;
        
        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        await dbConnect();
        
        // Fetch order by MongoDB _id AND ensure it belongs to the authenticated user
        const order = await Order.findOne({ _id: orderId, userId }).lean();

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, order });
    } catch (error: any) {
        console.error('Error fetching order details:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
