import type { Metadata } from 'next';
import CapsPageClient from '@/components/caps/CapsPageClient';
import { getProductsAction } from '@/lib/dal';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Caps & Headwear — Fabloom',
    description: 'Shop Kufi caps, Prayer caps, Taqiyah, Snapbacks, and Summer hats. Multiple colours and sizes.',
};

export default async function CapsPage() {
    // PRODUCTION HARDENING: Fetch via DAL directly
    const allAccessories: any[] = await getProductsAction({ type: 'accessory', limit: 100 });
    
    // Filter for caps
    const caps = allAccessories.filter(p => ['cap', 'kufi', 'prayer', 'snapback', 'taqiyah', 'summer'].includes(p.subcategory));

    // Derive unique colors with hex codes
    const colorMap: Record<string, string> = {
        'White': '#FFFFFF',
        'Black': '#000000',
        'Navy Blue': '#000080',
        'Amber': '#FFBF00',
        'Cream': '#F5F5DC',
        'Brown': '#A52A2A',
        'Grey': '#808080',
    };

    const uniqueColorNames = Array.from(new Set(caps.map((p: any) => p.color).filter(Boolean)));
    const allColors = uniqueColorNames.map(name => ({
        name,
        hex: colorMap[name] || '#D4A853', // Fallback to gold
        stock: 1 // Default for derived colors
    }));

    return <CapsPageClient caps={caps} allColors={allColors as any} />;
}
