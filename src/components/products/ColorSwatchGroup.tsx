'use client';

import type { ColorVariant } from '@/types/product';

interface ColorSwatchGroupProps {
    colors: ColorVariant[];
    selected?: string;   // selected color name
    onSelect?: (name: string) => void;
    max?: number;        // how many dots to show before +N overflow
}

export default function ColorSwatchGroup({
    colors,
    selected,
    onSelect,
    max = 5,
}: ColorSwatchGroupProps) {
    const visible  = colors.slice(0, max);
    const overflow = colors.length - max;

    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            {visible.map((c) => {
                const isSelected = selected === c.name;
                const isLight    = ['#FFFFFF', '#F5F0E8', '#F5F5F5'].includes(c.hex);
                return (
                    <button
                        key={c.name}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onSelect?.(c.name);
                        }}
                        aria-label={`${c.name}${c.stock === 0 ? ' — out of stock' : ''}`}
                        aria-pressed={isSelected}
                        disabled={c.stock === 0}
                        className="relative w-5 h-5 rounded-full transition-all duration-150 active:scale-90 disabled:opacity-30 flex-shrink-0"
                        style={{
                            backgroundColor: c.hex,
                            border: isSelected
                                ? '2px solid #D4A853'
                                : isLight
                                ? '1.5px solid #d1d5db'
                                : '2px solid transparent',
                            boxShadow: isSelected
                                ? '0 0 0 2px rgba(212,168,83,0.4)'
                                : 'none',
                        }}
                        title={c.name}
                    >
                        {/* Out-of-stock cross */}
                        {c.stock === 0 && (
                            <span className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </span>
                        )}
                    </button>
                );
            })}

            {/* +N overflow */}
            {overflow > 0 && (
                <span
                    className="text-[9px] font-bold"
                    style={{ color: 'rgba(0,0,0,0.4)' }}
                >
                    +{overflow}
                </span>
            )}
        </div>
    );
}
