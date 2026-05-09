import type { Metadata } from 'next';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AccountClient from '@/components/account/AccountClient';

export const metadata: Metadata = {
    title: 'My Account - Fabloom',
    description: 'Manage your Fabloom account, orders, and measurements.',
};

export default async function AccountPage() {
    const user = await currentUser();
    
    // Server-side auth check
    if (!user) {
        redirect('/sign-in');
    }

    return <AccountClient />;
}
