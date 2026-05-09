import type { Metadata } from 'next';
import ReadymadePageClient from '@/components/readymade/ReadymadePageClient';
import { getProductsAction } from '@/lib/dal';

// ============================================================================
// ISR CONFIG — revalidate every hour
// ============================================================================

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = {
    title: 'Ready-to-Wear Fashion — Fabloom',
    description:
        'Shop our premium collection of pre-stitched kurtas, thobes, and designer wear. Perfect fit, ready to ship.',
    openGraph: {
        title: 'Ready-to-Wear Fashion — Fabloom',
        description: 'Premium pre-stitched garments including Kurtas, Thobes and more.',
    },
};

// ============================================================================
// PAGE — Server Component
// ============================================================================

export default async function ReadymadePage() {
    // PRODUCTION HARDENING: Fetch via DAL directly
    const products: any[] = await getProductsAction({ type: 'readymade', limit: 100 });

    // Grouping helper
    const getSub = (sub: string) => products.filter(p => p.subcategory === sub);

    return (
        <div className="min-h-full" style={{ backgroundColor: '#0f1035' }}>
            <ReadymadePageClient 
                products={products}
                kurtas={getSub('kurta')}
                kandooras={getSub('kandoora')}
                thobes={getSub('thobe')}
                shirts={getSub('shirt')}
                pants={getSub('pants')}
                coords={getSub('coord-set')}
            />
        </div>
    );
}
