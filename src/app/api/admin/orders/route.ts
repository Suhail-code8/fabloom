import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';

export async function GET(request: NextRequest) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || user?.publicMetadata?.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        const filter = request.nextUrl.searchParams.get('filter');
        const query: Record<string, unknown> = {};

        if (filter === 'pending') query.status = 'pending';
        else if (filter === 'processing') query.status = 'processing';
        else if (filter === 'delivered') query.status = 'delivered';

        const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

        return NextResponse.json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to fetch orders';
        console.error('Error fetching orders:', error);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
