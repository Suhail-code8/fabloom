'use client';

import Image from 'next/image';
import { useStitchingStore } from '@/store/useStitchingStore';
import type { IFabricProduct } from '@/types/product';

// ============================================================================
// SINGLE FABRIC CARD
// ============================================================================

function FabricCard({ fabric }: { fabric: IFabricProduct }) {
    const { selectedFabric, meters, setFabric, setMeters } = useStitchingStore();
    const isSelected = selectedFabric?._id === fabric._id;

    const liveCost = isSelected
        ? (fabric.pricePerMeter * meters).toLocaleString('en-IN')
        : null;

    return (
        <div
            role="radio"
            aria-checked={isSelected}
            onClick={() => setFabric(fabric)}
            className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 active:scale-98 select-none"
            style={{
                backgroundColor: '#fff',
                border: isSelected ? '2.5px solid #D4A853' : '2.5px solid transparent',
                boxShadow: isSelected
                    ? '0 0 0 3px rgba(212,168,83,0.2), 0 4px 20px rgba(0,0,0,0.15)'
                    : '0 2px 8px rgba(0,0,0,0.08)',
            }}
        >
            {/* Texture image */}
            <div className="relative w-full" style={{ paddingBottom: '70%' }}>
                {fabric.images[0] ? (
                    <Image
                        src={fabric.images[0]}
                        alt={fabric.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 33vw"
                    />
                ) : (
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(135deg, rgba(212,168,83,0.3) 0%, rgba(15,16,53,0.15) 100%)`,
                        }}
                    />
                )}

                {/* Checkmark badge */}
                {isSelected && (
                    <div
                        className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#D4A853' }}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#0f1035" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                )}

                {/* Fabric type badge */}
                <span
                    className="absolute bottom-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgba(15,16,53,0.8)', color: '#D4A853' }}
                >
                    {fabric.fabricType}
                </span>
            </div>

            {/* Info */}
            <div className="px-3 pt-2 pb-3">
                <p className="text-xs font-bold text-gray-900 truncate leading-snug">{fabric.name}</p>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-sm font-extrabold" style={{ color: '#0f1035' }}>
                        ₹{fabric.pricePerMeter}
                        <span className="text-[10px] font-medium text-gray-400">/m</span>
                    </p>
                    <p className="text-[10px] text-gray-400">{fabric.width}&quot; wide</p>
                </div>

                {/* Stock indicator */}
                <p className="text-[10px] mt-1" style={{ color: fabric.stockInMeters > 10 ? '#16a34a' : '#dc2626' }}>
                    {fabric.stockInMeters > 10
                        ? `✓ In stock`
                        : `Only ${fabric.stockInMeters}m left`}
                </p>
            </div>

            {/* Meters input — only visible when selected */}
            {isSelected && (
                <div
                    className="px-3 pb-3 pt-1 border-t"
                    style={{ borderColor: 'rgba(212,168,83,0.3)', backgroundColor: 'rgba(212,168,83,0.04)' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wide block mb-1.5">
                        Select meters
                    </label>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setMeters(Math.max(1, meters - 0.5))}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-150 active:scale-90"
                            style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
                            aria-label="Decrease meters"
                        >
                            −
                        </button>
                        <span className="flex-1 text-center text-sm font-extrabold text-gray-900">
                            {meters}m
                        </span>
                        <button
                            onClick={() => setMeters(Math.min(fabric.stockInMeters, meters + 0.5))}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-150 active:scale-90"
                            style={{ backgroundColor: '#D4A853', color: '#0f1035' }}
                            aria-label="Increase meters"
                        >
                            +
                        </button>
                    </div>
                    <p className="text-center mt-2 text-xs font-bold" style={{ color: '#0f1035' }}>
                        Fabric cost: ₹{liveCost}
                    </p>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// GRID
// ============================================================================

interface FabricSelectorProps {
    fabrics: IFabricProduct[];
}

export default function FabricSelector({ fabrics }: FabricSelectorProps) {
    return (
        <section aria-label="Choose a fabric">
            <div className="px-4 mb-4">
                <h2 className="text-lg font-extrabold text-white">Choose a Fabric</h2>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Tap a fabric to select it, then set how many meters you need.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 px-4">
                {fabrics.map((f) => (
                    <FabricCard key={f._id} fabric={f} />
                ))}
            </div>
        </section>
    );
}
