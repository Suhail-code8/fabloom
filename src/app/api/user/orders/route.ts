import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';

export async function GET(req: NextRequest) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        
        // Fetch all orders for this user, sorted newest first
        const orders = await Order.find({ userId })
                                  .sort({ createdAt: -1 })
                                  .lean();

        return NextResponse.json({ success: true, orders });
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
