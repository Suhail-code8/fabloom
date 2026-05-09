import type { Metadata } from 'next';
import CartPageClient from '@/components/cart/CartPageClient';

export const metadata: Metadata = {
    title: 'Your Cart - Fabloom',
    description: 'Review your items and custom stitching orders before checkout.',
};

export default function CartPage() {
    return <CartPageClient />;
}
