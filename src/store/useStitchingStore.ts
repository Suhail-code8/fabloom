import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
    GarmentType,
    CollarType,
    IMeasurementProfile,
    StitchingOrderItem,
} from '@/types/cart';
import type { IFabricProduct } from '@/types/product';

// ============================================================================
// STATE SHAPE
// ============================================================================

interface StitchingState {
    // Step 1 — fabric
    selectedFabric: IFabricProduct | null;
    meters: number;

    // Step 3 — garment
    garmentType: GarmentType | null;
    collarType: CollarType | null;
    stitchingNotes: string;

    // Step 4 — measurements
    selectedProfile: IMeasurementProfile | null;

    // Derived (computed, not persisted)
    fabricCost: () => number;
    stitchingPrice: () => number;
    totalPrice: () => number;
    canProceedStep1: () => boolean;
    canProceedStep2: () => boolean; // meters
    canProceedStep3: () => boolean; // garment
    canProceedStep4: () => boolean; // measurements
    buildOrderItem: () => StitchingOrderItem | null;

    // Actions
    setFabric: (fabric: IFabricProduct) => void;
    setMeters: (m: number) => void;
    setGarmentType: (g: GarmentType) => void;
    setCollarType: (c: CollarType | null) => void;
    setStitchingNotes: (n: string) => void;
    setProfile: (p: IMeasurementProfile) => void;
    reset: () => void;
}

// ============================================================================
// STITCHING PRICE TABLE
// ============================================================================

const STITCHING_PRICE_MAP: Record<GarmentType, number> = {
    'Saudi Kandora':   850,
    'Emirati Kandora': 1000,
    'Chinese Kandora': 600,
    'Pleat Kandora':   600,
    'Jubba':           350,
    'Pleat Jubba':     400,
    'Kurta':           350,
    'Shirt':           350,
};

// ============================================================================
// STORE
// ============================================================================

export const useStitchingStore = create<StitchingState>()(
    persist(
        (set, get) => ({
            // ── Initial state ────────────────────────────────────────────────
            selectedFabric:  null,
            meters:          1,
            garmentType:     null,
            collarType:      null,
            stitchingNotes:  '',
            selectedProfile: null,

            // ── Derived ──────────────────────────────────────────────────────
            fabricCost: () => {
                const { selectedFabric, meters } = get();
                if (!selectedFabric) return 0;
                return selectedFabric.pricePerMeter * meters;
            },

            stitchingPrice: () => {
                const { garmentType } = get();
                if (!garmentType) return 0;
                return STITCHING_PRICE_MAP[garmentType];
            },

            totalPrice: () => {
                return get().fabricCost() + get().stitchingPrice();
            },

            // ── Step guards ──────────────────────────────────────────────────
            canProceedStep1: () => {
                const { selectedFabric } = get();
                return !!selectedFabric;
            },

            canProceedStep2: () => {
                return get().meters >= 1;
            },

            canProceedStep3: () => {
                return !!get().garmentType;
            },

            canProceedStep4: () => {
                return !!get().selectedProfile;
            },

            // ── Build cart item ──────────────────────────────────────────────
            buildOrderItem: (): StitchingOrderItem | null => {
                const {
                    selectedFabric, meters, garmentType,
                    collarType, stitchingNotes, selectedProfile,
                } = get();
                if (!selectedFabric || !garmentType || !selectedProfile) return null;

                const fabricCost    = selectedFabric.pricePerMeter * meters;
                const stitchingFee  = STITCHING_PRICE_MAP[garmentType];

                return {
                    fabricId:           selectedFabric._id,
                    fabricName:         selectedFabric.name,
                    fabricImage:        selectedFabric.images[0] ?? '',
                    pricePerMeter:      selectedFabric.pricePerMeter,
                    meters,
                    fabricCost,
                    garmentType,
                    collarType:         collarType ?? undefined,
                    stitchingPrice:     stitchingFee,
                    stitchingNotes:     stitchingNotes || undefined,
                    measurementProfile: selectedProfile,
                    totalPrice:         fabricCost + stitchingFee,
                };
            },

            // ── Actions ──────────────────────────────────────────────────────
            setFabric:         (fabric) => set({ selectedFabric: fabric }),
            setMeters:         (m)      => set({ meters: Math.max(1, m) }),
            setGarmentType:    (g)      => set({ garmentType: g, collarType: null }),
            setCollarType:     (c)      => set({ collarType: c }),
            setStitchingNotes: (n)      => set({ stitchingNotes: n }),
            setProfile:        (p)      => set({ selectedProfile: p }),
            reset:             ()       => set({
                selectedFabric:  null,
                meters:          1,
                garmentType:     null,
                collarType:      null,
                stitchingNotes:  '',
                selectedProfile: null,
            }),
        }),
        {
            name: 'fabloom-stitching-draft',
            // Don't persist computed functions
            partialize: (s) => ({
                selectedFabric:  s.selectedFabric,
                meters:          s.meters,
                garmentType:     s.garmentType,
                collarType:      s.collarType,
                stitchingNotes:  s.stitchingNotes,
                selectedProfile: s.selectedProfile,
            }),
        }
    )
);
