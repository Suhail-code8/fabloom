import type { Metadata } from 'next';
import DashboardClient from '@/components/admin/dashboard/DashboardClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Dashboard — Fabloom Admin',
    description: 'Operational overview and metrics for the Fabloom store.',
};

export default function AdminDashboardPage() {
    try {
        return <DashboardClient />;
    } catch (error) {
        console.error('Admin dashboard page error:', error);
        return (
            <div className="p-8 text-center">
                <p className="text-sm font-bold text-gray-600">Dashboard could not load. Please refresh.</p>
            </div>
        );
    }
}
