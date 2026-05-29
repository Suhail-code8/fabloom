'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMeasurementFormStore } from '@/store/useMeasurementFormStore';
import { Step1Profile, Step2Measurements, Step3Preferences, Step4Review } from '@/components/measurements/MeasurementSteps';
import useSWR from 'swr';
import { toast } from 'sonner';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

import { Suspense } from 'react';

function MeasurementFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    
    const {
        step, prevStep, nextStep, buildPayload,
        canProceedStep1, canProceedStep2, canProceedStep3, canProceedStep4, reset, loadProfile
    } = useMeasurementFormStore();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: profilesData } = useSWR(editId ? '/api/measurements' : null, fetcher);

    // If editing, load the profile when data arrives
    useEffect(() => {
        if (editId && profilesData?.profiles) {
            const profile = profilesData.profiles.find((p: any) => p._id === editId);
            if (profile) {
                loadProfile(profile);
            }
        } else if (!editId) {
            reset(); // Ensure form is empty if not editing
        }
    }, [editId, profilesData, loadProfile, reset]);

    // Make sure we clear the store if the user navigates away or unmounts
    useEffect(() => {
        return () => reset();
    }, [reset]);

    const handleSubmit = async () => {
        const payload = buildPayload();
        if (!payload) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const url = editId ? `/api/measurements/${editId}` : '/api/measurements';
            const method = editId ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save profile');
            }

            toast.success(editId ? 'Profile updated successfully' : 'Profile created successfully');
            reset();
            router.push('/account/measurements');
        } catch (err: any) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    const canProceed =
        step === 1 ? canProceedStep1() :
        step === 2 ? canProceedStep2() :
        step === 3 ? canProceedStep3() :
        step === 4 ? canProceedStep4() : true;

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0f1035' }}>
            {/* Header & Progress */}
            <div className="sticky top-0 z-10 px-4 pt-6 pb-4" style={{ backgroundColor: 'rgba(15, 16, 53, 0.9)', backdropFilter: 'blur(8px)' }}>
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => step > 1 ? prevStep() : router.back()}
                        className="p-2 -ml-2 text-white active:scale-90 transition-transform"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#D4A853]">
                        Step {step} of 4
                    </span>
                    <div className="w-9" /> {/* spacer for centering */}
                </div>

                {/* Progress Dots */}
                <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4].map((s) => (
                        <div
                            key={s}
                            className="h-1.5 rounded-full transition-all duration-300"
                            style={{
                                width: s === step ? '32px' : '8px',
                                backgroundColor: s <= step ? '#D4A853' : 'rgba(255,255,255,0.1)',
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mx-4 mt-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-semibold">
                    {error}
                </div>
            )}

            {/* Step Content */}
            <div className="flex-1 px-4 py-6 overflow-y-auto" style={{ paddingBottom: '120px' }}>
                {step === 1 && <Step1Profile />}
                {step === 2 && <Step2Measurements />}
                {step === 3 && <Step3Preferences />}
                {step === 4 && <Step4Review onSubmit={handleSubmit} isSubmitting={isSubmitting} />}
            </div>

            {/* Bottom Sticky Action Bar */}
            {step < 4 && (
                <div
                    className="fixed bottom-0 left-0 right-0 p-4 border-t"
                    style={{
                        backgroundColor: '#0f1035',
                        borderColor: 'rgba(255,255,255,0.05)',
                        paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))'
                    }}
                >
                    <button
                        onClick={nextStep}
                        disabled={!canProceed}
                        className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ backgroundColor: canProceed ? '#D4A853' : 'rgba(212,168,83,0.3)', color: '#0f1035' }}
                    >
                        Continue
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}

export default function NewMeasurementProfilePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0f1035]"><div className="w-8 h-8 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin"/></div>}>
            <MeasurementFormContent />
        </Suspense>
    );
}
