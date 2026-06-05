'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import type { IReadymadeProduct, SizeKey } from '@/types/product';
import useSWR from 'swr';
import { toast } from 'sonner';

// ============================================================================
// CONSTANTS
// ============================================================================

const SIZE_ORDER: SizeKey[] = ['S', 'M', 'L', 'XL', 'XXL'];

// ============================================================================
// WISHLIST HEART BUTTON
// ============================================================================

function WishlistButton({ productId }: { productId: string }) {
    const [wishlisted, setWishlisted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fetcher = async (url: string) => {
        const res = await fetch(url);
        const json = await res.json().catch(() => ({}));
        if (!res.ok) return { wishlist: [] };
        return json;
    };

    const { data, mutate } = useSWR('/api/user/wishlist', fetcher);

    useEffect(() => {
        const next = Boolean(data?.wishlist?.some((p: any) => p?._id?.toString() === productId));
        setWishlisted(next);
    }, [data, productId]);

    return (
        <button
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (isSaving) return;
                setIsSaving(true);

                fetch('/api/user/wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId }),
                })
                    .then(async (res) => {
                        const json = await res.json().catch(() => ({}));
                        if (!res.ok) throw new Error(json.error || json.message || 'Wishlist update failed');

                        // API returns the new isLiked state.
                        if (typeof json.isLiked === 'boolean') setWishlisted(json.isLiked);
                        void mutate();

                        toast.success(json.isLiked ? 'Added to wishlist' : 'Removed from wishlist');
                    })
                    .catch((err) => {
                        toast.error(err?.message || 'Failed to update wishlist');
                    })
                    .finally(() => setIsSaving(false));
            }}
            className="absolute top-2 right-2 z-10 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 active:scale-90"
            style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(4px)',
            }}
        >
            <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill={wishlisted ? '#ef4444' : 'none'}
                stroke={wishlisted ? '#ef4444' : '#6b7280'}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        </button>
    );
}

// ============================================================================
// SIZE AVAILABILITY DOTS
// ============================================================================

function SizeDots({ sizeStock }: { sizeStock: IReadymadeProduct['sizeStock'] }) {
    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            {SIZE_ORDER.map((size) => {
                const qty = sizeStock[size] ?? 0;
                const inStock = qty > 0;
                return (
                    <span
                        key={size}
                        className="flex items-center gap-0.5"
                        title={inStock ? `${size}: ${qty} in stock` : `${size}: out of stock`}
                    >
                        <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: inStock ? '#22c55e' : '#d1d5db' }}
                        />
                        <span
                            className="text-[9px] font-medium leading-none"
                            style={{ color: inStock ? '#374151' : '#9ca3af' }}
                        >
                            {size}
                        </span>
                    </span>
                );
            })}
        </div>
    );
}

// ============================================================================
// QUICK ADD BUTTON
// ============================================================================

function QuickAddButton({
    product,
    visible,
}: {
    product: IReadymadeProduct;
    visible: boolean;
}) {
    return (
        <div
            className="absolute bottom-0 left-0 right-0 transition-all duration-200 px-2 pb-2"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(8px)',
                pointerEvents: visible ? 'auto' : 'none',
            }}
        >
            <button
                onClick={(e) => {
                    e.preventDefault();
                    // TODO: wire to cart store — open size picker sheet
                }}
                className="w-full py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95"
                style={{ backgroundColor: '#D4A853', color: '#0f1035' }}
            >
                + Quick Add
            </button>
        </div>
    );
}

// ============================================================================
// PORTRAIT CARD (2-col / 3-col)
// ============================================================================

interface ReadymadeCardProps {
    product: IReadymadeProduct;
    cardStyle?: 'portrait' | 'landscape';
}

export default function ReadymadeCard({
    product,
    cardStyle = 'portrait',
}: ReadymadeCardProps) {
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Long-press for mobile Quick Add
    const handleTouchStart = () => {
        longPressTimer.current = setTimeout(() => setShowQuickAdd(true), 500);
    };
    const handleTouchEnd = () => {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
        setTimeout(() => setShowQuickAdd(false), 1500); // auto-hide after 1.5s
    };

    if (cardStyle === 'landscape') {
        return (
            <Link
                href={`/readymade/${product.slug || product._id}`}
                className="flex gap-3 rounded-2xl overflow-hidden bg-white active:opacity-90 transition-opacity duration-150"
                aria-label={product.name}
            >
                {/* Landscape image — fixed square on left */}
                <div className="relative flex-shrink-0 w-24 h-24 bg-gray-50">
                    <img
                        src={product.images?.[0] ?? '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center gap-1.5 pr-3 py-2 flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate leading-snug">
                        {product.name}
                    </p>
                    <p className="text-sm font-extrabold" style={{ color: '#0f1035' }}>
                        ₹{product.price.toLocaleString('en-IN')}
                    </p>
                    <SizeDots sizeStock={product.sizeStock} />
                </div>
            </Link>
        );
    }

    // Portrait (default)
    return (
        <Link
            href={`/readymade/${product.slug || product._id}`}
            className="flex flex-col h-full rounded-2xl overflow-hidden bg-white active:opacity-90 transition-opacity duration-150"
            aria-label={product.name}
            onMouseEnter={() => setShowQuickAdd(true)}
            onMouseLeave={() => setShowQuickAdd(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="aspect-[3/4] relative flex-shrink-0 overflow-hidden bg-gray-50">
                <img
                    src={product.images?.[0] ?? '/placeholder-product.jpg'}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <WishlistButton productId={product._id} />
                <QuickAddButton product={product} visible={showQuickAdd} />
            </div>

            <div className="flex flex-col flex-1 p-3 min-h-0">
                <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug">
                    {product.name}
                </p>
                <div className="flex-1 min-h-[1.25rem] mt-1">
                    <SizeDots sizeStock={product.sizeStock} />
                </div>
                <div className="mt-auto pt-2">
                    <p className="text-sm font-extrabold" style={{ color: '#0f1035' }}>
                        ₹{product.price.toLocaleString('en-IN')}
                    </p>
                </div>
            </div>
        </Link>
    );
}
