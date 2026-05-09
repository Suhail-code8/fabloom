import type { Metadata } from 'next';
import DashboardClient from '@/components/admin/dashboard/DashboardClient';

export const metadata: Metadata = {
    title: 'Dashboard — Fabloom Admin',
    description: 'Operational overview and metrics for the Fabloom store.',
};

export default function AdminDashboardPage() {
    return <DashboardClient />;
}
