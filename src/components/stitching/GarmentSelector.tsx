'use client';

import { useStitchingStore } from '@/store/useStitchingStore';
import type { GarmentType, CollarType } from '@/types/cart';
import { STITCHING_PRICE, COLLAR_GARMENTS } from '@/types/cart';

// ============================================================================
// CONSTANTS
// ============================================================================

const GARMENTS: { type: GarmentType; emoji: string; desc: string }[] = [
    { type: 'Saudi Kandora',   emoji: '🕌', desc: 'Classic Saudi style thobe' },
    { type: 'Emirati Kandora', emoji: '🇦🇪', desc: 'Traditional Emirati style' },
    { type: 'Chinese Kandora', emoji: '👔', desc: 'Mandarin collar style' },
    { type: 'Pleat Kandora',   emoji: '✨', desc: 'Pleated details style' },
    { type: 'Jubba',           emoji: '🕌', desc: 'Traditional Jubba' },
    { type: 'Pleat Jubba',     emoji: '✨', desc: 'Pleated details Jubba' },
    { type: 'Kurta',           emoji: '👘', desc: 'Classic Indian style' },
    { type: 'Shirt',           emoji: '👔', desc: 'Casual or formal shirt' },
];

const COLLAR_OPTIONS: { type: CollarType; desc: string }[] = [
    { type: 'Mandarin', desc: 'Round standing collar' },
    { type: 'Band',     desc: 'Narrow stiff band' },
    { type: 'Regular',  desc: 'Classic spread collar' },
    { type: 'Nehru',    desc: 'Short stand-up collar' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export default function GarmentSelector() {
    const {
        garmentType, setGarmentType,
        collarType, setCollarType,
        stitchingNotes, setStitchingNotes,
    } = useStitchingStore();

    const showCollar = garmentType && COLLAR_GARMENTS.includes(garmentType);
    const stitchingFee = garmentType ? STITCHING_PRICE[garmentType] : null;

    return (
        <section aria-label="Choose garment and style" className="flex flex-col gap-6 px-4">
            {/* Header */}
            <div>
                <h2 className="text-lg font-extrabold text-white">Choose Garment & Style</h2>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Tell us what to stitch. We handle the rest.
                </p>
            </div>

            {/* Garment type pills */}
            <div aria-label="Garment type" role="radiogroup">
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Garment Type
                </p>
                <div className="grid grid-cols-2 gap-3">
                    {GARMENTS.map((g) => {
                        const selected = garmentType === g.type;
                        return (
                            <button
                                key={g.type}
                                role="radio"
                                aria-checked={selected}
                                onClick={() => setGarmentType(g.type)}
                                className="flex flex-col items-center justify-center p-5 rounded-2xl text-center transition-all duration-300 group"
                                style={{
                                    backgroundColor: selected ? 'rgba(212,168,83,0.08)' : 'rgba(255,255,255,0.03)',
                                    border: selected ? '1.5px solid #D4A853' : '1px solid rgba(255,255,255,0.08)',
                                    boxShadow: selected ? '0 0 20px rgba(212,168,83,0.15)' : 'none',
                                }}
                            >
                                <span className="text-4xl mb-3 transition-transform duration-300 group-active:scale-95">{g.emoji}</span>
                                <p
                                    className="text-[13px] font-bold leading-tight"
                                    style={{ color: selected ? '#D4A853' : 'rgba(255,255,255,0.9)' }}
                                >
                                    {g.type}
                                </p>
                                <p className="text-[10px] mt-1 opacity-70" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                    {g.desc}
                                </p>
                                <div 
                                    className="mt-3 px-3 py-1 rounded-full transition-colors duration-300" 
                                    style={{ backgroundColor: selected ? '#D4A853' : 'rgba(255,255,255,0.06)' }}
                                >
                                    <span className="text-[11px] font-extrabold" style={{ color: selected ? '#0f1035' : 'rgba(255,255,255,0.6)' }}>
                                        ₹{STITCHING_PRICE[g.type]}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Stitching fee callout */}
                {stitchingFee !== null && (
                    <div
                        className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl"
                        style={{ backgroundColor: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.2)' }}
                    >
                        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth={2} strokeLinecap="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            Stitching charge for <strong style={{ color: '#D4A853' }}>{garmentType}</strong>:&nbsp;
                            <strong style={{ color: '#D4A853' }}>₹{stitchingFee}</strong>
                        </p>
                    </div>
                )}
            </div>

            {/* Collar type — conditional */}
            {showCollar && (
                <div aria-label="Collar type" role="radiogroup">
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        Collar Style
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {COLLAR_OPTIONS.map((c) => {
                            const selected = collarType === c.type;
                            return (
                                <button
                                    key={c.type}
                                    role="radio"
                                    aria-checked={selected}
                                    onClick={() => setCollarType(selected ? null : c.type)}
                                    className="px-3 py-3 rounded-xl text-left transition-all duration-200 active:scale-95"
                                    style={{
                                        backgroundColor: selected ? 'rgba(212,168,83,0.12)' : 'rgba(255,255,255,0.05)',
                                        border: selected ? '2px solid #D4A853' : '2px solid rgba(255,255,255,0.08)',
                                    }}
                                >
                                    <p className="text-xs font-bold" style={{ color: selected ? '#D4A853' : 'rgba(255,255,255,0.9)' }}>
                                        {c.type}
                                    </p>
                                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                        {c.desc}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Special instructions */}
            <div>
                <label
                    htmlFor="stitching-notes"
                    className="text-xs font-bold uppercase tracking-widest block mb-2"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                    Tailor Notes <span style={{ color: 'rgba(255,255,255,0.25)' }}>(optional)</span>
                </label>
                <textarea
                    id="stitching-notes"
                    rows={3}
                    value={stitchingNotes}
                    onChange={(e) => setStitchingNotes(e.target.value)}
                    placeholder="E.g. Add a chest pocket, prefer loose fit around shoulders…"
                    maxLength={400}
                    className="w-full px-4 py-3 rounded-2xl text-sm resize-none outline-none transition-all duration-200"
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1.5px solid rgba(255,255,255,0.12)',
                        color: 'rgba(255,255,255,0.9)',
                        caretColor: '#D4A853',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#D4A853'; }}
                    onBlur={(e)  => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                />
                <p className="text-right text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    {stitchingNotes.length}/400
                </p>
            </div>
        </section>
    );
}
