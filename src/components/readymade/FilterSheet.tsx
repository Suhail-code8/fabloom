'use client';

import { useEffect, useRef } from 'react';
import { useReadymadeFilters } from '@/components/readymade/ReadymadeFilterContext';
import type { ReadymadeFilters, SizeKey } from '@/types/product';

// ============================================================================
// CONSTANTS
// ============================================================================

const SIZES: SizeKey[] = ['S', 'M', 'L', 'XL', 'XXL'];
const SORT_OPTIONS: { value: ReadymadeFilters['sortBy']; label: string }[] = [
    { value: 'latest',     label: 'Latest Arrivals' },
    { value: 'price-asc',  label: 'Price: Low → High' },
    { value: 'price-desc', label: 'Price: High → Low' },
];
const PRICE_MAX = 5000;

// ============================================================================
// CLOSE ICON
// ============================================================================

const CloseIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

// ============================================================================
// COMPONENT
// ============================================================================

interface FilterSheetProps {
    open: boolean;
    onClose: () => void;
}

export default function FilterSheet({ open, onClose }: FilterSheetProps) {
    const { filters, setFilters, resetFilters, activeFilterCount } = useReadymadeFilters();
    const sheetRef = useRef<HTMLDivElement>(null);

    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    // Close on ESC key
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onClose]);

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    const toggleSize = (size: SizeKey) => {
        const sizes = filters.sizes.includes(size)
            ? filters.sizes.filter((s) => s !== size)
            : [...filters.sizes, size];
        setFilters({ sizes });
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[60] transition-all duration-300"
                style={{
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(2px)',
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? 'auto' : 'none',
                }}
                onClick={handleBackdropClick}
                aria-hidden
            />

            {/* Sheet */}
            <div
                ref={sheetRef}
                role="dialog"
                aria-modal="true"
                aria-label="Filter & Sort"
                className="fixed bottom-0 left-0 right-0 z-[60] rounded-t-3xl transition-transform duration-300 ease-out"
                style={{
                    backgroundColor: '#ffffff',
                    transform: open ? 'translateY(0)' : 'translateY(100%)',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    paddingBottom: 'env(safe-area-inset-bottom, 16px)',
                }}
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 rounded-full bg-gray-200" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                    <div>
                        <h2 className="text-base font-extrabold text-gray-900">Filter & Sort</h2>
                        {activeFilterCount > 0 && (
                            <p className="text-xs text-gray-400 mt-0.5">
                                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close filters"
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-600 active:scale-90 transition-transform"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="px-5 py-4 flex flex-col gap-6">

                    {/* ── Sort by ── */}
                    <section aria-labelledby="sort-heading">
                        <h3 id="sort-heading" className="text-sm font-bold text-gray-800 mb-3">
                            Sort By
                        </h3>
                        <div className="flex flex-col gap-2">
                            {SORT_OPTIONS.map((opt) => {
                                const selected = filters.sortBy === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => setFilters({ sortBy: opt.value })}
                                        className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm text-left transition-all duration-150 active:scale-98"
                                        style={{
                                            backgroundColor: selected ? 'rgba(212,168,83,0.12)' : '#f9fafb',
                                            border: selected ? '1.5px solid #D4A853' : '1.5px solid transparent',
                                            color: selected ? '#0f1035' : '#4b5563',
                                            fontWeight: selected ? 700 : 400,
                                        }}
                                    >
                                        {/* Radio dot */}
                                        <span
                                            className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                                            style={{
                                                borderColor: selected ? '#D4A853' : '#d1d5db',
                                                backgroundColor: selected ? '#D4A853' : 'transparent',
                                            }}
                                        >
                                            {selected && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                            )}
                                        </span>
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* ── Size filter ── */}
                    <section aria-labelledby="size-heading">
                        <h3 id="size-heading" className="text-sm font-bold text-gray-800 mb-3">
                            Size
                        </h3>
                        <div className="flex gap-2 flex-wrap">
                            {SIZES.map((size) => {
                                const checked = filters.sizes.includes(size);
                                return (
                                    <button
                                        key={size}
                                        onClick={() => toggleSize(size)}
                                        aria-pressed={checked}
                                        className="w-12 h-12 rounded-xl text-sm font-bold transition-all duration-150 active:scale-90"
                                        style={{
                                            backgroundColor: checked ? '#D4A853' : '#f3f4f6',
                                            color: checked ? '#0f1035' : '#6b7280',
                                            border: checked ? '2px solid #D4A853' : '2px solid transparent',
                                        }}
                                    >
                                        {size}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* ── Price range ── */}
                    <section aria-labelledby="price-heading">
                        <div className="flex items-center justify-between mb-3">
                            <h3 id="price-heading" className="text-sm font-bold text-gray-800">
                                Price Range
                            </h3>
                            <span className="text-xs font-semibold text-gray-500">
                                ₹{filters.priceMin.toLocaleString('en-IN')} –{' '}
                                ₹{filters.priceMax.toLocaleString('en-IN')}
                            </span>
                        </div>
                        <div className="flex flex-col gap-3">
                            {/* Min slider */}
                            <div>
                                <label className="text-[10px] text-gray-400 mb-1 block">Min price</label>
                                <input
                                    type="range"
                                    min={0}
                                    max={PRICE_MAX}
                                    step={50}
                                    value={filters.priceMin}
                                    onChange={(e) =>
                                        setFilters({
                                            priceMin: Math.min(Number(e.target.value), filters.priceMax - 50),
                                        })
                                    }
                                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                                    style={{ accentColor: '#D4A853' }}
                                    aria-label="Minimum price"
                                />
                            </div>
                            {/* Max slider */}
                            <div>
                                <label className="text-[10px] text-gray-400 mb-1 block">Max price</label>
                                <input
                                    type="range"
                                    min={0}
                                    max={PRICE_MAX}
                                    step={50}
                                    value={filters.priceMax}
                                    onChange={(e) =>
                                        setFilters({
                                            priceMax: Math.max(Number(e.target.value), filters.priceMin + 50),
                                        })
                                    }
                                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                                    style={{ accentColor: '#D4A853' }}
                                    aria-label="Maximum price"
                                />
                            </div>
                        </div>
                    </section>

                    {/* ── In stock only ── */}
                    <section>
                        <div className="flex items-center justify-between py-1">
                            <div>
                                <p className="text-sm font-bold text-gray-800">In Stock Only</p>
                                <p className="text-xs text-gray-400 mt-0.5">Hide out-of-stock items</p>
                            </div>
                            {/* Toggle */}
                            <button
                                role="switch"
                                aria-checked={filters.inStockOnly}
                                onClick={() => setFilters({ inStockOnly: !filters.inStockOnly })}
                                className="relative w-12 h-6 rounded-full transition-colors duration-200 active:scale-95"
                                style={{
                                    backgroundColor: filters.inStockOnly ? '#D4A853' : '#e5e7eb',
                                }}
                            >
                                <span
                                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
                                    style={{
                                        left: filters.inStockOnly ? '26px' : '2px',
                                    }}
                                />
                            </button>
                        </div>
                    </section>
                </div>

                {/* Footer action row */}
                <div className="flex gap-3 px-5 pt-2 pb-4 border-t border-gray-100 sticky bottom-0 bg-white">
                    <button
                        onClick={() => { resetFilters(); }}
                        className="flex-1 py-3 rounded-xl text-sm font-bold border transition-all duration-150 active:scale-95"
                        style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
                    >
                        Reset
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95"
                        style={{ backgroundColor: '#D4A853', color: '#0f1035' }}
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </>
    );
}
