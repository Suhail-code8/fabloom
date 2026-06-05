'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import StitchingStepperHeader from '@/components/stitching/StitchingStepperHeader';
import FabricSelector from '@/components/stitching/FabricSelector';
import MetersSelector from '@/components/stitching/MetersSelector';
import GarmentSelector from '@/components/stitching/GarmentSelector';
import MeasurementProfilePicker from '@/components/stitching/MeasurementProfilePicker';
import OrderSummaryBar from '@/components/stitching/OrderSummaryBar';
import type { IFabricProduct } from '@/types/product';
import type { IMeasurementProfile } from '@/types/cart';
import { useStitchingStore } from '@/store/useStitchingStore';

// ============================================================================
// PAGE — fully client-rendered (state machine drives 3-step stepper)
// ============================================================================

type Step = 1 | 2 | 3 | 4;

export default function StitchingPage() {
    const searchParams = useSearchParams();
    const stitchingStore = useStitchingStore();

    const [step, setStep] = useState<Step>(1);
    const [fabrics, setFabrics] = useState<IFabricProduct[]>([]);
    const [profiles, setProfiles] = useState<IMeasurementProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const timeout = setTimeout(() => {
            console.warn('Stitching data load timed out');
            if (isMounted) {
                setIsLoading(false);
            }
        }, 12000); // 12s safety timeout

        async function loadData() {
            try {
                // Fetch fabrics
                const fabricRes = await fetch('/api/products?type=fabric&limit=50', {
                    signal: controller.signal,
                });
                if (fabricRes.ok) {
                    const fabricData = await fabricRes.json();
                    if (isMounted) setFabrics(fabricData.data ?? []);
                }
                
                // Fetch profiles (Non-critical, catch errors individually)
                try {
                    const profileRes = await fetch('/api/measurements', { signal: controller.signal });
                    if (profileRes.ok) {
                        const profileData = await profileRes.json();
                        if (isMounted) setProfiles(profileData.profiles ?? []);
                    }
                } catch (pErr) {
                    console.warn('Profiles fetch failed or aborted:', pErr);
                }

            } catch (error) {
                console.error('Failed to load stitching data:', error);
            } finally {
                clearTimeout(timeout);
                if (isMounted) setIsLoading(false);
            }
        }
        loadData();
        return () => {
            isMounted = false;
            controller.abort();
            clearTimeout(timeout);
        };
    }, []);

    // Hydrate from query params (fabricId + meters) once fabrics are loaded
    useEffect(() => {
        if (!fabrics.length) return;

        const fabricId = searchParams.get('fabricId');
        const metersParam = searchParams.get('meters');

        const fabric = fabricId ? fabrics.find((f) => f._id === fabricId) : null;
        const meters = metersParam ? Math.max(1, parseFloat(metersParam)) : undefined;

        if (fabric) {
            stitchingStore.setFabric(fabric);
            if (meters && !Number.isNaN(meters)) {
                stitchingStore.setMeters(meters);
            }
        }
    }, [fabrics, searchParams, stitchingStore]);

    const next = () => setStep((s) => Math.min(4, s + 1) as Step);
    const back = () => setStep((s) => Math.max(1, s - 1) as Step);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f1035] text-white/50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                    <span className="text-xs font-medium">Initializing Craft...</span>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen store-pb-no-nav pb-36"
            style={{ backgroundColor: '#0f1035' }}
        >
            {/* Page title */}
            <div className="px-4 pt-5 pb-4">
                <h1 className="text-2xl font-extrabold text-white leading-tight">
                    Custom Stitching
                </h1>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Bespoke tailoring for Saudi, Emirati, Chinese styles & more.
                </p>
            </div>

            {/* Premium Info Box */}
            <div className="mx-4 mb-6 p-4 rounded-2xl bg-white/5 border border-[#D4A853]/20 flex items-start gap-3">
                <span className="text-[#D4A853] text-lg mt-0.5">✨</span>
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4A853] mb-1">
                        Exclusive Added Service
                    </h3>
                    <p className="text-xs leading-relaxed text-white/70">
                        Add custom stitching to any premium fabric purchase in your order. Our expert tailors will craft the perfect fit according to your measurements.
                    </p>
                </div>
            </div>

            {/* Stepper indicator */}
            <StitchingStepperHeader currentStep={step} />

            {/* Divider */}
            <div className="mx-4 mb-6 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }} />

            {/* Step content */}
            {step === 1 && <FabricSelector fabrics={fabrics} />}
            {step === 2 && <MetersSelector />}
            {step === 3 && <GarmentSelector />}
            {step === 4 && <MeasurementProfilePicker profiles={profiles} />}

            {/* Sticky bottom bar */}
            <OrderSummaryBar
                currentStep={step}
                onNext={next}
                onBack={back}
            />
        </div>
    );
}
