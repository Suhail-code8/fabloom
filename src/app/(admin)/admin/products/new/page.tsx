import type { Metadata } from 'next';
import AddProductClient from '@/components/admin/products/new/AddProductClient';

export const metadata: Metadata = {
    title: 'Add New Product — Fabloom Admin',
    description: 'Create a new readymade, fabric, or accessory product.',
};

export default function AddProductPage() {
    return <AddProductClient />;
}
