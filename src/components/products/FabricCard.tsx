'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { IFabricProduct } from '@/types/product';

// ============================================================================
// STOCK INDICATOR
// ============================================================================

function StockBadge({ stock }: { stock: number }) {
    const color  = stock > 5 ? '#16a34a' : stock >= 2 ? '#d97706' : '#dc2626';
    const label  = stock > 5
        ? `In stock: ${stock}m`
        : stock >= 2
        ? `Only ${stock}m left`
        : 'Almost gone';

    return (
        <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            {label}
        </span>
    );
}

// ============================================================================
// FABRIC CARD
// ============================================================================

interface FabricCardProps {
    fabric: IFabricProduct;
    onOpenDrawer: (fabric: IFabricProduct) => void;
}

export default function FabricCard({ fabric, onOpenDrawer }: FabricCardProps) {
    const router = useRouter();

    return (
        <div
            className="flex flex-col rounded-2xl overflow-hidden bg-white transition-all duration-150 active:scale-98"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}
        >
            {/* Texture image — 1:1 square, hero */}
            <button
                className="relative w-full cursor-pointer overflow-hidden bg-gray-50"
                style={{ paddingBottom: '100%' }}
                onClick={() => onOpenDrawer(fabric)}
                aria-label={`View ${fabric.name} details`}
            >
                <img
                    src={fabric.texture ?? fabric.images?.[0] ?? '/placeholder-product.jpg'}
                    alt={fabric.name}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {/* Width badge */}
                    <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(15,16,53,0.82)', color: '#D4A853' }}
                    >
                        {fabric.width}&quot;
                    </span>
                    {/* Material badge */}
                    <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(255,255,255,0.88)', color: '#374151' }}
                    >
                        {fabric.fabricType}
                    </span>
                </div>

                {/* Featured star */}
                {fabric.featured && (
                    <div
                        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#D4A853' }}
                    >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="#0f1035">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </div>
                )}
            </button>

            {/* Info block */}
            <div className="px-3 pt-2.5 pb-1">
                <p className="text-xs font-bold text-gray-900 leading-snug line-clamp-1">
                    {fabric.name}
                </p>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-sm font-extrabold" style={{ color: '#0f1035' }}>
                        ₹{fabric.pricePerMeter}
                        <span className="text-[10px] font-medium text-gray-400">/m</span>
                    </p>
                    {fabric.gsm && (
                        <span className="text-[10px] text-gray-400">{fabric.gsm} GSM</span>
                    )}
                </div>
                <div className="mt-1.5">
                    <StockBadge stock={fabric.stockInMeters} />
                </div>
            </div>

            {/* Add stitching chip */}
            {fabric.stitchingAvailable && (
                <div className="px-3 pb-3 pt-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/stitching?fabricId=${fabric._id}`);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold transition-all duration-200 active:scale-95"
                        style={{
                            backgroundColor: 'rgba(212,168,83,0.1)',
                            border: '1.5px solid rgba(212,168,83,0.35)',
                            color: '#92650a',
                        }}
                        aria-label={`Get ${fabric.name} stitched`}
                    >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
                            <line x1="20" y1="4" x2="8.12" y2="15.88" />
                            <line x1="14.47" y1="14.48" x2="20" y2="20" />
                            <line x1="8.12" y1="8.12" x2="12" y2="12" />
                        </svg>
                        Add Stitching
                    </button>
                </div>
            )}
        </div>
    );
}
