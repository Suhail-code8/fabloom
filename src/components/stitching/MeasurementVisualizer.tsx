'use client';

import { useState, useRef, useCallback } from 'react';

// ============================================================================
// MEASUREMENT POINTS — maps body region to SVG hit zone + input field key
// ============================================================================

interface MeasurementPoint {
    id:   string;
    label: string;
    x:    number;  // % of SVG width
    y:    number;  // % of SVG height
    cx:   number;  // circle center x
    cy:   number;  // circle center y
    lineX2?: number;
    lineY2?: number;
}

const POINTS: MeasurementPoint[] = [
    { id: 'neck',         label: 'Neck',         x: 35, y: 4,  cx: 200, cy: 52  },
    { id: 'shoulder',     label: 'Shoulder',     x: 5,  y: 14, cx: 200, cy: 104 },
    { id: 'chest',        label: 'Chest',        x: 5,  y: 24, cx: 200, cy: 160 },
    { id: 'waist',        label: 'Waist',        x: 5,  y: 38, cx: 200, cy: 230 },
    { id: 'sleeveLength', label: 'Sleeve',       x: 72, y: 28, cx: 200, cy: 180 },
    { id: 'shirtLength',  label: 'Length',       x: 72, y: 55, cx: 200, cy: 310 },
];

// ============================================================================
// PROPS
// ============================================================================

