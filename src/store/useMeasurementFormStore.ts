import { create } from 'zustand';

// ============================================================================
// TYPES
// ============================================================================

export type GarmentTypeOption = 'kurta' | 'thobe' | 'kandoora' | 'shirt' | 'pant';

export interface MeasurementValues {
    // Step 2 — body
    chest:       number | '';
    waist:       number | '';
    hip:         number | '';
    // Step 3 — upper
    shoulder:    number | '';
    sleeveLength: number | '';
    neck:        number | '';
    // Step 4 — length
    shirtLength: number | '';
    inseam:      number | '';
    thobeLength: number | '';
}

interface MeasurementFormState {
    // Step 1
    profileName:   string;
    garmentTypes:  GarmentTypeOption[];
    setAsDefault:  boolean;

    // Steps 2–4
    measurements: MeasurementValues;

    // Nav
    step: 1 | 2 | 3 | 4 | 5;

    // Actions
    setProfileName:   (name: string) => void;
    toggleGarment:    (g: GarmentTypeOption) => void;
    setAsDefaultToggle: (v: boolean) => void;
    setMeasurement:   (key: keyof MeasurementValues, value: number | '') => void;
    nextStep:         () => void;
    prevStep:         () => void;
    goToStep:         (s: 1|2|3|4|5) => void;
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

const EMPTY: MeasurementValues = {
    chest: '', waist: '', hip: '',
    shoulder: '', sleeveLength: '', neck: '',
    shirtLength: '', inseam: '', thobeLength: '',
};

// ============================================================================
// STORE
// ============================================================================

export const useMeasurementFormStore = create<MeasurementFormState>()((set, get) => ({
    profileName:  '',
    garmentTypes: [],
    setAsDefault: false,
    measurements: { ...EMPTY },
    step: 1,

    setProfileName:   (name) => set({ profileName: name }),
    toggleGarment:    (g) => {
        const curr = get().garmentTypes;
        set({ garmentTypes: curr.includes(g) ? curr.filter((x) => x !== g) : [...curr, g] });
    },
    setAsDefaultToggle: (v) => set({ setAsDefault: v }),
    setMeasurement:   (key, value) =>
        set((s) => ({ measurements: { ...s.measurements, [key]: value } })),
    nextStep: () => set((s) => ({ step: Math.min(5, s.step + 1) as any })),
    prevStep: () => set((s) => ({ step: Math.max(1, s.step - 1) as any })),
    goToStep: (s) => set({ step: s }),
    reset:    () => set({ profileName: '', garmentTypes: [], setAsDefault: false, measurements: { ...EMPTY }, step: 1 }),
    loadProfile: (profile: any) => {
        set({
            profileName: profile.profileName || '',
            garmentTypes: profile.garmentTypes || [],
            setAsDefault: profile.isDefault || false,
            measurements: { ...EMPTY, ...(profile.measurements || {}) },
            step: 1
        });
    },

    needsInseam:      () => get().garmentTypes.includes('pant'),
    needsThobeLength: () => get().garmentTypes.some((g) => g === 'thobe' || g === 'kandoora'),

    canProceedStep1: () => {
        const { profileName, garmentTypes } = get();
        return profileName.trim().length >= 2 && garmentTypes.length > 0;
    },
    canProceedStep2: () => {
        const { chest, waist } = get().measurements;
        return chest !== '' && waist !== '';
    },
    canProceedStep3: () => {
        const { shoulder, sleeveLength, neck } = get().measurements;
        return shoulder !== '' && sleeveLength !== '' && neck !== '';
    },
    canProceedStep4: () => {
        const { shirtLength, inseam, thobeLength } = get().measurements;
        const { needsInseam, needsThobeLength } = get();
        const inseamOk = needsInseam()    ? inseam !== ''      : true;
        const thobeOk  = needsThobeLength()? thobeLength !== '' : true;
        return shirtLength !== '' && inseamOk && thobeOk;
    },

    buildPayload: () => {
        const { profileName, garmentTypes, setAsDefault, measurements } = get();
        if (!profileName || !garmentTypes.length) return null;
        const m = measurements;

        return {
            profileName: profileName.trim(),
            garmentTypes,
            isDefault: setAsDefault,
            measurements: {
                neck:         m.neck         !== '' ? m.neck         : undefined,
                chest:        m.chest        !== '' ? m.chest        : undefined,
                waist:        m.waist        !== '' ? m.waist        : undefined,
                hip:          m.hip          !== '' ? m.hip          : undefined,
                shoulder:     m.shoulder     !== '' ? m.shoulder     : undefined,
                sleeveLength: m.sleeveLength !== '' ? m.sleeveLength : undefined,
                shirtLength:  m.shirtLength  !== '' ? m.shirtLength  : undefined,
                thobeLength:  m.thobeLength  !== '' ? m.thobeLength  : undefined,
                inseam:       m.inseam       !== '' ? m.inseam       : undefined,
                pantLength:   m.inseam       !== '' ? m.inseam       : undefined, // legacy support
            },
        };
    },
}));
