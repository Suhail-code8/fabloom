'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import type { IFabricProduct } from '@/types/product';

// ============================================================================
// HELPERS
// ============================================================================

function InfoRow({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-xs text-gray-500 font-medium">{label}</span>
            <span className="text-xs font-bold text-gray-800">{value}</span>
        </div>
    );
}

function SuitableChip({ label }: { label: string }) {
    return (
        <span
            className="px-3 py-1 rounded-full text-[11px] font-semibold"
            style={{ backgroundColor: 'rgba(15,16,53,0.07)', color: '#0f1035' }}
        >
            {label}
        </span>
    );
}

// ============================================================================
// DRAWER
// ============================================================================

interface FabricDetailDrawerProps {
    fabric: IFabricProduct | null;
    onClose: () => void;
}

export default function FabricDetailDrawer({ fabric, onClose }: FabricDetailDrawerProps) {
    const [meters, setMeters] = useState(2);
    const addItem = useCartStore((s) => s.addItem);
    const router  = useRouter();
    const open    = fabric !== null;

    // Reset meter count each time a new fabric opens
    useEffect(() => { 
        if (fabric) setMeters(2); 
    }, [fabric]);

    // Close on ESC
    useEffect(() => {
        if (!open) return;
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [open, onClose]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    const handleAddFabricOnly = useCallback(() => {
        if (!fabric) return;
        addItem({
            productId: fabric._id,
            name: fabric.name,
            image: fabric.images[0] ?? '',
            itemType: 'fabric',
            quantity: 1,
            pricePerMeter: fabric.pricePerMeter,
            meters,
            fabricType: fabric.fabricType,
        } as any);
        onClose();
        router.push('/cart');
    }, [fabric, meters, addItem, onClose, router]);

    const handleAddWithStitching = useCallback(() => {
        if (!fabric) return;
        onClose();
        router.push(`/stitching?fabricId=${fabric._id}&meters=${meters}`);
    }, [fabric, meters, onClose, router]);

    const fabricCost = fabric ? (fabric.pricePerMeter * meters) : 0;

    return (
        <>
            {/* Backdrop */}

            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[100] transition-all duration-300"
                style={{
                    backgroundColor: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(3px)',
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? 'auto' : 'none',
                }}
                onClick={onClose}
                aria-hidden
            />

            {/* Sheet */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label={fabric?.name ?? 'Fabric detail'}
                className="fixed bottom-0 left-0 right-0 z-[100] rounded-t-3xl overflow-hidden transition-transform duration-350 ease-out shadow-[0_-8px_30px_rgba(0,0,0,0.2)]"
                style={{
                    backgroundColor: '#fff',
                    maxHeight: '92vh',
                    transform: open ? 'translateY(0)' : 'translateY(100%)',
                    paddingBottom: 'env(safe-area-inset-bottom, 80px)', // account for bottom nav or safe area
                }}
            >
                {/* Scrollable content */}
                <div className="overflow-y-auto pb-24" style={{ maxHeight: 'calc(92vh - 140px)' }}>
                    {/* Drag handle */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-10 h-1 rounded-full bg-gray-200" />
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm active:scale-90 transition-transform"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    {/* Texture hero image */}
                    {fabric && (
                        <div className="relative w-full" style={{ height: '260px' }}>
                            <Image
                                src={fabric.texture ?? fabric.images[0] ?? ''}
                                alt={fabric.name}
                                fill
                                className="object-cover"
                                sizes="100vw"
                                priority
                            />
                            {/* Gradient overlay at bottom */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-20"
                                style={{ background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, transparent 100%)' }}
                            />
                        </div>
                    )}

                    {/* Info content */}
                    {fabric && (
                        <div className="px-5 pt-2 pb-4">
                            {/* Name & price */}
                            <div className="flex items-start justify-between gap-3 mb-1">
                                <h2 className="text-lg font-extrabold text-gray-900 leading-tight flex-1">
                                    {fabric.name}
                                </h2>
                                <div className="flex-shrink-0 text-right">
                                    <p className="text-xl font-extrabold" style={{ color: '#0f1035' }}>
                                        ₹{fabric.pricePerMeter} / meter
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-500 leading-relaxed mb-4">
                                {fabric.description}
                            </p>

                            {/* Specs table */}
                            <div className="mb-4">
                                <InfoRow label="Fabric Type"  value={fabric.fabricType} />
                                <InfoRow label="Width"        value={`${fabric.width} inches`} />
                                {fabric.gsm && <InfoRow label="GSM" value={`${fabric.gsm} g/m²`} />}
                                <InfoRow label="Stock"        value={`${fabric.stockInMeters} meters`} />
                                <InfoRow label="Stitching"    value={fabric.stitchingAvailable ? 'Available' : 'Not available'} />
                            </div>

                            {/* Suitable for */}
                            {fabric.suitableFor && fabric.suitableFor.length > 0 && (
                                <div className="mb-5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                                        Suitable for
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {fabric.suitableFor.map((g) => (
                                            <SuitableChip key={g} label={g} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Meter selector */}
                            <div className="mb-5">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                                    Select meters
                                </p>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setMeters((m) => Math.max(0.5, parseFloat((m - 0.5).toFixed(1))))}
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-150 active:scale-90"
                                        style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
                                        aria-label="Decrease"
                                    >
                                        −
                                    </button>

                                    <div className="flex-1 text-center">
                                        <p className="text-2xl font-extrabold text-gray-900">{meters}m</p>
                                        <p className="text-xs text-gray-400">
                                            = ₹{fabricCost.toLocaleString('en-IN')}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setMeters((m) => Math.min(fabric.stockInMeters, parseFloat((m + 0.5).toFixed(1))))}
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-150 active:scale-90"
                                        style={{ backgroundColor: '#D4A853', color: '#0f1035' }}
                                        aria-label="Increase"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="text-center text-[10px] text-gray-400 mt-2">
                                    Min 0.5m · Max {fabric.stockInMeters}m
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sticky action footer */}
                {fabric && (
                    <div
                        className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-3"
                        style={{ paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}
                    >
                        {/* Fabric only */}
                        <button
                            onClick={handleAddFabricOnly}
                            className="flex-1 py-3 rounded-2xl text-sm font-bold border transition-all duration-200 active:scale-95"
                            style={{ borderColor: '#d1d5db', color: '#374151' }}
                        >
                            Fabric Only
                        </button>

                        {/* With stitching — primary */}
                        {fabric.stitchingAvailable && (
                            <button
                                onClick={handleAddWithStitching}
                                className="flex-1 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
                                style={{ backgroundColor: '#D4A853', color: '#0f1035' }}
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
                                    <line x1="20" y1="4" x2="8.12" y2="15.88" />
                                    <line x1="14.47" y1="14.48" x2="20" y2="20" />
                                    <line x1="8.12" y1="8.12" x2="12" y2="12" />
                                </svg>
                                + Stitching
                            </button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
