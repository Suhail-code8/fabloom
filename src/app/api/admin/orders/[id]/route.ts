import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';
import { User } from '@/models/User';

const ORDER_STATUSES = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
] as const;

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || user?.publicMetadata?.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { id } = await params;

        const order = await Order.findById(id).lean();
        if (!order) {
            return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        }

        let customerEmail: string | null = null;
        if ((order as any).userId && (order as any).userId !== 'guest') {
            const dbUser = await User.findOne({ clerkId: (order as any).userId }).lean();
            customerEmail = (dbUser as any)?.email ?? null;
        }

        return NextResponse.json({
            success: true,
            data: { ...order, customerEmail },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to fetch order';
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || user?.publicMetadata?.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        if (!status || !ORDER_STATUSES.includes(status)) {
            return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
        }

        const updated = await Order.findByIdAndUpdate(
            id,
            { $set: { status } },
            { new: true, runValidators: true }
        ).lean();

        if (!updated) {
            return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updated });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to update order';
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
