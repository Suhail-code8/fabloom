'use client';

import { useState } from 'react';
import { useMeasurementFormStore } from '@/store/useMeasurementFormStore';
import type { GarmentTypeOption, MeasurementValues } from '@/store/useMeasurementFormStore';
import BodyDiagram from './BodyDiagram';
import type { HighlightedMeasurement } from './BodyDiagram';

// ============================================================================
// STEP 1: PROFILE SETUP
// ============================================================================

export function Step1Profile() {
    const { profileName, setProfileName, garmentTypes, toggleGarment, setAsDefault, setAsDefaultToggle } = useMeasurementFormStore();

    const GARMENTS: { id: GarmentTypeOption; label: string }[] = [
        { id: 'kurta',    label: 'Kurta' },
        { id: 'thobe',    label: 'Thobe' },
        { id: 'kandoora', label: 'Kandoora' },
        { id: 'shirt',    label: 'Shirt' },
        { id: 'pant',     label: 'Pant' },
    ];

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-xl font-extrabold text-white mb-1">Profile Details</h2>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Name this profile and select what it's for.
                </p>
            </div>

            <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Profile Name
                </label>
                <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="e.g. My Kurta, Father's Thobe"
                    className="w-full px-4 py-4 rounded-2xl text-sm font-bold transition-all duration-200 outline-none"
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1.5px solid rgba(255,255,255,0.1)',
                        color: 'white',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#D4A853'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
            </div>

            <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    For Garment Types
                </label>
                <div className="flex flex-wrap gap-2">
                    {GARMENTS.map((g) => {
                        const active = garmentTypes.includes(g.id);
                        return (
                            <button
                                key={g.id}
                                onClick={() => toggleGarment(g.id)}
                                className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95"
                                style={{
                                    backgroundColor: active ? '#D4A853' : 'rgba(255,255,255,0.05)',
                                    color: active ? '#0f1035' : 'rgba(255,255,255,0.7)',
                                    border: active ? '1.5px solid #D4A853' : '1.5px solid rgba(255,255,255,0.1)',
                                }}
                            >
                                {g.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <label className="flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="relative flex-shrink-0">
                    <input
                        type="checkbox"
                        checked={setAsDefault}
                        onChange={(e) => setAsDefaultToggle(e.target.checked)}
                        className="sr-only"
                    />
                    <div className={`w-10 h-6 rounded-full transition-colors ${setAsDefault ? 'bg-[#D4A853]' : 'bg-gray-600'}`} />
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${setAsDefault ? 'left-5' : 'left-1'}`} />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-white">Set as default</p>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Automatically use this profile for these garments</p>
                </div>
            </label>
        </div>
    );
}

// ============================================================================
// MEASUREMENT INPUT WRAPPER
// ============================================================================

interface MeasureInputProps {
    id: keyof MeasurementValues;
    label: string;
    instruction: string;
    range: string;
    value: number | '';
    onChange: (val: number | '') => void;
    onFocus: () => void;
    isActive: boolean;
}

function MeasureInput({ id, label, instruction, range, value, onChange, onFocus, isActive }: MeasureInputProps) {
    return (
        <div
            className="p-4 rounded-2xl transition-all duration-300"
            style={{
                backgroundColor: isActive ? 'rgba(212,168,83,0.08)' : 'rgba(255,255,255,0.03)',
                border: isActive ? '1.5px solid #D4A853' : '1.5px solid rgba(255,255,255,0.08)',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
            }}
            onClick={onFocus}
        >
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <label htmlFor={id} className="text-sm font-extrabold text-white block mb-1">
                        {label}
                    </label>
                    <p className="text-[10px] flex items-start gap-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        <svg className="w-3 h-3 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        {instruction}
                    </p>
                    <p className="text-[9px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Typical range: {range}
                    </p>
                </div>
                <div className="flex items-center gap-1.5 w-24 flex-shrink-0">
                    <input
                        id={id}
                        type="number"
                        step="0.5"
                        value={value}
                        onChange={(e) => onChange(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        onFocus={onFocus}
                        className="w-full bg-transparent text-right text-lg font-bold text-white outline-none placeholder-gray-600"
                        placeholder="0.0"
                    />
                    <span className="text-xs font-bold" style={{ color: '#D4A853' }}>in</span>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// STEP 2: BODY (Chest, Waist, Hip)
// ============================================================================

export function Step2Body() {
    const { measurements, setMeasurement } = useMeasurementFormStore();
    const [active, setActive] = useState<HighlightedMeasurement>('chest');

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-center mb-2">
                <BodyDiagram highlighted={active} />
            </div>
            <div className="flex flex-col gap-3">
                <MeasureInput
                    id="chest"
                    label="Chest Circumference"
                    instruction="Measure around the fullest part of your chest, keeping tape horizontal."
                    range="34-48 in"
                    value={measurements.chest}
                    onChange={(v) => setMeasurement('chest', v)}
                    onFocus={() => setActive('chest')}
                    isActive={active === 'chest'}
                />
                <MeasureInput
                    id="waist"
                    label="Waist Circumference"
                    instruction="Measure around your natural waistline, where your trousers sit."
                    range="28-44 in"
                    value={measurements.waist}
                    onChange={(v) => setMeasurement('waist', v)}
                    onFocus={() => setActive('waist')}
                    isActive={active === 'waist'}
                />
                <MeasureInput
                    id="hip"
                    label="Hip Circumference"
                    instruction="Measure around the fullest part of your hips."
                    range="36-50 in"
                    value={measurements.hip}
                    onChange={(v) => setMeasurement('hip', v)}
                    onFocus={() => setActive('hip')}
                    isActive={active === 'hip'}
                />
            </div>
        </div>
    );
}

// ============================================================================
// STEP 3: UPPER (Shoulder, Sleeve, Neck)
// ============================================================================

export function Step3Upper() {
    const { measurements, setMeasurement } = useMeasurementFormStore();
    const [active, setActive] = useState<HighlightedMeasurement>('shoulder');

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-center mb-2">
                <BodyDiagram highlighted={active} />
            </div>
            <div className="flex flex-col gap-3">
                <MeasureInput
                    id="shoulder"
                    label="Shoulder Width"
                    instruction="Measure across the back from the edge of one shoulder tip to the other."
                    range="16-22 in"
                    value={measurements.shoulder}
                    onChange={(v) => setMeasurement('shoulder', v)}
                    onFocus={() => setActive('shoulder')}
                    isActive={active === 'shoulder'}
                />
                <MeasureInput
                    id="sleeveLength"
                    label="Sleeve Length"
                    instruction="Measure from the shoulder seam down to the wrist bone."
                    range="22-28 in"
                    value={measurements.sleeveLength}
                    onChange={(v) => setMeasurement('sleeveLength', v)}
                    onFocus={() => setActive('sleeve')}
                    isActive={active === 'sleeve'}
                />
                <MeasureInput
                    id="neck"
                    label="Neck Circumference"
                    instruction="Measure around the base of your neck, leaving room for two fingers."
                    range="14-18 in"
                    value={measurements.neck}
                    onChange={(v) => setMeasurement('neck', v)}
                    onFocus={() => setActive('neck')}
                    isActive={active === 'neck'}
                />
            </div>
        </div>
    );
}

// ============================================================================
// STEP 4: LENGTHS
// ============================================================================

export function Step4Length() {
    const { measurements, setMeasurement, needsInseam, needsThobeLength } = useMeasurementFormStore();
    const [active, setActive] = useState<HighlightedMeasurement>('length');

    const showInseam = needsInseam();
    const showThobe = needsThobeLength();

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-center mb-2">
                <BodyDiagram highlighted={active} />
            </div>
            <div className="flex flex-col gap-3">
                <MeasureInput
                    id="shirtLength"
                    label="Shirt / Kurta Length"
                    instruction="Measure from the base of the back neck down to desired length."
                    range="38-46 in"
                    value={measurements.shirtLength}
                    onChange={(v) => setMeasurement('shirtLength', v)}
                    onFocus={() => setActive('length')}
                    isActive={active === 'length'}
                />
                {showInseam && (
                    <MeasureInput
                        id="inseam"
                        label="Pant Inseam"
                        instruction="Measure from the crotch seam to the bottom of the leg."
                        range="28-36 in"
                        value={measurements.inseam}
                        onChange={(v) => setMeasurement('inseam', v)}
                        onFocus={() => setActive('inseam')}
                        isActive={active === 'inseam'}
                    />
                )}
                {showThobe && (
                    <MeasureInput
                        id="thobeLength"
                        label="Thobe / Kandoora Length"
                        instruction="Measure from the shoulder down to the ankles."
                        range="54-62 in"
                        value={measurements.thobeLength}
                        onChange={(v) => setMeasurement('thobeLength', v)}
                        onFocus={() => setActive('thobeLength')}
                        isActive={active === 'thobeLength'}
                    />
                )}
            </div>
        </div>
    );
}

// ============================================================================
// STEP 5: REVIEW
// ============================================================================

export function Step5Review({ onSubmit, isSubmitting }: { onSubmit: () => void, isSubmitting: boolean }) {
    const { profileName, garmentTypes, setAsDefault, measurements, goToStep, needsInseam, needsThobeLength } = useMeasurementFormStore();

    const renderRow = (label: string, value: number | '', step: 1|2|3|4|5) => {
        if (value === '') return null;
        return (
            <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</span>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{value}</span>
                    <button onClick={() => goToStep(step)} className="text-[10px] font-bold text-[#D4A853] uppercase tracking-wider px-2 py-1 bg-[#D4A853]/10 rounded-md">Edit</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
            <div>
                <h2 className="text-xl font-extrabold text-white mb-1">Review & Save</h2>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Double-check your measurements before saving.
                </p>
            </div>

            {/* Profile Info Summary */}
            <div className="p-4 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-white">{profileName}</h3>
                    <button onClick={() => goToStep(1)} className="text-[10px] font-bold text-[#D4A853] uppercase tracking-wider px-2 py-1 bg-[#D4A853]/10 rounded-md">Edit</button>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                    {garmentTypes.map(g => (
                        <span key={g} className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-white/10 text-white/70">{g}</span>
                    ))}
                </div>
                {setAsDefault && <p className="text-[10px] text-[#D4A853]">✓ Set as default for these garments</p>}
            </div>

            {/* Measurements Summary */}
            <div className="p-4 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                {renderRow('Chest', measurements.chest, 2)}
                {renderRow('Waist', measurements.waist, 2)}
                {renderRow('Hip', measurements.hip, 2)}
                {renderRow('Shoulder Width', measurements.shoulder, 3)}
                {renderRow('Sleeve Length', measurements.sleeveLength, 3)}
                {renderRow('Neck', measurements.neck, 3)}
                {renderRow('Shirt/Kurta Length', measurements.shirtLength, 4)}
                {needsInseam() && renderRow('Pant Inseam', measurements.inseam, 4)}
                {needsThobeLength() && renderRow('Thobe Length', measurements.thobeLength, 4)}
            </div>

            <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-98 disabled:opacity-50"
                style={{ backgroundColor: '#D4A853', color: '#0f1035' }}
            >
                {isSubmitting ? (
                    'Saving...'
                ) : (
                    <>
                        Save Profile
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
                        </svg>
                    </>
                )}
            </button>
        </div>
    );
}
