'use client';

import { useState, useMemo, useCallback } from 'react';
import FabricFilterBar from '@/components/fabrics/FabricFilterBar';
import FabricCard from '@/components/products/FabricCard';
import FabricDetailDrawer from '@/components/fabrics/FabricDetailDrawer';
import type { IFabricProduct, FabricSubcategory } from '@/types/product';

// ============================================================================
// SECTION METADATA
// ============================================================================

const SECTIONS: { id: FabricSubcategory; title: string; subtitle: string }[] = [
    { id: 'linen',     title: 'Linen',                    subtitle: 'Light, breathable, timeless' },
    { id: 'cotton',    title: 'Cotton & Cotton Blends',   subtitle: 'Everyday comfort, every occasion' },
    { id: 'polyester', title: 'Polyester & Blends',       subtitle: 'Easy-care, wrinkle-resistant' },
    { id: 'silk',      title: 'Silk & Satin',             subtitle: 'Lustrous, premium, festive-ready' },
    { id: 'wool',      title: 'Woolen & Winter',          subtitle: 'Warm, structured, classic' },
    { id: 'special',   title: 'Special Occasion',         subtitle: 'Brocade, zari, velvet — festive essentials' },
    { id: 'fabric' as any, title: 'Latest Collection',    subtitle: 'Newly added premium fabrics' },
];

// ============================================================================
// SECTION ROW
// ============================================================================

function FabricSection({
    title,
    subtitle,
    items,
    onOpenDrawer,
}: {
    title: string;
    subtitle: string;
    items: IFabricProduct[];
    onOpenDrawer: (f: IFabricProduct) => void;
}) {
    if (items.length === 0) return null;

    return (
        <section className="px-4" aria-labelledby={`section-${title}`}>
            {/* Header */}
            <div className="mb-3">
                <h2 id={`section-${title}`} className="text-base font-extrabold text-white leading-tight">
                    {title}
                </h2>
                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {subtitle}
                </p>
                <div className="mt-2 h-0.5 w-8 rounded-full" style={{ backgroundColor: '#D4A853' }} />
            </div>

            {/* 2-column grid */}
            <div className="grid grid-cols-2 gap-3">
                {items.map((f) => (
                    <FabricCard key={f._id} fabric={f} onOpenDrawer={onOpenDrawer} />
                ))}
            </div>
        </section>
    );
}

// ============================================================================
// PAGE CLIENT SHELL
// ============================================================================

interface FabricsPageClientProps {
    allFabrics: IFabricProduct[];
}

export default function FabricsPageClient({ allFabrics }: FabricsPageClientProps) {
    const [activeFilter, setActiveFilter] = useState<FabricSubcategory | 'all'>('all');
    const [drawerFabric, setDrawerFabric] = useState<IFabricProduct | null>(null);

    const openDrawer  = useCallback((f: IFabricProduct) => setDrawerFabric(f), []);
    const closeDrawer = useCallback(() => setDrawerFabric(null), []);

    // Derive visible sections from the active filter
    const visibleSections = useMemo(() => {
        if (activeFilter === 'all') {
            return SECTIONS.map((s) => ({
                ...s,
                items: allFabrics.filter((f) => f.subcategory === s.id),
            }));
        }
        const meta = SECTIONS.find((s) => s.id === (activeFilter as string));
        if (!meta) return [];
        return [{
            ...meta,
            items: allFabrics.filter((f) => f.subcategory === activeFilter),
        }];
    }, [activeFilter, allFabrics]);

    return (
        <>
            {/* Sticky filter bar */}
            <FabricFilterBar active={activeFilter} onChange={setActiveFilter} />

            {/* Page header */}
            <div className="px-4 pt-5 pb-4">
                <h1 className="text-2xl font-extrabold text-white leading-tight">Fabrics</h1>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {allFabrics.length} fabrics available · Buy by the meter
                </p>
            </div>

            {/* Sections */}
            <div className="flex flex-col gap-8 pb-8">
                {visibleSections.map((s) => (
                    <FabricSection
                        key={s.id}
                        title={s.title}
                        subtitle={s.subtitle}
                        items={s.items}
                        onOpenDrawer={openDrawer}
                    />
                ))}
            </div>

            {/* Detail drawer — portal-like, rendered at root */}
            <FabricDetailDrawer fabric={drawerFabric} onClose={closeDrawer} />
        </>
    );
}