interface MeasurementVisualizerProps {
    values:   Record<string, number | string>;
    onChange: (field: string, value: string) => void;
    unit?:    'in' | 'cm';
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function MeasurementVisualizer({
    values,
    onChange,
    unit = 'in',
}: MeasurementVisualizerProps) {
    const [activeField, setActiveField] = useState<string | null>(null);
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const handlePointClick = useCallback((fieldId: string) => {
        setActiveField(fieldId);
        // Focus the corresponding input
        setTimeout(() => {
            inputRefs.current[fieldId]?.focus();
            inputRefs.current[fieldId]?.select();
        }, 50);
    }, []);

    const handleInputFocus = (fieldId: string) => setActiveField(fieldId);
    const handleInputBlur  = () => setActiveField(null);

    return (
        <div className="flex flex-col md:flex-row gap-6 items-start w-full">

            {/* ── SVG Body Figure ─────────────────────────────────────────── */}
            <div
                className="relative w-full max-w-[220px] mx-auto md:mx-0 shrink-0 rounded-2xl overflow-hidden"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
                <svg
                    viewBox="0 0 400 600"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full"
                    role="img"
                    aria-label="Body measurement diagram"
                >
                    {/* ── Body silhouette ─────────────────────────────── */}
                    {/* Head */}
                    <ellipse cx="200" cy="38" rx="28" ry="32" fill="rgba(212,168,83,0.12)" stroke="rgba(212,168,83,0.35)" strokeWidth="1.5" />
                    {/* Neck */}
                    <rect x="188" y="66" width="24" height="20" rx="4" fill="rgba(212,168,83,0.12)" stroke="rgba(212,168,83,0.35)" strokeWidth="1.5" />
                    {/* Torso */}
                    <path
                        d="M140 86 Q120 96 108 130 L98 310 Q98 322 110 322 L290 322 Q302 322 302 310 L292 130 Q280 96 260 86 Z"
                        fill="rgba(212,168,83,0.08)"
                        stroke="rgba(212,168,83,0.35)"
                        strokeWidth="1.5"
                    />
                    {/* Left arm */}
                    <path
                        d="M108 130 Q78 140 68 230 Q64 250 74 260 Q84 270 94 258 L108 180 Z"
                        fill="rgba(212,168,83,0.08)"
                        stroke="rgba(212,168,83,0.35)"
                        strokeWidth="1.5"
                    />
                    {/* Right arm */}
                    <path
                        d="M292 130 Q322 140 332 230 Q336 250 326 260 Q316 270 306 258 L292 180 Z"
                        fill="rgba(212,168,83,0.08)"
                        stroke="rgba(212,168,83,0.35)"
                        strokeWidth="1.5"
                    />
                    {/* Left leg */}
                    <path
                        d="M130 322 L118 490 Q116 510 128 510 L172 510 Q184 510 184 490 L184 322 Z"
                        fill="rgba(212,168,83,0.08)"
                        stroke="rgba(212,168,83,0.35)"
                        strokeWidth="1.5"
                    />
                    {/* Right leg */}
                    <path
                        d="M270 322 L282 490 Q284 510 272 510 L228 510 Q216 510 216 490 L216 322 Z"
                        fill="rgba(212,168,83,0.08)"
                        stroke="rgba(212,168,83,0.35)"
                        strokeWidth="1.5"
                    />

                    {/* ── Measurement guide lines ──────────────────────── */}
                    {/* Neck line */}
                    <line x1="172" y1="52" x2="228" y2="52" stroke="rgba(212,168,83,0.4)" strokeWidth="1" strokeDasharray="3 2" />
                    {/* Shoulder line */}
                    <line x1="115" y1="100" x2="285" y2="100" stroke="rgba(212,168,83,0.3)" strokeWidth="1" strokeDasharray="3 2" />
                    {/* Chest line */}
                    <line x1="108" y1="158" x2="292" y2="158" stroke="rgba(212,168,83,0.3)" strokeWidth="1" strokeDasharray="3 2" />
                    {/* Waist line */}
                    <line x1="100" y1="228" x2="300" y2="228" stroke="rgba(212,168,83,0.3)" strokeWidth="1" strokeDasharray="3 2" />

                    {/* ── Interactive Hit Points ───────────────────────── */}
                    {POINTS.map((pt) => {
                        const isActive = activeField === pt.id;
                        const hasValue = values[pt.id] !== undefined && values[pt.id] !== '';
                        return (
                            <g
                                key={pt.id}
                                onClick={() => handlePointClick(pt.id)}
                                style={{ cursor: 'pointer' }}
                                role="button"
                                aria-label={`Click to measure ${pt.label}`}
                            >
                                {/* Hit area */}
                                <circle
                                    cx={pt.cx}
                                    cy={pt.cy}
                                    r={isActive ? 14 : 10}
                                    fill={isActive ? '#D4A853' : hasValue ? 'rgba(212,168,83,0.5)' : 'rgba(212,168,83,0.15)'}
                                    stroke={isActive ? '#D4A853' : 'rgba(212,168,83,0.6)'}
                                    strokeWidth={isActive ? 2 : 1.5}
                                    style={{ transition: 'all 0.2s ease' }}
                                />
                                {/* Dot centre */}
                                <circle
                                    cx={pt.cx}
                                    cy={pt.cy}
                                    r={3}
                                    fill={isActive ? '#fff' : '#D4A853'}
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* Legend */}
                <div className="px-3 pb-3">
                    <p className="text-[10px] text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Tap a point to focus its field
                    </p>
                </div>
            </div>

            {/* ── Measurement Inputs ───────────────────────────────────────── */}
            <div className="flex-1 w-full grid grid-cols-1 gap-3">
                {POINTS.map((pt) => {
                    const isActive = activeField === pt.id;
                    return (
                        <div
                            key={pt.id}
                            className="relative rounded-xl transition-all duration-200"
                            style={{
                                border: `1px solid ${isActive ? '#D4A853' : 'rgba(255,255,255,0.08)'}`,
                                backgroundColor: isActive ? 'rgba(212,168,83,0.06)' : 'rgba(255,255,255,0.03)',
                                boxShadow: isActive ? '0 0 0 3px rgba(212,168,83,0.12)' : 'none',
                            }}
                        >
                            <label
                                htmlFor={`measurement-${pt.id}`}
                                className="absolute left-3 top-2 text-[10px] font-bold uppercase tracking-wider"
                                style={{ color: isActive ? '#D4A853' : 'rgba(255,255,255,0.4)' }}
                            >
                                {pt.label}
                            </label>
                            <div className="flex items-end">
                                <input
                                    id={`measurement-${pt.id}`}
                                    ref={(el) => { inputRefs.current[pt.id] = el; }}
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    placeholder="0.0"
                                    value={values[pt.id] ?? ''}
                                    onChange={(e) => onChange(pt.id, e.target.value)}
                                    onFocus={() => handleInputFocus(pt.id)}
                                    onBlur={handleInputBlur}
                                    className="flex-1 bg-transparent pt-6 pb-2 pl-3 pr-1 text-xl font-bold outline-none w-full"
                                    style={{ color: '#fff' }}
                                />
                                <span
                                    className="pr-3 pb-2.5 text-sm font-medium"
                                    style={{ color: 'rgba(255,255,255,0.4)' }}
                                >
                                    {unit}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
