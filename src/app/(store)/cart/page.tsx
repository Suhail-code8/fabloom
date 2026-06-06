import type { Metadata } from 'next';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CartPageClient from '@/components/cart/CartPageClient';

export const metadata: Metadata = {
    title: 'Your Cart - Fabloom',
    description: 'Review your items and custom stitching orders before checkout.',
};

export default async function CartPage() {
    const user = await currentUser();
    if (!user) {
        redirect('/sign-in');
    }

    return <CartPageClient />;
}
