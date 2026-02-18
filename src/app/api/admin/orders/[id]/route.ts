import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';
import mongoose from 'mongoose';

const ORDER_STATUSES = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
] as const;

const STITCHING_STATUSES = ['pending', 'in_progress', 'completed', 'delivered'] as const;

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const { id } = params;

        const order = await Order.findById(id).lean();

        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Order not found',
                },
                { status: 404 }
            );
        }

        console.log('GET Order - Items _id check:');
        order.items.forEach((item: any, i: number) => {
            console.log(`Item ${i}: _id =`, item._id, 'name =', item.productName);
        });

        return NextResponse.json({
            success: true,
            data: order,
        });
    } catch (error: any) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch order',
                message: error.message,
            },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const { id } = params;
        const body = await request.json();
        const { status, stitchingStatus, itemId } = body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid order ID',
                },
                { status: 400 }
            );
        }

        if (stitchingStatus !== undefined || itemId !== undefined) {
            if (!itemId || !stitchingStatus) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'itemId and stitchingStatus are required',
                    },
                    { status: 400 }
                );
            }

            if (!STITCHING_STATUSES.includes(stitchingStatus)) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Invalid stitching status',
                    },
                    { status: 400 }
                );
            }

            if (!mongoose.Types.ObjectId.isValid(itemId)) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Invalid item ID',
                    },
                    { status: 400 }
                );
            }

            const order = await Order.findById(id);

            if (!order) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Order not found',
                    },
                    { status: 404 }
                );
            }

            const item = order.items.find((orderItem: any) => {
                return orderItem?._id?.toString() === itemId.toString();
            });

            if (!item) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Order item not found',
                    },
                    { status: 404 }
                );
            }

            if (!item.stitchingDetails) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Selected item has no stitching details',
                    },
                    { status: 400 }
                );
            }

            item.stitchingDetails.status = stitchingStatus;

            if (status !== undefined) {
                if (!ORDER_STATUSES.includes(status)) {
                    return NextResponse.json(
                        {
                            success: false,
                            error: 'Invalid order status',
                        },
                        { status: 400 }
                    );
                }
                order.status = status;
            }

            await order.save();
            const updatedOrder = await Order.findById(id).lean();

            return NextResponse.json({
                success: true,
                data: updatedOrder,
            });
        }

        if (status !== undefined) {
            if (!ORDER_STATUSES.includes(status)) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Invalid order status',
                    },
                    { status: 400 }
                );
            }

            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                { $set: { status } },
                { new: true, runValidators: true }
            ).lean();

            if (!updatedOrder) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Order not found',
                    },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                data: updatedOrder,
            });
        }

        return NextResponse.json(
            {
                success: false,
                error: 'No update payload provided',
            },
            { status: 400 }
        );
    } catch (error: any) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update order',
                message: error.message,
            },
            { status: 500 }
        );
    }
}
