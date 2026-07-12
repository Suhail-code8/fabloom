'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import type { IAccessoryProduct } from '@/types/product';

// ============================================================================
// NEW BADGE LOGIC — item is "new" if createdAt < 30 days ago
// ============================================================================

function isNew(createdAt: string): boolean {
    return Date.now() - new Date(createdAt).getTime() < 30 * 24 * 60 * 60 * 1000;
}

// ============================================================================
// WISHLIST HEART BUTTON (Fabric/Accessories)
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
        <div
            role="button"
            tabIndex={0}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    (e.currentTarget as HTMLDivElement).click();
                }
            }}
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

                        if (typeof json.isLiked === 'boolean') setWishlisted(json.isLiked);
                        void mutate();
                        toast.success(json.isLiked ? 'Added to wishlist' : 'Removed from wishlist');
                    })
                    .catch((err) => {
                        toast.error(err?.message || 'Failed to update wishlist');
                    })
                    .finally(() => setIsSaving(false));
            }}
            className="absolute top-2 right-2 z-20 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 active:scale-90"
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
        </div>
    );
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
            className="ecom-card group relative active:scale-98"
            aria-label={product.name}
        >
            <div className={`relative w-full flex-shrink-0 ${aspectClass} overflow-hidden`} style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                <WishlistButton productId={product._id} />
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
                        className="absolute top-2 right-10 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#D4A853' }}
                    >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="#0f1035">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 p-3 min-h-[88px]" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <p className="text-xs font-semibold line-clamp-2 leading-snug min-h-[2.5rem]" style={{ color: 'rgba(255,255,255,0.88)' }}>
                    {product.name}
                </p>
                {children && <div className="flex-1 mt-2">{children}</div>}
                <div className={children ? 'mt-auto pt-2' : 'mt-auto pt-2 flex-1 flex flex-col justify-end'}>
                    <p
                        className="text-sm font-extrabold"
                        style={{
                            background: 'linear-gradient(135deg, #D4A853, #f3bf4d)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        ₹{product.price.toLocaleString('en-IN')}
                    </p>
                </div>
            </div>
        </Wrapper>
    );
}
