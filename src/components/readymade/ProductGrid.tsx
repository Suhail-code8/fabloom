'use client';

import { useMemo, type RefObject } from 'react';
import ReadymadeCard from '@/components/products/ReadymadeCard';
import { useReadymadeFilters } from '@/components/readymade/ReadymadeFilterContext';
import type { IReadymadeProduct } from '@/types/product';

// ============================================================================
// TYPES
// ============================================================================

interface ProductGridProps {
    title: string;
    subtitle?: string;
    items: IReadymadeProduct[];
    columns: 2 | 3;
    cardStyle: 'portrait' | 'landscape';
    sectionRef?: RefObject<HTMLElement>;
    sectionId: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function ProductGrid({
    title,
    subtitle,
    items,
    columns,
    cardStyle,
    sectionRef,
    sectionId,
}: ProductGridProps) {
    const { applyToProducts } = useReadymadeFilters();

    // Apply client-side filters every time filter state changes
    const filtered = useMemo(() => applyToProducts(items), [applyToProducts, items]);

    if (filtered.length === 0) return null; // hide section entirely when no results

    const gridClass =
        columns === 3
            ? 'store-product-grid !grid-cols-3 md:!grid-cols-3 lg:!grid-cols-3 gap-2'
            : cardStyle === 'landscape'
            ? 'flex flex-col gap-3'
            : 'store-product-grid';

    return (
        <section
            ref={sectionRef}
            id={sectionId}
            className="scroll-mt-[var(--store-scroll-with-subnav)]"
            aria-labelledby={`${sectionId}-heading`}
        >
            {/* Section header */}
            <div className="flex items-end justify-between mb-3 px-4">
                <div>
                    <h2
                        id={`${sectionId}-heading`}
                        className="text-base font-extrabold text-white leading-tight"
                    >
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            {subtitle}
                        </p>
                    )}
                </div>
                <span
                    className="text-[11px] font-medium"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                    {filtered.length} item{filtered.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Gold underline accent */}
            <div
                className="mx-4 mb-3 h-0.5 rounded-full w-10"
                style={{ backgroundColor: '#D4A853' }}
                aria-hidden
            />

            {/* Grid */}
            <div className={`${gridClass} px-4`}>
                {filtered.map((product) => (
                    <div key={product._id} className="h-full min-h-0">
                        <ReadymadeCard
                            product={product}
                            cardStyle={cardStyle}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
