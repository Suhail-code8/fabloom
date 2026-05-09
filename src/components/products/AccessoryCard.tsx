'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { IAccessoryProduct } from '@/types/product';

// ============================================================================
// NEW BADGE LOGIC — item is "new" if createdAt < 30 days ago
// ============================================================================

function isNew(createdAt: string): boolean {
    return Date.now() - new Date(createdAt).getTime() < 30 * 24 * 60 * 60 * 1000;
}

// ============================================================================
// COMPONENT
// ============================================================================

interface AccessoryCardProps {
    product: IAccessoryProduct;
    /** Aspect ratio class for image container. Default: square (1:1) */
    aspectClass?: string;
    /** Extra content rendered inside the card below the image */
    children?: React.ReactNode;
    href?: string;
    onClick?: () => void;
}

export default function AccessoryCard({
    product,
    aspectClass = 'aspect-square',
    children,
    href,
    onClick,
}: AccessoryCardProps) {
    const badge = isNew(product.createdAt);
    const Wrapper = href ? Link : 'div';

    return (
        // @ts-ignore — polymorphic wrapper
        <Wrapper
            href={href ?? '#'}
            onClick={onClick}
            className="group relative flex flex-col rounded-2xl overflow-hidden bg-white cursor-pointer transition-all duration-150 active:scale-98"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}
            aria-label={product.name}
        >
            {/* Image */}
            <div className={`relative w-full ${aspectClass} overflow-hidden bg-gray-50`}>
                <img
                    src={product.images?.[0] ?? '/placeholder-product.jpg'}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* NEW badge */}
                {badge && (
                    <span
                        className="absolute top-2 left-2 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: '#D4A853', color: '#0f1035' }}
                    >
                        New
                    </span>
                )}

                {/* Featured star */}
                {product.featured && !badge && (
                    <div
                        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#D4A853' }}
                    >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="#0f1035">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="px-3 pt-2.5 pb-3">
                <p className="text-xs font-bold text-gray-900 leading-snug line-clamp-2 min-h-[32px]">
                    {product.name}
                </p>
                <p className="text-sm font-extrabold mt-1" style={{ color: '#0f1035' }}>
                    ₹{product.price.toLocaleString('en-IN')}
                </p>

                {/* Extra slot — children (color swatches, size pills, etc.) */}
                {children && <div className="mt-2">{children}</div>}
            </div>
        </Wrapper>
    );
}
