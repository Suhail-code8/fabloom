import type { Metadata } from 'next';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import WishlistClient from '@/components/wishlist/WishlistClient';

export const metadata: Metadata = {
    title: 'Wishlist - Fabloom',
    description: 'Items you have saved for later.',
};

export default async function WishlistPage() {
    const user = await currentUser();
    if (!user) redirect('/sign-in');

    return <WishlistClient />;
}
