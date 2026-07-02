import type { Metadata } from 'next';
import CartPageClient from '@/components/cart/CartPageClient';

export const metadata: Metadata = {
    title: 'Your Cart - Fabloom',
    description: 'Review your items and custom stitching orders before checkout.',
};

// Guest-accessible — no auth check here.
// Zustand hydrates the cart from localStorage for all visitors.
// Auth is enforced at /checkout when payment is required.
export default function CartPage() {
    return <CartPageClient />;
}
