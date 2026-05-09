import type { Metadata } from 'next';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import NotificationsClient from '@/components/account/NotificationsClient';

export const metadata: Metadata = {
    title: 'Notification Settings - Fabloom',
    description: 'Manage your Fabloom notification preferences.',
};

export default async function NotificationsPage() {
    const user = await currentUser();
    if (!user) redirect('/sign-in');

    return <NotificationsClient />;
}
