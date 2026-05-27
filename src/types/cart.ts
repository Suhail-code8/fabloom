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

export type GarmentType = 'Kurta' | 'Thobe' | 'Shirt' | 'Pant';

export type CollarType = 'Mandarin' | 'Band' | 'Regular' | 'Nehru';

// Garments that allow collar selection
export const COLLAR_GARMENTS: GarmentType[] = ['Kurta', 'Shirt'];

// Base stitching price by garment type (₹)
export const STITCHING_PRICE: Record<GarmentType, number> = {
    Kurta:    350,
    Thobe:    450,
    Shirt:    300,
    Pant:     250,
};

// ── Measurement profile (mirrors UserMeasurementProfile model) ───────────────

export interface IMeasurements {
    neck?: number;
    chest?: number;
    waist?: number;
    hip?: number;
    shoulder?: number;
    sleeveLength?: number;
    shirtLength?: number;
    thobeLength?: number;
    pantLength?: number;
    pantWaist?: number;
    inseam?: number;
}

export interface IMeasurementProfile {
    _id: string;
    profileName: string;
    garmentTypes: string[];
    measurements: IMeasurements;
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
