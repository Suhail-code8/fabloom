import type { Metadata } from 'next';
import InventoryPageClient from '@/components/admin/inventory/InventoryPageClient';

export const metadata: Metadata = {
    title: 'Inventory Management — Fabloom Admin',
    description: 'Manage products, readymade stock sizes, fabrics, and accessories.',
};

export default function InventoryPage() {
    return <InventoryPageClient />;
}
