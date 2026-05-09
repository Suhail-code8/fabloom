'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import type { IPerfumeProduct, FragranceFamily } from '@/types/product';

// ============================================================================
// FILTER BAR
// ============================================================================

const PILLS: { id: FragranceFamily | 'all'; label: string }[] = [
    { id: 'all',      label: 'All' },
    { id: 'arabian',  label: 'Arabian' },
    { id: 'floral',   label: 'Floral' },
    { id: 'fresh',    label: 'Fresh' },
    { id: 'woody',    label: 'Woody' },
    { id: 'gift-set', label: 'Gift Sets' },
];

// ============================================================================
// FRAGRANCE NOTES PYRAMID
// ============================================================================

function NotesPyramid({ notes }: { notes: IPerfumeProduct['fragranceNotes'] }) {
    return (
        <div className="flex flex-col gap-1 mt-2">
            {([
                { label: 'Top',   notes: notes.top,   w: '60%',  bg: 'rgba(212,168,83,0.18)' },
                { label: 'Heart', notes: notes.heart, w: '80%',  bg: 'rgba(212,168,83,0.10)' },
                { label: 'Base',  notes: notes.base,  w: '100%', bg: 'rgba(212,168,83,0.05)' },
            ] as const).map((row) => (
                <div key={row.label} className="flex flex-col items-center" style={{ width: row.w, margin: '0 auto' }}>
                    <div
                        className="w-full rounded-md px-2 py-1 text-center"
                        style={{ backgroundColor: row.bg }}
                    >
                        <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">{row.label}</p>
                        <p className="text-[9px] font-semibold text-gray-700 leading-tight">
                            {row.notes.join(', ')}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ============================================================================
// PERFUME CARD
// ============================================================================

function PerfumeCard({ perfume }: { perfume: IPerfumeProduct }) {
    const [showNotes, setShowNotes] = useState(false);

    return (
        <div
            className="flex flex-col rounded-2xl overflow-hidden bg-white transition-all duration-150"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.09)' }}
        >
            {/* Image — square */}
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
                {perfume.images?.[0] ? (
                    <img src={perfume.images[0]} alt={perfume.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(212,168,83,.25) 0%,rgba(15,16,53,.15) 100%)' }} />
                )}
                {/* Gender tag */}
                {perfume.gender && (
                    <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(15,16,53,0.8)', color: '#D4A853' }}>
                        {perfume.gender}
                    </span>
                )}
                {/* Volume */}
                {perfume.volume && (
                    <span className="absolute bottom-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#374151' }}>
                        {perfume.volume}ml
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="px-3 pt-2 pb-3">
                <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug min-h-[32px]">{perfume.name}</p>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-sm font-extrabold" style={{ color: '#0f1035' }}>₹{perfume.price.toLocaleString('en-IN')}</p>
                    {perfume.concentration && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}>
                            {perfume.concentration}
                        </span>
                    )}
                </div>

                {/* Notes toggle */}
                <button
                    onClick={() => setShowNotes((v) => !v)}
                    className="mt-2 text-[10px] font-semibold flex items-center gap-1 active:opacity-70"
                    style={{ color: '#D4A853' }}
                >
                    {showNotes ? 'Hide' : 'View'} fragrance notes
                    <svg className="w-3 h-3 transition-transform" style={{ transform: showNotes ? 'rotate(180deg)' : 'none' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>

                {showNotes && perfume.fragranceNotes && <NotesPyramid notes={perfume.fragranceNotes} />}
            </div>
        </div>
    );
}

// ============================================================================
// PAGE CLIENT
// ============================================================================

export default function PerfumesPageClient({ perfumes }: { perfumes: IPerfumeProduct[] }) {
    const [active, setActive] = useState<FragranceFamily | 'all'>('all');

    const filtered = useMemo(() =>
        active === 'all' ? perfumes : perfumes.filter((p) => p.subcategory === active),
        [active, perfumes]
    );

    const SECTIONS = [
        { id: 'arabian' as FragranceFamily, title: 'Arabian Oud',        subtitle: 'Rich, deep, and timeless' },
        { id: 'floral'  as FragranceFamily, title: 'Floral',             subtitle: 'Blooming, feminine elegance' },
        { id: 'fresh'   as FragranceFamily, title: 'Fresh & Citrus',     subtitle: 'Light, energising, everyday' },
        { id: 'woody'   as FragranceFamily, title: 'Woody & Musk',       subtitle: 'Grounding, warm, masculine' },
        { id: 'gift-set'as FragranceFamily, title: 'Gift Sets',          subtitle: 'Curated for gifting' },
        { id: 'perfume' as any,            title: 'Latest Fragrances',   subtitle: 'Our signature scents' },
    ].filter((s) => {
        if (active === 'all') return true;
        return s.id === (active as string);
    });

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#0f1035' }}>
            {/* Header */}
            <div className="px-4 pt-5 pb-3">
                <h1 className="text-2xl font-extrabold text-white">Perfumes</h1>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {perfumes.length} fragrances · Arabian Oud to Fresh Citrus
                </p>
            </div>

            {/* Filter pills */}
            <div className="sticky z-20 border-b border-white/10 py-2.5 mb-5" style={{ top: '72px', backgroundColor: '#0f1035' }}>
                <div className="flex gap-2 overflow-x-auto px-4" style={{ scrollbarWidth: 'none' }}>
                    {PILLS.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setActive(p.id)}
                            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold min-h-[36px] transition-all duration-200 active:scale-95"
                            style={{
                                backgroundColor: active === p.id ? '#D4A853' : 'rgba(255,255,255,0.08)',
                                color: active === p.id ? '#0f1035' : 'rgba(255,255,255,0.65)',
                                border: active === p.id ? '1.5px solid #D4A853' : '1.5px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sections */}
            <div className="flex flex-col gap-8 pb-8">
                {SECTIONS.map((section) => {
                    const items = filtered.filter((p) => p.subcategory === section.id);
                    if (!items.length) return null;
                    return (
                        <section key={section.id} className="px-4" aria-labelledby={`perf-${section.id}`}>
                            <h2 id={`perf-${section.id}`} className="text-base font-extrabold text-white mb-0.5">{section.title}</h2>
                            <p className="text-[11px] mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>{section.subtitle}</p>
                            <div className="h-0.5 w-8 rounded-full mb-3" style={{ backgroundColor: '#D4A853' }} />
                            <div className="grid grid-cols-2 gap-3">
                                {items.map((p) => (
                                    <PerfumeCard key={p._id} perfume={p as any} />
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
