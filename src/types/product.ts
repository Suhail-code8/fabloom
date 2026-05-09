// ============================================================================
// PRODUCT TYPES — mirrors the full Mongoose discriminator shapes
// Import from '@/types/product' throughout the app
// ============================================================================

// ── Shared base (serialised lean() output from MongoDB) ─────────────────────

export interface IBaseProduct {
    _id: string;
    name: string;
    description: string;
    category: 'mens' | 'womens' | 'kids' | 'accessories';
    subcategory?: string;
    type: 'readymade' | 'fabric' | 'accessory';
    price: number;
    images: string[];       // Cloudinary URLs
    featured: boolean;
    active: boolean;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

// ── Size stock map ───────────────────────────────────────────────────────────

export interface SizeStock {
    S: number;
    M: number;
    L: number;
    XL: number;
    XXL?: number;
}

export type SizeKey = keyof SizeStock;  // 'S' | 'M' | 'L' | 'XL' | 'XXL'

// ── Readymade discriminator ──────────────────────────────────────────────────

export interface IReadymadeProduct extends IBaseProduct {
    type: 'readymade';
    sizeStock: SizeStock;
    material: string;   // e.g. 'Cotton', 'Linen'
    color: string;
}

// ── Fabric discriminator ─────────────────────────────────────────────────────

export interface IFabricProduct extends IBaseProduct {
    type: 'fabric';
    stockInMeters: number;
    pricePerMeter: number;
    fabricType: string;         // 'Linen' | 'Cotton' | 'Silk'
    width: number;              // in inches
    gsm?: number;               // grams per square meter
    texture?: string;           // Cloudinary URL
    stitchingAvailable: boolean;
    stitchingPrice: number;
    suitableFor?: string[];     // ['Kurta', 'Shirt', 'Pant', 'Thobe']
}

// ── Fabric subcategory filter ────────────────────────────────────────────────

export type FabricSubcategory =
    | 'all'
    | 'linen'
    | 'cotton'
    | 'polyester'
    | 'silk'
    | 'wool'
    | 'special';

// ── Accessory discriminator ──────────────────────────────────────────────────

export interface IAccessoryProduct extends IBaseProduct {
    type: 'accessory';
    stock: number;
    material?: string;
    color?: string;
}

// ── Perfume extended accessory ───────────────────────────────────────────────

export type FragranceFamily = 'arabian' | 'floral' | 'fresh' | 'woody' | 'gift-set';
export type Gender = 'Unisex' | 'Men' | 'Women';

export interface FragranceNotes {
    top:  string[];
    heart: string[];
    base:  string[];
}

export interface IPerfumeProduct extends IAccessoryProduct {
    subcategory: FragranceFamily;
    volume: number;          // ml
    gender: Gender;
    fragranceNotes: FragranceNotes;
    concentration?: string; // EDP | EDT | Attar
}

// ── Cap extended accessory ───────────────────────────────────────────────────

export type CapSubcategory = 'kufi' | 'prayer' | 'snapback' | 'taqiyah' | 'summer';
export type CapSize = 'One-Size' | 'S' | 'M' | 'L';

export interface ColorVariant {
    name: string;
    hex: string;
    stock: number;
}

export interface ICapProduct extends IAccessoryProduct {
    subcategory: CapSubcategory;
    colorVariants: ColorVariant[];
    sizeVariants: CapSize[];
}

// ── Accessories sub-categories ────────────────────────────────────────────────

export type AccessorySubcategory =
    | 'hijab'
    | 'belt'
    | 'socks'
    | 'wallet'
    | 'watch'
    | 'pocket-square';

// ── Union ────────────────────────────────────────────────────────────────────

export type AnyProduct = IReadymadeProduct | IFabricProduct | IAccessoryProduct;

// ── Readymade subcategory groupings ─────────────────────────────────────────

export type ReadymadeSubcategory =
    | 'kurta'
    | 'kandoora'
    | 'thobe'
    | 'shirt'
    | 'pants'
    | 'coord-set';

// ── Filter state (used by ReadymadeFilterContext) ────────────────────────────

export interface ReadymadeFilters {
    sizes: SizeKey[];
    priceMin: number;
    priceMax: number;
    inStockOnly: boolean;
    sortBy: 'latest' | 'price-asc' | 'price-desc';
}
