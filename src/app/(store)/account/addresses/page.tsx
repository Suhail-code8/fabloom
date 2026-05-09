import type { Metadata } from 'next';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AddressesListClient from '@/components/account/AddressesListClient';

export const metadata: Metadata = {
    title: 'Saved Addresses - Fabloom',
    description: 'Manage your saved delivery addresses.',
};

export default async function AddressesPage() {
    const user = await currentUser();
    if (!user) redirect('/sign-in');

    return <AddressesListClient />;
}
