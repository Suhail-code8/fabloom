import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const searchParams = request.nextUrl.searchParams;
        const filter = searchParams.get('filter');

        let query: any = {};

        // Apply filters
        if (filter === 'stitching') {
            // Orders with at least one item that has stitching details
            query['items.stitchingDetails'] = { $exists: true };
        } else if (filter === 'completed') {
            query.status = 'delivered';
        }

        // Fetch orders
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch orders',
                message: error.message,
            },
            { status: 500 }
        );
    }
}
