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
                className="max-w-sm mx-auto w-full rounded-2xl p-6 shadow-lg"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={() => setMeters(Math.max(1, parseFloat((meters - 0.5).toFixed(1))))}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl text-2xl font-light transition-all duration-150 active:scale-90"
                        style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                        aria-label="Decrease meters"
                    >
                        −
                    </button>

                    <div className="flex-1 text-center">
                        <p className="text-4xl font-extrabold text-white tracking-tight">{meters}m</p>
                        {selectedFabric && (
                            <div className="flex flex-col items-center gap-1 mt-2">
                                <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                    ₹{selectedFabric.pricePerMeter.toLocaleString('en-IN')} / meter
                                </p>
                                <p className="text-sm font-bold" style={{ color: '#D4A853' }}>
                                    Total: ₹{(selectedFabric.pricePerMeter * meters).toLocaleString('en-IN')}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setMeters(Math.min(max, parseFloat((meters + 0.5).toFixed(1))))}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl text-2xl font-light transition-all duration-150 active:scale-90"
                        style={{ backgroundColor: '#D4A853', color: '#0f1035', boxShadow: '0 4px 14px rgba(212,168,83,0.3)' }}
                        aria-label="Increase meters"
                    >
                        +
                    </button>
                </div>

                {selectedFabric && (
                    <p className="text-center text-[10px] font-bold uppercase tracking-widest mt-6 pt-4 border-t" style={{ color: 'rgba(255,255,255,0.3)', borderColor: 'rgba(255,255,255,0.05)' }}>
                        Max {selectedFabric.stockInMeters}m available
                    </p>
                )}
            </div>
        </section>
    );
}

