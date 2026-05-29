// ============================================================================
// CART TYPES — imported as @/types/cart
// Re-exports from the Zustand store + adds stitching-specific shapes
// ============================================================================

export type {
    StitchingDetails,
    ReadymadeCartItem,
    FabricCartItem,
    AccessoryCartItem,
    CartItem,
} from '@/store/useCartStore';

// ── Garment types for stitching ──────────────────────────────────────────────

export type GarmentType =
    | 'Saudi Kandora'
    | 'Emirati Kandora'
    | 'Chinese Kandora'
    | 'Pleat Kandora'
    | 'Jubba'
    | 'Pleat Jubba'
    | 'Kurta'
    | 'Shirt';

export type CollarType = 'Mandarin' | 'Band' | 'Regular' | 'Nehru';

// Garments that allow collar selection
export const COLLAR_GARMENTS: GarmentType[] = ['Kurta', 'Shirt'];

// Stitching price by garment type (₹) — Fabloom Kandoras rates
export const STITCHING_PRICE: Record<GarmentType, number> = {
    'Saudi Kandora':   850,
    'Emirati Kandora': 1000,
    'Chinese Kandora': 600,
    'Pleat Kandora':   600,
    'Jubba':           350,
    'Pleat Jubba':     400,
    'Kurta':           350,
    'Shirt':           350,
};

// ── Measurement profile (mirrors UserMeasurementProfile model) ───────────────

export interface IMeasurements {
    length?: number;
    shoulder?: number;
    sleeveLength?: number;
    loose1?: number;
    loose2?: number;
    chest?: number;
    waist?: number;
    bottom?: number;
    neck?: number;
}

export interface IPreferences {
    neckType?: 'cut_neck' | 'full_neck' | 'qathari' | '';
    fitPreference?: 'slim' | 'medium' | 'loose' | '';
    cuffType?: 'simple' | 'button' | 'french' | '';
    chestFinish?: number | '';
    waistFinish?: number | '';
}

export interface IMeasurementProfile {
    _id: string;
    profileName: string;
    garmentTypes: string[];
    measurements: IMeasurements;
    preferences?: IPreferences;
    isDefault: boolean;
}

// ── Stitching order item (what gets added to cart) ───────────────────────────

export interface StitchingOrderItem {
    fabricId: string;
    fabricName: string;
    fabricImage: string;
    pricePerMeter: number;
    meters: number;
    fabricCost: number;         // meters × pricePerMeter
    garmentType: GarmentType;
    collarType?: CollarType;
    stitchingPrice: number;
    stitchingNotes?: string;
    measurementProfile: IMeasurementProfile;
    totalPrice: number;         // fabricCost + stitchingPrice
}
