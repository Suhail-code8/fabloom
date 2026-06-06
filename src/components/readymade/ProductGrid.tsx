'use client';

import { useMemo, type RefObject } from 'react';
import ReadymadeCard from '@/components/products/ReadymadeCard';
import { useReadymadeFilters } from '@/components/readymade/ReadymadeFilterContext';
import type { IReadymadeProduct } from '@/types/product';

interface ProductGridProps {
    title: string;
    subtitle?: string;
    items: IReadymadeProduct[];
    sectionRef?: RefObject<HTMLElement>;
    sectionId: string;
}

export default function ProductGrid({
    title,
    subtitle,
    items,
    sectionRef,
    sectionId,
}: ProductGridProps) {
    const { applyToProducts } = useReadymadeFilters();
    const filtered = useMemo(() => applyToProducts(items), [applyToProducts, items]);

    if (filtered.length === 0) return null;

    return (
        <section
            ref={sectionRef}
            id={sectionId}
            className="scroll-mt-[var(--store-scroll-with-subnav)]"
            aria-labelledby={`${sectionId}-heading`}
        >
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

            <div
                className="mx-4 mb-3 h-0.5 rounded-full w-10"
                style={{ backgroundColor: '#D4A853' }}
                aria-hidden
            />

            <div className="store-product-grid px-4">
                {filtered.map((product) => (
                    <div key={product._id} className="h-full min-h-0">
                        <ReadymadeCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
}
