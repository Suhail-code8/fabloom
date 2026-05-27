import type { Metadata } from 'next';
import PerfumesPageClient from '@/components/perfumes/PerfumesPageClient';
import { getProductsAction } from '@/lib/dal';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Perfumes & Fragrances — Fabloom',
    description: 'Shop premium Arabian Oud, floral, fresh, and woody fragrances. Gift sets available.',
};

export default async function PerfumesPage() {
    // PRODUCTION HARDENING: Fetch via DAL directly
    const allAccessories: any[] = await getProductsAction({ type: 'accessory', limit: 100 });
    
    // Filter for perfumes only (support both legacy and new classification)
    const perfumes = allAccessories.filter(p => p.subcategory === 'perfume' || ['arabian', 'floral', 'fresh', 'woody', 'gift-set'].includes(p.subcategory));

    return <PerfumesPageClient perfumes={perfumes} />;
}
