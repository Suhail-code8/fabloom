import Razorpay from 'razorpay';
import crypto from 'crypto';

// ============================================================================
// RAZORPAY SDK INSTANCE
// ============================================================================

if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
    throw new Error('NEXT_PUBLIC_RAZORPAY_KEY_ID is not defined in environment variables');
}
if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('RAZORPAY_KEY_SECRET is not defined in environment variables');
}

export const razorpay = new Razorpay({
    key_id:     process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ============================================================================
// CREATE ORDER
// ============================================================================

export interface CreateRazorpayOrderParams {
    amount:   number; // in paise (INR × 100)
    currency?: string;
    receipt?: string;
    notes?: Record<string, string>;
}

export async function createRazorpayOrder(params: CreateRazorpayOrderParams) {
    const { amount, currency = 'INR', receipt, notes } = params;

    const order = await razorpay.orders.create({
        amount,          // must be in paise
        currency,
        receipt,
        notes,
    });

    return order;
}

// ============================================================================
// VERIFY PAYMENT SIGNATURE
// ============================================================================

export function verifyRazorpaySignature(params: {
    razorpayOrderId:   string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}): boolean {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = params;

    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const body   = `${razorpayOrderId}|${razorpayPaymentId}`;

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');

    return expectedSignature === razorpaySignature;
}

// ============================================================================
// VERIFY WEBHOOK SIGNATURE
// ============================================================================

export function verifyRazorpayWebhook(params: {
    rawBody:   string;
    signature: string;
}): boolean {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    if (!secret) return false;

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(params.rawBody)
        .digest('hex');

    return expectedSignature === params.signature;
}
