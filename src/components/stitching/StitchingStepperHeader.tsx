// Server component — no 'use client' needed
// ============================================================================

interface StitchingStepperHeaderProps {
    currentStep: 1 | 2 | 3 | 4;
}

const STEPS = [
    { n: 1, label: 'Fabric' },
    { n: 2, label: 'Meters' },
    { n: 3, label: 'Garment' },
    { n: 4, label: 'Measurements' },
] as const;

export default function StitchingStepperHeader({ currentStep }: StitchingStepperHeaderProps) {
    return (
        <div className="px-6 pt-5 pb-4" aria-label="Stitching steps">
            <div className="relative flex items-center justify-between">
                {/* Connecting line — sits behind the circles */}
                <div
                    className="absolute top-4 left-0 right-0 h-0.5 z-0"
                    style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                    aria-hidden
                />
                {/* Active progress line */}
                <div
                    className="absolute top-4 left-0 h-0.5 z-0 transition-all duration-500 ease-out"
                    style={{
                        backgroundColor: '#D4A853',
                        width:
                            currentStep === 1 ? '0%' :
                            currentStep === 2 ? '33%' :
                            currentStep === 3 ? '66%' : '100%',
                    }}
                    aria-hidden
                />

                {STEPS.map((step) => {
                    const done    = step.n < currentStep;
                    const active  = step.n === currentStep;
                    const pending = step.n > currentStep;

                    return (
                        <div key={step.n} className="relative z-10 flex flex-col items-center gap-2">
                            {/* Circle */}
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                                style={{
                                    backgroundColor: done
                                        ? '#D4A853'
                                        : active
                                        ? '#D4A853'
                                        : 'rgba(255,255,255,0.1)',
                                    border: active
                                        ? '2px solid #D4A853'
                                        : done
                                        ? '2px solid #D4A853'
                                        : '2px solid rgba(255,255,255,0.2)',
                                    boxShadow: active ? '0 0 0 4px rgba(212,168,83,0.2)' : 'none',
                                    color: done || active ? '#0f1035' : 'rgba(255,255,255,0.4)',
                                }}
                                aria-current={active ? 'step' : undefined}
                            >
                                {done ? (
                                    // Checkmark
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : (
                                    step.n
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className="text-[10px] font-semibold transition-colors duration-300"
                                style={{
                                    color: active
                                        ? '#D4A853'
                                        : done
                                        ? 'rgba(255,255,255,0.7)'
                                        : 'rgba(255,255,255,0.35)',
                                }}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
