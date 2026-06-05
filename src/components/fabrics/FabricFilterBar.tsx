'use client';

import type { FabricSubcategory } from '@/types/product';

// ============================================================================
// FILTER PILL DATA
// ============================================================================

const PILLS: { id: FabricSubcategory; label: string }[] = [
    { id: 'all',       label: 'All' },
    { id: 'linen',     label: 'Linen' },
    { id: 'cotton',    label: 'Cotton' },
    { id: 'polyester', label: 'Polyester' },
    { id: 'silk',      label: 'Silk' },
    { id: 'wool',      label: 'Woolen' },
    { id: 'special',   label: 'Special' },
];

// ============================================================================
// COMPONENT
// ============================================================================

interface FabricFilterBarProps {
    active: FabricSubcategory;
    onChange: (id: FabricSubcategory) => void;
}

export default function FabricFilterBar({ active, onChange }: FabricFilterBarProps) {
    return (
        <div
            className="store-sticky-subnav border-b border-white/10 py-2.5 min-h-[var(--store-subnav-h)]"
            style={{ backgroundColor: '#0f1035' }}
        >
            <div
                className="flex gap-2 overflow-x-auto px-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                role="tablist"
                aria-label="Filter fabrics by type"
            >
                {PILLS.map((pill) => {
                    const isActive = active === pill.id;
                    return (
                        <button
                            key={pill.id}
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => onChange(pill.id)}
                            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold min-h-[36px] transition-all duration-200 active:scale-95"
                            style={{
                                backgroundColor: isActive ? '#D4A853' : 'rgba(255,255,255,0.08)',
                                color: isActive ? '#0f1035' : 'rgba(255,255,255,0.65)',
                                border: isActive
                                    ? '1.5px solid #D4A853'
                                    : '1.5px solid rgba(255,255,255,0.1)',
                                fontWeight: isActive ? 700 : 500,
                            }}
                        >
                            {pill.label}
                        </button>
                    );
                })}
            </div>
            <style>{`div::-webkit-scrollbar{display:none}`}</style>
        </div>
    );
}
