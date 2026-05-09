'use client';

import Link from 'next/link';
import type { ProductSummary } from '@/lib/homepage';

// ============================================================================
// PRODUCT MINI CARD
// ============================================================================

function ProductMiniCard({ product }: { product: ProductSummary }) {
    const isFabric = product.productType === 'fabric';
    const priceLabel = isFabric ? `₹${product.price}/m` : `₹${product.price}`;

    return (
        <Link
            href={`/products/${product.slug}`}
            className="flex-shrink-0 block rounded-2xl overflow-hidden active:opacity-80 transition-opacity duration-150"
            style={{ width: '148px', backgroundColor: 'rgba(255,255,255,0.05)' }}
            aria-label={product.name}
        >
            {/* Image area */}
            <div
                className="relative w-full overflow-hidden"
                style={{
                    height: '148px',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                }}
            >
                <img 
                    src={product.images?.[0] ?? '/placeholder-product.jpg'} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Product type badge */}
                <span
                    className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgba(212,168,83,0.9)', color: '#0f1035' }}
                >
                    {isFabric ? 'Fabric' : product.productType === 'accessory' ? 'Acc.' : 'Ready'}
                </span>
            </div>

            {/* Info */}
            <div className="px-3 py-2.5">
                <p
                    className="text-xs font-semibold leading-snug line-clamp-2 mb-1"
                    style={{ color: 'rgba(255,255,255,0.9)' }}
                >
                    {product.name}
                </p>
                <p className="text-sm font-extrabold" style={{ color: '#D4A853' }}>
                    {priceLabel}
                </p>
            </div>
        </Link>
    );
}

// ============================================================================
// SECTION ROW
// ============================================================================

interface ProductSectionRowProps {
    title: string;
    subtitle?: string;
    products: ProductSummary[];
    viewAllHref: string;
}

export default function ProductSectionRow({
    title,
    subtitle,
    products,
    viewAllHref,
}: ProductSectionRowProps) {
    return (
        <section className="pl-4" aria-labelledby={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}>
            {/* Header */}
            <div className="flex items-end justify-between pr-4 mb-3">
                <div>
                    <h2
                        id={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
                        className="text-lg font-extrabold text-white leading-tight"
                    >
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            {subtitle}
                        </p>
                    )}
                </div>
                <Link
                    href={viewAllHref}
                    className="text-xs font-semibold flex items-center gap-1 transition-opacity duration-150 active:opacity-60"
                    style={{ color: '#D4A853' }}
                >
                    View all
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </Link>
            </div>

            {/* Horizontal scroll row */}
            <div
                className="flex gap-3 overflow-x-auto pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((p) => (
                    <ProductMiniCard key={p._id} product={p} />
                ))}

                {/* Trailing spacer so last card isn't flush to edge */}
                <div className="flex-shrink-0 w-4" aria-hidden />
            </div>

            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        </section>
    );
}
