import type { Metadata } from 'next';
import CustomersClient from '@/components/admin/customers/CustomersClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Customers — Fabloom Admin',
    description: 'View and manage all registered Fabloom customers.',
};

export default function CustomersPage() {
    return <CustomersClient />;
}
