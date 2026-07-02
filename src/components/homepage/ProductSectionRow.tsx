'use client';

import Link from 'next/link';
import type { ProductSummary } from '@/lib/homepage';

// ============================================================================
// PRODUCT MINI CARD
// ============================================================================

function ProductMiniCard({ product }: { product: ProductSummary | any }) {
    const type = product.productType || product.type;
    const isFabric = type === 'fabric';
    const priceLabel = isFabric ? `₹${product.price}/m` : `₹${product.price}`;

    // Determine the correct route prefix
    const routePrefix = type === 'readymade' ? 'readymade' : type === 'fabric' ? 'fabrics' : 'accessories';
    const identifier = product.slug || product._id;

    return (
        <Link
            href={`/${routePrefix}/${identifier}`}
            className="flex-shrink-0 block rounded-2xl overflow-hidden group transition-all duration-300 active:opacity-80"
            style={{
                width: '148px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(212,168,83,0.35)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 28px rgba(212,168,83,0.12)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.2)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
            }}
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
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    style={{ transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)' }}
                />

                {/* Gold shimmer on hover */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
                    style={{ background: 'linear-gradient(135deg, rgba(212,168,83,0.1) 0%, transparent 70%)' }}
                />

                {/* Product type badge */}
                <span
                    className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgba(212,168,83,0.92)', color: '#0f1035' }}
                >
                    {isFabric ? 'Fabric' : type === 'accessory' ? 'Acc.' : 'Ready'}
                </span>
            </div>

            {/* Info */}
            <div className="px-3 py-2.5">
                <p
                    className="text-xs font-semibold leading-snug line-clamp-2 mb-1"
                    style={{ color: 'rgba(255,255,255,0.88)' }}
                >
                    {product.name}
                </p>
                <p
                    className="text-sm font-extrabold"
                    style={{
                        background: 'linear-gradient(135deg, #D4A853, #f3bf4d)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
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
                        className="text-lg font-extrabold leading-tight"
                        style={{ color: 'rgba(255,255,255,0.95)' }}
                    >
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
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

                {/* Trailing spacer */}
                <div className="flex-shrink-0 w-4" aria-hidden />
            </div>

            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        </section>
    );
}
