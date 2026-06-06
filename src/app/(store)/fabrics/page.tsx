import type { Metadata } from 'next';
import FabricsPageClient from '@/components/fabrics/FabricsPageClient';
import { getProductsAction } from '@/lib/dal';

// ============================================================================
// ISR CONFIG
// ============================================================================

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = {
    title: 'Fabrics — Fabloom',
    description:
        'Shop premium fabrics by the meter — linen, cotton, silk, wool, and special occasion weaves. Stitching available for all fabrics.',
    openGraph: {
        title: 'Premium Fabrics — Fabloom',
        description: 'Buy linen, silk, cotton, wool and special fabrics by the meter. Custom stitching available.',
    },
};

// ============================================================================
// PAGE — Server Component
// ============================================================================

export default async function FabricsPage() {
    // PRODUCTION HARDENING: Fetch via DAL directly
    const fabrics = await getProductsAction({ type: 'fabric', limit: 100 });

    return (
        <div style={{ backgroundColor: '#0f1035' }}>
            <FabricsPageClient allFabrics={fabrics} />
        </div>
    );
}
