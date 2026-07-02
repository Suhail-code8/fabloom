import type { Metadata } from 'next';
import MeasurementsClient from '@/components/admin/measurements/MeasurementsClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Measurement Profiles — Fabloom Admin',
    description: 'View customer measurement profiles and tailoring preferences.',
};

export default function MeasurementsPage() {
    return <MeasurementsClient />;
}
