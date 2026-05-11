'use client';

import { useRef, useState, useEffect } from 'react';
import { ReadymadeFilterProvider } from '@/components/readymade/ReadymadeFilterContext';
import SubCategoryNav from '@/components/readymade/SubCategoryNav';
import ProductGrid from '@/components/readymade/ProductGrid';
import FilterSheet from '@/components/readymade/FilterSheet';
import type { IReadymadeProduct } from '@/types/product';

// ============================================================================
// TYPES
// ============================================================================

interface SectionDef {
    id: string;
    label: string;
    title: string;
    subtitle?: string;
    items: IReadymadeProduct[];
    columns: 2 | 3;
    cardStyle: 'portrait' | 'landscape';
}

interface ReadymadePageClientProps {
    kurtas: IReadymadeProduct[];
    kandooras: IReadymadeProduct[];
    thobes: IReadymadeProduct[];
    shirts: IReadymadeProduct[];
    pants: IReadymadeProduct[];
    coords: IReadymadeProduct[];
}

// ============================================================================
// ACTIVE SECTION HOOK — tracks which section is nearest to the top
// ============================================================================

function useActiveSection(sectionIds: string[]): [string, (id: string) => void] {
    const [active, setActive] = useState(sectionIds[0] ?? '');
    const isManualRef = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (isManualRef.current) return;
                
                // Find all entries that are intersecting
                const visible = entries.filter((e) => e.isIntersecting);
                if (visible.length > 0) {
                    // Pick the one closest to the top of the viewport
                    const sorted = visible.sort((a, b) => 
                        Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
                    );
                    setActive(sorted[0].target.id);
                }
            },
            { rootMargin: '-10% 0px -80% 0px', threshold: 0 }
        );

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [sectionIds]);

    const setManualActive = (id: string) => {
        isManualRef.current = true;
        setActive(id);
        // Reset manual flag after a delay to allow intersection observer to resume
        setTimeout(() => { isManualRef.current = false; }, 800);
    };

    return [active, setManualActive];
}

// ============================================================================
// INNER CLIENT COMPONENT (needs filter context)
// ============================================================================

function PageInner({ sections }: { sections: SectionDef[] }) {
    const [filterOpen, setFilterOpen] = useState(false);
    const sectionRefs = useRef<Record<string, React.RefObject<HTMLElement | null>>>(
        Object.fromEntries(sections.map((s) => [s.id, { current: null }])) as any
    );

    const [activeSection, setActiveSection] = useActiveSection(sections.map((s) => s.id));
    
    const onPillClick = (id: string, ref: React.RefObject<HTMLElement | null>) => {
        setActiveSection(id);
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const pills = sections.map((s) => ({
        id: s.id,
        label: s.label,
        sectionRef: sectionRefs.current[s.id],
    }));

    return (
        <>
            {/* Sticky sub-category pill nav */}
            <SubCategoryNav
                pills={pills as any}
                activeSection={activeSection}
                onPillClick={onPillClick}
                onFilterOpen={() => setFilterOpen(true)}
            />

            {/* Page header */}
            <div className="px-4 pt-5 pb-4">
                <h1 className="text-2xl font-extrabold text-white leading-tight">
                    Readymade
                </h1>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Premium fits — delivered ready to wear
                </p>
            </div>

            {/* Sections */}
            <div className="flex flex-col gap-8 pb-20">
                {sections.map((section) => (
                    <ProductGrid
                        key={section.id}
                        sectionId={section.id}
                        sectionRef={sectionRefs.current[section.id] as any}
                        title={section.title}
                        subtitle={section.subtitle}
                        items={section.items}
                        columns={section.columns}
                        cardStyle={section.cardStyle}
                    />
                ))}
            </div>

            {/* Filter bottom sheet */}
            <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} />
        </>
    );
}

// ============================================================================
// EXPORTED SHELL — wraps with the filter context provider
// ============================================================================

export default function ReadymadePageClient({
    products, // Pass the whole array for easier fallback filtering
    kurtas,
    kandooras,
    thobes,
    shirts,
    pants,
    coords,
}: ReadymadePageClientProps & { products: IReadymadeProduct[] }) {
    const sections: SectionDef[] = [
        {
            id: 'kurta',
            label: 'Kurta',
            title: 'Kurta',
            subtitle: 'Timeless everyday silhouettes',
            items: kurtas,
            columns: 2,
            cardStyle: 'portrait',
        },
        {
            id: 'kandoora',
            label: 'Kandoora',
            title: 'Kandoora & Jubba',
            subtitle: 'Elegant Gulf-style pieces',
            items: kandooras,
            columns: 2,
            cardStyle: 'portrait',
        },
        {
            id: 'thobe',
            label: 'Thobe',
            title: 'Thobe',
            subtitle: 'Classic Arabic styling',
            items: thobes,
            columns: 2,
            cardStyle: 'portrait',
        },
        {
            id: 'shirts',
            label: 'Shirts',
            title: 'Casual Shirts',
            subtitle: 'Modern cuts for everyday',
            items: shirts,
            columns: 3,
            cardStyle: 'portrait',
        },
        {
            id: 'pants',
            label: 'Pants',
            title: 'Pants & Bottoms',
            subtitle: 'Comfortable fits from waist to ankle',
            items: pants,
            columns: 2,
            cardStyle: 'landscape',
        },
        {
            id: 'readymade',
            label: 'New Arrivals',
            title: 'New Arrivals',
            subtitle: 'Recently added readymade pieces',
            items: products.filter(p => p.subcategory === 'readymade' || !['kurta', 'kandoora', 'thobe', 'shirt', 'pants', 'coord-set'].includes(p.subcategory || '')),
            columns: 2,
            cardStyle: 'portrait',
        },
    ];

    return (
        <ReadymadeFilterProvider>
            <PageInner sections={sections} />
        </ReadymadeFilterProvider>
    );
}
