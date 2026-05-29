'use client';

import { useState, useEffect } from 'react';
import { 
    Sheet, 
    SheetContent, 
} from '@/components/ui/sheet';
import { useMeasurementFormStore } from '@/store/useMeasurementFormStore';
import { Step1Profile, Step2Measurements, Step3Preferences, Step4Review } from '@/components/measurements/MeasurementSteps';
import { toast } from 'sonner';

interface MeasurementFormDrawerProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: (newProfile: any) => void;
    garmentType?: string;
}

export default function MeasurementFormDrawer({
    open,
    onClose,
    onSuccess,
    garmentType = 'Shirt'
}: MeasurementFormDrawerProps) {
    const {
        step, prevStep, nextStep, buildPayload,
        canProceedStep1, canProceedStep2, canProceedStep3, canProceedStep4, reset
    } = useMeasurementFormStore();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset store when drawer opens
    useEffect(() => {
        if (open) {
            reset();
            // Optionally pre-select the garmentType if needed
            // useMeasurementFormStore.getState().toggleGarment(garmentType.toLowerCase() as any);
        }
    }, [open, reset]);

    const handleSubmit = async () => {
        const payload = buildPayload();
        if (!payload) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch('/api/measurements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save profile');
            }

            const responseData = await res.json();
            toast.success('Measurement profile saved!');
            reset();
            if (onSuccess) onSuccess(responseData.profile);
            onClose();
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
        <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <SheetContent side="bottom" className="h-[95vh] sm:max-w-xl sm:mx-auto rounded-t-3xl border-none bg-[#0f1035] p-0 flex flex-col overflow-hidden">
                {/* Header & Progress */}
                <div className="flex-none px-4 pt-6 pb-4 bg-[#0f1035] z-10 border-b border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => step > 1 ? prevStep() : onClose()}
                            className="p-2 -ml-2 text-white active:scale-90 transition-transform"
                        >
                            {step > 1 ? (
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            ) : (
                                <span className="text-xs font-bold uppercase tracking-wider text-white/50 px-2">Cancel</span>
                            )}
                        </button>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#D4A853]">
                            Step {step} of 4
                        </span>
                        <div className="w-12" /> {/* spacer */}
                    </div>

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

                {error && (
                    <div className="mx-4 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-semibold flex-none">
                        {error}
                    </div>
                )}

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto px-4 py-6">
                    {step === 1 && <Step1Profile />}
                    {step === 2 && <Step2Measurements />}
                    {step === 3 && <Step3Preferences />}
                    {step === 4 && <Step4Review onSubmit={handleSubmit} isSubmitting={isSubmitting} />}
                </div>

                {/* Bottom Sticky Action */}
                {step < 4 && (
                    <div className="flex-none p-4 bg-[#0f1035] border-t border-white/5" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
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
            </SheetContent>
        </Sheet>
    );
}
