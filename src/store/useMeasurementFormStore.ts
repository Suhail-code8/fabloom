import { create } from 'zustand';

// ============================================================================
// TYPES
// ============================================================================

export type GarmentTypeOption = 
    | 'saudi_kandora' 
    | 'emirati_kandora' 
    | 'chinese_kandora' 
    | 'pleat_kandora' 
    | 'jubba' 
    | 'pleat_jubba' 
    | 'kurta' 
    | 'shirt';

export interface MeasurementValues {
    length:       number | '';
    shoulder:     number | '';
    sleeveLength: number | '';
    loose1:       number | '';
    loose2:       number | '';
    chest:        number | '';
    waist:        number | '';
    bottom:       number | '';
    neck:         number | '';
}

export interface PreferenceValues {
    neckType:      'cut_neck' | 'full_neck' | 'qathari' | '';
    fitPreference: 'slim' | 'medium' | 'loose' | '';
    cuffType:      'simple' | 'button' | 'french' | '';
    chestFinish:   number | '';
    waistFinish:   number | '';
}

interface MeasurementFormState {
    // Step 1
    profileName:   string;
    garmentTypes:  GarmentTypeOption[];
    setAsDefault:  boolean;

    // Steps 2
    measurements: MeasurementValues;

    // Step 3
    preferences: PreferenceValues;

    // Nav
    step: 1 | 2 | 3 | 4;

    // Actions
    setProfileName:   (name: string) => void;
    toggleGarment:    (g: GarmentTypeOption) => void;
    setAsDefaultToggle: (v: boolean) => void;
    setMeasurement:   (key: keyof MeasurementValues, value: number | '') => void;
    setPreference:    (key: keyof PreferenceValues, value: any) => void;
    nextStep:         () => void;
    prevStep:         () => void;
    goToStep:         (s: 1|2|3|4) => void;
    reset:            () => void;
    loadProfile:      (profile: any) => void;

    // Computed
    needsInseam:     () => boolean;
    needsThobeLength: () => boolean;
    canProceedStep1: () => boolean;
    canProceedStep2: () => boolean;
    canProceedStep3: () => boolean;
    canProceedStep4: () => boolean;
    buildPayload:    () => object | null;
}

// ============================================================================
// DEFAULT MEASUREMENTS
// ============================================================================

const EMPTY_MEASUREMENTS: MeasurementValues = {
    length: '', shoulder: '', sleeveLength: '',
    loose1: '', loose2: '', chest: '',
    waist: '', bottom: '', neck: '',
};

const EMPTY_PREFERENCES: PreferenceValues = {
    neckType: '', fitPreference: '', cuffType: '',
    chestFinish: '', waistFinish: '',
};

// ============================================================================
// STORE
// ============================================================================

export const useMeasurementFormStore = create<MeasurementFormState>()((set, get) => ({
    profileName:  '',
    garmentTypes: [],
    setAsDefault: false,
    measurements: { ...EMPTY_MEASUREMENTS },
    preferences:  { ...EMPTY_PREFERENCES },
    step: 1,

    setProfileName:   (name) => set({ profileName: name }),
    toggleGarment:    (g) => {
        const curr = get().garmentTypes;
        set({ garmentTypes: curr.includes(g) ? curr.filter((x) => x !== g) : [...curr, g] });
    },
    setAsDefaultToggle: (v) => set({ setAsDefault: v }),
    setMeasurement:   (key, value) =>
        set((s) => ({ measurements: { ...s.measurements, [key]: value } })),
    setPreference:    (key, value) =>
        set((s) => ({ preferences: { ...s.preferences, [key]: value } })),
    nextStep: () => set((s) => ({ step: Math.min(4, s.step + 1) as any })),
    prevStep: () => set((s) => ({ step: Math.max(1, s.step - 1) as any })),
    goToStep: (s) => set({ step: s }),
    reset:    () => set({ profileName: '', garmentTypes: [], setAsDefault: false, measurements: { ...EMPTY_MEASUREMENTS }, preferences: { ...EMPTY_PREFERENCES }, step: 1 }),
    loadProfile: (profile: any) => {
        set({
            profileName: profile.profileName || '',
            garmentTypes: profile.garmentTypes || [],
            setAsDefault: profile.isDefault || false,
            measurements: { ...EMPTY_MEASUREMENTS, ...(profile.measurements || {}) },
            preferences:  { ...EMPTY_PREFERENCES, ...(profile.preferences || {}) },
            step: 1
        });
    },

    needsInseam:      () => false, // kept for signature compatibility but unused in 9-point system
    needsThobeLength: () => false, // unused

    canProceedStep1: () => {
        const { profileName, garmentTypes } = get();
        return profileName.trim().length >= 2 && garmentTypes.length > 0;
    },
    canProceedStep2: () => {
        const m = get().measurements;
        return Object.values(m).every((val) => val !== '');
    },
    canProceedStep3: () => {
        const p = get().preferences;
        return p.neckType !== '' && p.fitPreference !== '' && p.cuffType !== '';
    },
    canProceedStep4: () => true,

    buildPayload: () => {
        const { profileName, garmentTypes, setAsDefault, measurements, preferences } = get();
        if (!profileName || !garmentTypes.length) return null;
        const m = measurements;
        const p = preferences;

        return {
            profileName: profileName.trim(),
            garmentTypes,
            isDefault: setAsDefault,
            measurements: {
                length:       m.length       !== '' ? m.length       : undefined,
                shoulder:     m.shoulder     !== '' ? m.shoulder     : undefined,
                sleeveLength: m.sleeveLength !== '' ? m.sleeveLength : undefined,
                loose1:       m.loose1       !== '' ? m.loose1       : undefined,
                loose2:       m.loose2       !== '' ? m.loose2       : undefined,
                chest:        m.chest        !== '' ? m.chest        : undefined,
                waist:        m.waist        !== '' ? m.waist        : undefined,
                bottom:       m.bottom       !== '' ? m.bottom       : undefined,
                neck:         m.neck         !== '' ? m.neck         : undefined,
            },
            preferences: {
                neckType:      p.neckType      !== '' ? p.neckType      : undefined,
                fitPreference: p.fitPreference !== '' ? p.fitPreference : undefined,
                cuffType:      p.cuffType      !== '' ? p.cuffType      : undefined,
                chestFinish:   p.chestFinish   !== '' ? p.chestFinish   : undefined,
                waistFinish:   p.waistFinish   !== '' ? p.waistFinish   : undefined,
            }
        };
    },
}));
