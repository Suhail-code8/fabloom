'use client';

import { useState } from 'react';
import { useMeasurementFormStore } from '@/store/useMeasurementFormStore';
import type { GarmentTypeOption, MeasurementValues, PreferenceValues } from '@/store/useMeasurementFormStore';
import BodyDiagram from './BodyDiagram';
import type { HighlightedMeasurement } from './BodyDiagram';

// ============================================================================
// STEP 1: PROFILE SETUP
// ============================================================================

export function Step1Profile() {
    const { profileName, setProfileName, garmentTypes, toggleGarment, setAsDefault, setAsDefaultToggle } = useMeasurementFormStore();

    const GARMENTS: { id: GarmentTypeOption; label: string }[] = [
        { id: 'saudi_kandora',   label: 'Saudi Kandora' },
        { id: 'emirati_kandora', label: 'Emirati Kandora' },
        { id: 'chinese_kandora', label: 'Chinese Kandora' },
        { id: 'pleat_kandora',   label: 'Pleat Kandora' },
        { id: 'jubba',           label: 'Jubba' },
        { id: 'pleat_jubba',     label: 'Pleat Jubba' },
        { id: 'kurta',           label: 'Kurta' },
        { id: 'shirt',           label: 'Shirt' },
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
                    placeholder="e.g. My Kandora, Father's Thobe"
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
            id={`measure-${id}`}
            className="p-4 rounded-2xl transition-all duration-300 scroll-m-24"
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
                    <span className="text-xs font-bold" style={{ color: '#D4A853' }}>cm</span>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// STEP 2: BODY MEASUREMENTS
// ============================================================================

export function Step2Measurements() {
    const { measurements, setMeasurement } = useMeasurementFormStore();
    const [active, setActive] = useState<HighlightedMeasurement>('length');

    const handleSelectPoint = (point: HighlightedMeasurement) => {
        setActive(point);
        if (point) {
            document.getElementById(`measure-${point}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-center mb-2 sticky top-0 z-10 py-4 bg-[#0f1035]/90 backdrop-blur-sm">
                <BodyDiagram highlighted={active} onSelectPoint={handleSelectPoint} />
            </div>
            <div className="flex flex-col gap-3">
                <MeasureInput
                    id="length"
                    label="1. Length"
                    instruction="Full garment length from neck base to bottom hem."
                    range="120-160 cm"
                    value={measurements.length}
                    onChange={(v) => setMeasurement('length', v)}
                    onFocus={() => setActive('length')}
                    isActive={active === 'length'}
                />
                <MeasureInput
                    id="shoulder"
                    label="2. Shoulder"
                    instruction="Measure across the back from one shoulder edge to the other."
                    range="40-55 cm"
                    value={measurements.shoulder}
                    onChange={(v) => setMeasurement('shoulder', v)}
                    onFocus={() => setActive('shoulder')}
                    isActive={active === 'shoulder'}
                />
                <MeasureInput
                    id="sleeveLength"
                    label="3. Sleeve Length"
                    instruction="Measure from the shoulder seam down to the wrist bone."
                    range="58-72 cm"
                    value={measurements.sleeveLength}
                    onChange={(v) => setMeasurement('sleeveLength', v)}
                    onFocus={() => setActive('sleeveLength')}
                    isActive={active === 'sleeveLength'}
                />
                <MeasureInput
                    id="loose1"
                    label="4. Loose 1 (Upper Arm)"
                    instruction="Measure around the fullest part of your upper arm."
                    range="30-45 cm"
                    value={measurements.loose1}
                    onChange={(v) => setMeasurement('loose1', v)}
                    onFocus={() => setActive('loose1')}
                    isActive={active === 'loose1'}
                />
                <MeasureInput
                    id="loose2"
                    label="5. Loose 2 (Wrist/Lower Arm)"
                    instruction="Measure around your forearm just above the wrist bone."
                    range="24-36 cm"
                    value={measurements.loose2}
                    onChange={(v) => setMeasurement('loose2', v)}
                    onFocus={() => setActive('loose2')}
                    isActive={active === 'loose2'}
                />
                <MeasureInput
                    id="chest"
                    label="6. Chest"
                    instruction="Measure around the fullest part of your chest."
                    range="85-130 cm"
                    value={measurements.chest}
                    onChange={(v) => setMeasurement('chest', v)}
                    onFocus={() => setActive('chest')}
                    isActive={active === 'chest'}
                />
                <MeasureInput
                    id="waist"
                    label="7. Waist"
                    instruction="Measure around your natural waistline."
                    range="70-120 cm"
                    value={measurements.waist}
                    onChange={(v) => setMeasurement('waist', v)}
                    onFocus={() => setActive('waist')}
                    isActive={active === 'waist'}
                />
                <MeasureInput
                    id="bottom"
                    label="8. Bottom Width"
                    instruction="Measure the desired width across the bottom hem of your garment — how wide you want the opening at the bottom."
                    range="60-90 cm"
                    value={measurements.bottom}
                    onChange={(v) => setMeasurement('bottom', v)}
                    onFocus={() => setActive('bottom')}
                    isActive={active === 'bottom'}
                />
                <MeasureInput
                    id="neck"
                    label="9. Neck"
                    instruction="Measure around the base of your neck, leaving room for a finger."
                    range="36-48 cm"
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
// STEP 3: STYLE PREFERENCES
// ============================================================================

export function Step3Preferences() {
    const { preferences, setPreference } = useMeasurementFormStore();
    const [showFinishing, setShowFinishing] = useState(false);

    const PreferenceCard = ({ title, options, stateKey }: { title: string, options: {id: string, label: string}[], stateKey: keyof PreferenceValues }) => (
        <div className="mb-6">
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-widest">{title}</h3>
            <div className="grid grid-cols-3 gap-3">
                {options.map((opt) => {
                    const active = preferences[stateKey] === opt.id;
                    return (
                        <button
                            key={opt.id}
                            onClick={() => setPreference(stateKey, opt.id)}
                            className="p-3 rounded-xl text-xs font-bold transition-all duration-200 text-center flex flex-col items-center justify-center h-16"
                            style={{
                                backgroundColor: active ? '#D4A853' : 'rgba(255,255,255,0.03)',
                                color: active ? '#0f1035' : 'rgba(255,255,255,0.7)',
                                border: active ? '1.5px solid #D4A853' : '1.5px solid rgba(255,255,255,0.08)',
                            }}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
            <div>
                <h2 className="text-xl font-extrabold text-white mb-1">Style Preferences</h2>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Select your preferred style and fit options.
                </p>
            </div>

            <PreferenceCard 
                title="Neck Type"
                stateKey="neckType"
                options={[
                    { id: 'cut_neck', label: 'Cut Neck' },
                    { id: 'full_neck', label: 'Full Neck' },
                    { id: 'qathari', label: 'Qathari' }
                ]}
            />

            <PreferenceCard 
                title="Fit Preference"
                stateKey="fitPreference"
                options={[
                    { id: 'slim', label: 'Slim Fit' },
                    { id: 'medium', label: 'Medium Fit' },
                    { id: 'loose', label: 'Loose Fit' }
                ]}
            />

            <PreferenceCard 
                title="Cuff Type"
                stateKey="cuffType"
                options={[
                    { id: 'simple', label: 'Simple' },
                    { id: 'button', label: 'Button' },
                    { id: 'french', label: 'French Cuff' }
                ]}
            />

            <div className="mt-4 border border-white/10 rounded-2xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <button 
                    onClick={() => setShowFinishing(!showFinishing)}
                    className="w-full p-4 flex items-center justify-between text-sm font-bold text-white transition-colors hover:bg-white/5"
                >
                    Customise fit further (optional)
                    <svg className={`w-4 h-4 transition-transform duration-300 ${showFinishing ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                
                {showFinishing && (
                    <div className="p-4 border-t border-white/10 flex flex-col gap-4 animate-in slide-in-from-top-2">
                        <p className="text-xs text-white/50 mb-2">Leave blank to let our tailor decide based on your fit preference.</p>
                        
                        <div className="flex items-center justify-between gap-4">
                            <label className="text-sm text-white/80">Chest finish (cm)</label>
                            <input
                                type="number"
                                placeholder="Auto"
                                value={preferences.chestFinish}
                                onChange={(e) => setPreference('chestFinish', e.target.value === '' ? '' : parseFloat(e.target.value))}
                                className="w-24 bg-white/5 border border-white/10 rounded-lg p-2 text-right text-white font-bold outline-none focus:border-[#D4A853]"
                            />
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <label className="text-sm text-white/80">Waist finish (cm)</label>
                            <input
                                type="number"
                                placeholder="Auto"
                                value={preferences.waistFinish}
                                onChange={(e) => setPreference('waistFinish', e.target.value === '' ? '' : parseFloat(e.target.value))}
                                className="w-24 bg-white/5 border border-white/10 rounded-lg p-2 text-right text-white font-bold outline-none focus:border-[#D4A853]"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// STEP 4: REVIEW
// ============================================================================

export function Step4Review({ onSubmit, isSubmitting }: { onSubmit: () => void, isSubmitting: boolean }) {
    const { profileName, garmentTypes, setAsDefault, measurements, preferences, goToStep } = useMeasurementFormStore();

    const renderRow = (label: string, value: number | string | '', step: 1|2|3|4) => {
        if (value === '') return null;
        return (
            <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</span>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white capitalize">{value.toString().replace('_', ' ')}</span>
                    <button onClick={() => goToStep(step)} className="text-[10px] font-bold text-[#D4A853] uppercase tracking-wider px-2 py-1 bg-[#D4A853]/10 rounded-md">Edit</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500 store-pb-no-nav">
            <div>
                <h2 className="text-xl font-extrabold text-white mb-1">Review & Save</h2>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Double-check your measurements and preferences before saving.
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
                        <span key={g} className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-white/10 text-white/70">{g.replace('_', ' ')}</span>
                    ))}
                </div>
                {setAsDefault && <p className="text-[10px] text-[#D4A853]">✓ Set as default for these garments</p>}
            </div>

            {/* Measurements Summary */}
            <div className="p-4 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Measurements (cm)</h4>
                {renderRow('1. Length', measurements.length, 2)}
                {renderRow('2. Shoulder', measurements.shoulder, 2)}
                {renderRow('3. Sleeve Length', measurements.sleeveLength, 2)}
                {renderRow('4. Loose 1', measurements.loose1, 2)}
                {renderRow('5. Loose 2', measurements.loose2, 2)}
                {renderRow('6. Chest', measurements.chest, 2)}
                {renderRow('7. Waist', measurements.waist, 2)}
                {renderRow('8. Bottom', measurements.bottom, 2)}
                {renderRow('9. Neck', measurements.neck, 2)}
            </div>

            {/* Preferences Summary */}
            <div className="p-4 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Style Preferences</h4>
                {renderRow('Neck Type', preferences.neckType, 3)}
                {renderRow('Fit Preference', preferences.fitPreference, 3)}
                {renderRow('Cuff Type', preferences.cuffType, 3)}
                {preferences.chestFinish !== '' && renderRow('Chest Finish (cm)', preferences.chestFinish, 3)}
                {preferences.waistFinish !== '' && renderRow('Waist Finish (cm)', preferences.waistFinish, 3)}
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
