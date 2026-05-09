import type { Metadata } from 'next';
import Script from 'next/script';
import CheckoutPageClient from '@/components/checkout/CheckoutPageClient';

export const metadata: Metadata = {
    title: 'Checkout - Fabloom',
    description: 'Complete your purchase securely.',
};

export default function CheckoutPage() {
    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <CheckoutPageClient />
        </>
    );
}
