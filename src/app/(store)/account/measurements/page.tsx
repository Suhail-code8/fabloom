import type { Metadata } from 'next';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import MeasurementsListClient from '@/components/account/MeasurementsListClient';

export const metadata: Metadata = {
    title: 'My Measurements - Fabloom',
    description: 'Manage your custom measurement profiles.',
};

export default async function MeasurementsPage() {
    const user = await currentUser();
    if (!user) redirect('/sign-in');

    return <MeasurementsListClient />;
}
