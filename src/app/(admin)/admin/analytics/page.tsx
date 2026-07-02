import type { Metadata } from 'next';
import AnalyticsClient from '@/components/admin/analytics/AnalyticsClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Analytics — Fabloom Admin',
    description: 'Revenue trends, order breakdowns, and stitching job statistics.',
};

export default function AnalyticsPage() {
    return <AnalyticsClient />;
}
