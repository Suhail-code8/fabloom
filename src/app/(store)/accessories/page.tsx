import type { Metadata } from 'next';
import AccessoriesPageClient from '@/components/accessories/AccessoriesPageClient';
import { getProductsAction } from '@/lib/dal';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Accessories — Fabloom',
    description: 'Shop hijabs, scarves, belts, socks, wallets, watches, and pocket squares at Fabloom.',
};

export default async function AccessoriesPage() {
    // PRODUCTION HARDENING: Fetch via DAL directly
    const allAccessories: any[] = await getProductsAction({ type: 'accessory', limit: 100 });
    
    // Filter out perfumes and caps
    const filtered = allAccessories.filter(p => !['perfume', 'cap'].includes(p.subcategory));

    return <AccessoriesPageClient accessories={filtered} />;
}
