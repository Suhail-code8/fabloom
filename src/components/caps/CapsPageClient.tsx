'use client';

import { useState, useMemo } from 'react';
import type { ICapProduct, CapSubcategory } from '@/types/product';
import AccessoryCard from '@/components/products/AccessoryCard';
import ColorSwatchGroup from '@/components/products/ColorSwatchGroup';

// ============================================================================
// FILTER BAR
// ============================================================================

const CAP_FILTERS: { id: CapSubcategory | 'all'; label: string }[] = [
    { id: 'all',      label: 'All' },
    { id: 'kufi',     label: 'Kufi' },
    { id: 'prayer',   label: 'Prayer' },
    { id: 'snapback', label: 'Snapback' },
    { id: 'taqiyah',  label: 'Taqiyah' },
    { id: 'summer',   label: 'Summer' },
];

// ============================================================================
// CAP CARD
// ============================================================================

function CapCard({ cap }: { cap: ICapProduct }) {
    const [selectedColor, setSelectedColor] = useState(cap.colorVariants?.[0]?.name ?? '');

    return (
        <AccessoryCard
            product={cap}
            aspectClass="aspect-[4/5]"
            href={`/products/${cap._id}`}
        >
            {/* Color swatches */}
            {cap.colorVariants && cap.colorVariants.length > 0 && (
                <ColorSwatchGroup
                    colors={cap.colorVariants}
                    selected={selectedColor}
                    onSelect={setSelectedColor}
                    max={5}
                />
            )}
            {/* Size pills */}
            {cap.sizeVariants && cap.sizeVariants.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                    {cap.sizeVariants.map((sz) => (
                        <span
                            key={sz}
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                            style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}
                        >
                            {sz}
                        </span>
                    ))}
                </div>
            )}
        </AccessoryCard>
    );
}

// ============================================================================
// COLOR FILTER BAR
// ============================================================================

function ColorFilterBar({
    allColors,
    selected,
    onSelect,
}: {
    allColors: { name: string; hex: string }[];
    selected: string | null;
    onSelect: (name: string | null) => void;
}) {
    return (
        <div className="px-4 mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Filter by colour
            </p>
            <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                {/* All */}
                <button
                    onClick={() => onSelect(null)}
                    className="flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-bold transition-all active:scale-90"
                    style={{
                        borderColor: selected === null ? '#D4A853' : 'rgba(255,255,255,0.25)',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.7)',
                    }}
                    aria-label="All colours"
                >
                    All
                </button>

                {allColors.map((c) => {
                    const isLight = ['#FFFFFF','#F5F0E8'].includes(c.hex);
                    return (
                        <button
                            key={c.name}
                            onClick={() => onSelect(selected === c.name ? null : c.name)}
                            className="flex-shrink-0 w-7 h-7 rounded-full transition-all active:scale-90"
                            style={{
                                backgroundColor: c.hex,
                                border: selected === c.name
                                    ? '2px solid #D4A853'
                                    : isLight ? '1.5px solid #d1d5db' : '2px solid transparent',
                                boxShadow: selected === c.name ? '0 0 0 2px rgba(212,168,83,0.4)' : 'none',
                            }}
                            aria-label={c.name}
                            aria-pressed={selected === c.name}
                            title={c.name}
                        />
                    );
                })}
            </div>
        </div>
    );
}

// ============================================================================
// PAGE CLIENT
// ============================================================================

export default function CapsPageClient({
    caps,
    allColors,
}: {
    caps: ICapProduct[];
    allColors: { name: string; hex: string; stock: number }[];
}) {
    const [activeFilter, setActiveFilter] = useState<CapSubcategory | 'all'>('all');
    const [colorFilter,  setColorFilter]  = useState<string | null>(null);

    const SECTIONS = [
        { id: 'kufi'     as CapSubcategory, title: 'Kufi Caps',     subtitle: 'Traditional knit & crochet' },
        { id: 'prayer'   as CapSubcategory, title: 'Prayer Caps',   subtitle: 'Simple, modest, everyday' },
        { id: 'snapback' as CapSubcategory, title: 'Snapback',      subtitle: 'Street-ready structured caps' },
        { id: 'taqiyah'  as CapSubcategory, title: 'Taqiyah',       subtitle: 'Classic Islamic skullcap' },
        { id: 'summer'   as CapSubcategory, title: 'Summer Hats',   subtitle: 'Beat the heat in style' },
        { id: 'cap'      as any,            title: 'Classic Collection', subtitle: 'Our signature headwear styles' },
    ].filter((s) => {
        if (activeFilter === 'all') return true;
        return s.id === (activeFilter as string);
    });

    const filtered = useMemo(() => {
        let result = caps;
        if (activeFilter !== 'all') result = result.filter((c) => c.subcategory === activeFilter);
        if (colorFilter) {
            result = result.filter((c) => 
                c.color === colorFilter || 
                c.colorVariants?.some((cv) => cv.name === colorFilter)
            );
        }
        return result;
    }, [caps, activeFilter, colorFilter]);

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#0f1035' }}>
            <div className="px-4 pt-5 pb-3">
                <h1 className="text-2xl font-extrabold text-white">Caps & Headwear</h1>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {caps.length} styles · Kufi to Snapback
                </p>
            </div>

            {/* Sub-category filter */}
            <div className="sticky z-20 border-b border-white/10 py-2.5" style={{ top: '72px', backgroundColor: '#0f1035' }}>
                <div className="flex gap-2 overflow-x-auto px-4" style={{ scrollbarWidth: 'none' }}>
                    {CAP_FILTERS.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setActiveFilter(p.id)}
                            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold min-h-[36px] transition-all active:scale-95"
                            style={{
                                backgroundColor: activeFilter === p.id ? '#D4A853' : 'rgba(255,255,255,0.08)',
                                color: activeFilter === p.id ? '#0f1035' : 'rgba(255,255,255,0.65)',
                                border: activeFilter === p.id ? '1.5px solid #D4A853' : '1.5px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Color filter bar */}
            <div className="pt-4">
                <ColorFilterBar allColors={allColors} selected={colorFilter} onSelect={setColorFilter} />
            </div>

            {/* Sections */}
            <div className="flex flex-col gap-8 pb-8">
                {SECTIONS.map((section) => {
                    const items = filtered.filter((c) => c.subcategory === section.id);
                    if (!items.length) return null;
                    return (
                        <section key={section.id} className="px-4" aria-labelledby={`cap-${section.id}`}>
                            <h2 id={`cap-${section.id}`} className="text-base font-extrabold text-white mb-0.5">{section.title}</h2>
                            <p className="text-[11px] mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>{section.subtitle}</p>
                            <div className="h-0.5 w-8 rounded-full mb-3" style={{ backgroundColor: '#D4A853' }} />
                            <div className="grid grid-cols-2 gap-3">
                                {items.map((c) => <CapCard key={c._id} cap={c} />)}
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
