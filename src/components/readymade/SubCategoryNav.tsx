'use client';

import { type RefObject } from 'react';
import { useReadymadeFilters } from '@/components/readymade/ReadymadeFilterContext';

// ============================================================================
// TYPES
// ============================================================================

interface SubCategoryPill {
    id: string;
    label: string;
    sectionRef: RefObject<HTMLElement>;
}

interface SubCategoryNavProps {
    pills: SubCategoryPill[];
    activeSection: string;
    onPillClick: (id: string, ref: RefObject<HTMLElement>) => void;
    onFilterOpen: () => void;
}

// ============================================================================
// FILTER ICON
// ============================================================================

const FilterIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
);

// ============================================================================
// COMPONENT
// ============================================================================

export default function SubCategoryNav({
    pills,
    activeSection,
    onPillClick,
    onFilterOpen,
}: SubCategoryNavProps) {
    const { activeFilterCount } = useReadymadeFilters();

    return (
        <div className="flex items-center gap-2 py-2 pb-2.5">
            {/* Scrollable pills */}
            <div
                className="flex-1 flex gap-2 overflow-x-auto pl-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {pills.map((pill) => {
                    const isActive = activeSection === pill.id;
                    return (
                        <button
                            key={pill.id}
                            onClick={() => onPillClick(pill.id, pill.sectionRef)}
                            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 min-h-[36px]"
                            style={{
                                backgroundColor: isActive
                                    ? '#D4A853'
                                    : 'rgba(255,255,255,0.06)',
                                color: isActive ? '#0f1035' : 'rgba(255,255,255,0.65)',
                                border: isActive
                                    ? '1.5px solid #D4A853'
                                    : '1.5px solid rgba(255,255,255,0.1)',
                                boxShadow: isActive
                                    ? '0 0 14px rgba(212,168,83,0.4), 0 2px 8px rgba(0,0,0,0.2)'
                                    : 'none',
                                fontWeight: isActive ? 700 : 500,
                            }}
                            aria-current={isActive ? 'true' : undefined}
                        >
                            {pill.label}
                        </button>
                    );
                })}
                {/* trailing spacer before filter button */}
                <div className="flex-shrink-0 w-2" aria-hidden />
            </div>

            {/* Filter / Sort button */}
            <button
                onClick={onFilterOpen}
                aria-label="Open filters"
                className="relative flex-shrink-0 flex items-center gap-1.5 mr-4 px-3 py-1.5 rounded-full min-h-[36px] text-xs font-semibold transition-all duration-200 active:scale-95"
                style={{
                    backgroundColor: activeFilterCount > 0
                        ? 'rgba(212,168,83,0.18)'
                        : 'rgba(255,255,255,0.08)',
                    color: activeFilterCount > 0 ? '#D4A853' : 'rgba(255,255,255,0.7)',
                    border: activeFilterCount > 0
                        ? '1.5px solid #D4A853'
                        : '1.5px solid rgba(255,255,255,0.12)',
                }}
            >
                <FilterIcon />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-bold"
                        style={{ backgroundColor: '#ef4444', color: '#fff' }}
                    >
                        {activeFilterCount}
                    </span>
                )}
            </button>

            <style>{`div::-webkit-scrollbar{display:none}`}</style>
        </div>
    );
}
