import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createRazorpayOrder } from '@/lib/razorpay';

// ============================================================================
// POST /api/checkout/create-razorpay-order
// Creates a Razorpay order and returns the order_id needed by the frontend SDK
// Body: { amount: number (in rupees), currency?: string, receipt?: string }
// ============================================================================

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { amount, currency = 'INR', receipt } = body;

        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        // Razorpay expects amount in paise (multiply rupees × 100)
        const amountInPaise = Math.round(amount * 100);

        const order = await createRazorpayOrder({
            amount:   amountInPaise,
            currency,
            receipt:  receipt || `receipt_${userId}_${Date.now()}`,
            notes: {
                userId,
            },
        });

        return NextResponse.json({
            success:  true,
            orderId:  order.id,
            amount:   order.amount,
            currency: order.currency,
            keyId:    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        });
    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
