import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';

// ============================================================================
// POST /api/checkout/verify-payment
// Verifies the HMAC-SHA256 signature returned by Razorpay after payment
// Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
// ============================================================================

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await req.json();
        const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

        if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return NextResponse.json(
                { error: 'orderId, razorpayOrderId, razorpayPaymentId, and razorpaySignature are required' },
                { status: 400 }
            );
        }

        const isValid = verifyRazorpaySignature({
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
        });

        if (!isValid) {
            // Optionally update order to failed
            await Order.findByIdAndUpdate(orderId, { paymentStatus: 'failed' });
            return NextResponse.json(
                { error: 'Payment signature verification failed' },
                { status: 400 }
            );
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { 
                paymentStatus: 'paid',
                status: 'confirmed'
            },
            { new: true }
        );

        if (!updatedOrder) {
            return NextResponse.json(
                { error: 'Payment verified, but order not found in database' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            paymentId: razorpayPaymentId,
        });
    } catch (error: any) {
        console.error('Error verifying Razorpay payment:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
