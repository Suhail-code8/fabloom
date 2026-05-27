'use client';

import { useStitchingStore } from '@/store/useStitchingStore';

export default function MetersSelector() {
    const { selectedFabric, meters, setMeters } = useStitchingStore();

    const max = selectedFabric?.stockInMeters ?? 999;

    return (
        <section aria-label="Choose meters" className="flex flex-col gap-6 px-4">
            <div>
                <h2 className="text-lg font-extrabold text-white">Select Meters</h2>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    How many meters do you need? Minimum 1m.
                </p>
            </div>

            <div
                className="rounded-2xl p-5"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.08)' }}
            >
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={() => setMeters(Math.max(1, parseFloat((meters - 0.5).toFixed(1))))}
                        className="w-12 h-12 rounded-2xl text-xl font-extrabold transition-all duration-150 active:scale-90"
                        style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff' }}
                        aria-label="Decrease meters"
                    >
                        −
                    </button>

                    <div className="flex-1 text-center">
                        <p className="text-3xl font-extrabold text-white">{meters}m</p>
                        {selectedFabric && (
                            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                                ₹{selectedFabric.pricePerMeter.toLocaleString('en-IN')} / meter · Total:{' '}
                                <strong style={{ color: '#D4A853' }}>
                                    ₹{(selectedFabric.pricePerMeter * meters).toLocaleString('en-IN')}
                                </strong>
                            </p>
                        )}
                    </div>

                    <button
                        onClick={() => setMeters(Math.min(max, parseFloat((meters + 0.5).toFixed(1))))}
                        className="w-12 h-12 rounded-2xl text-xl font-extrabold transition-all duration-150 active:scale-90"
                        style={{ backgroundColor: '#D4A853', color: '#0f1035' }}
                        aria-label="Increase meters"
                    >
                        +
                    </button>
                </div>

                {selectedFabric && (
                    <p className="text-center text-[10px] mt-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        Max {selectedFabric.stockInMeters}m available
                    </p>
                )}
            </div>
        </section>
    );
}

