import { Resend } from 'resend';
import * as React from 'react';
import OrderConfirmationEmail from '@/../emails/OrderConfirmationEmail';
import StitchingStartedEmail from '@/../emails/StitchingStartedEmail';
import StitchingReadyEmail from '@/../emails/StitchingReadyEmail';
import OrderDispatchedEmail from '@/../emails/OrderDispatchedEmail';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_123456');

// Generic Sender with Fire-and-Forget
async function sendEmail(to: string, subject: string, react: React.ReactElement) {
    if (!process.env.RESEND_API_KEY) {
        console.warn(`[RESEND MOCK] Sending Email to ${to} | Subject: ${subject}`);
        return;
    }

    try {
        const { error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: [to],
            subject: subject,
            react: react,
        });

        if (error) {
            console.error('[RESEND ERROR]', error);
        }
    } catch (error) {
        console.error('[RESEND CATCH ERROR]', error);
        // Fire and forget, never throw
    }
}

// Wrappers

export async function sendOrderConfirmationEmail(
    email: string, 
    data: { orderNumber: string, customerName: string, items: any[], total: number, deliveryAddress: any, estimatedDelivery: string }
) {
    await sendEmail(
        email, 
        `Order Confirmed: ${data.orderNumber}`, 
        OrderConfirmationEmail(data)
    );
}

export async function sendStitchingStartedEmail(
    email: string,
    data: { orderNumber: string, customerName: string, garmentType: string }
) {
    await sendEmail(
        email,
        `Stitching Started: ${data.garmentType}`,
        StitchingStartedEmail(data)
    );
}

export async function sendStitchingReadyEmail(
    email: string,
    data: { orderNumber: string, customerName: string, garmentType: string }
) {
    await sendEmail(
        email,
        `Your ${data.garmentType} is Ready!`,
        StitchingReadyEmail(data)
    );
}

export async function sendOrderDispatchedEmail(
    email: string,
    data: { orderNumber: string, customerName: string, trackingNumber: string, courierName: string }
) {
    await sendEmail(
        email,
        `Order Dispatched: ${data.orderNumber}`,
        OrderDispatchedEmail(data)
    );
}
