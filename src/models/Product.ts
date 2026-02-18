import mongoose, { Schema, Document, Model } from 'mongoose';

// ============================================================================
// INTERFACES
// ============================================================================

// Base Product Interface
export interface IProduct extends Document {
    name: string;
    description: string;
    category: 'mens' | 'womens' | 'kids' | 'accessories';
    subcategory?: string; // e.g., 'kurta', 'hijab', 'cap'
    type: 'readymade' | 'fabric' | 'accessory';
    price: number;
    images: string[]; // Cloudinary URLs
    featured: boolean;
    active: boolean;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

// Readymade Product Interface (extends base)
export interface IReadymadeProduct extends IProduct {
    type: 'readymade';
    sizeStock: {
        S: number;
        M: number;
        L: number;
        XL: number;
        XXL?: number;
    };
    material: string; // e.g., 'Cotton', 'Linen'
    color: string;
}

// Fabric Product Interface (extends base)
export interface IFabricProduct extends IProduct {
    type: 'fabric';
    stockInMeters: number; // Total meters available
    pricePerMeter: number; // Override base price
    fabricType: string; // e.g., 'Linen', 'Cotton', 'Silk'
    width: number; // Fabric width in inches
    texture: string; // Cloudinary URL for texture image
    stitchingAvailable: boolean; // Can this fabric be stitched?
    stitchingPrice: number; // Price for stitching service
}

// Accessory Product Interface (extends base)
export interface IAccessoryProduct extends IProduct {
    type: 'accessory';
    stock: number; // Simple stock count
    material?: string;
    color?: string;
}

// ============================================================================
// SCHEMAS
// ============================================================================

// Base Product Schema
const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        category: {
            type: String,
            enum: ['mens', 'womens', 'kids', 'accessories'],
            required: true,
        },
        subcategory: { type: String },
        type: {
            type: String,
            enum: ['readymade', 'fabric', 'accessory'],
            required: true,
        },
        price: { type: Number, required: true, min: 0 },
        images: [{ type: String }],
        featured: { type: Boolean, default: false },
        active: { type: Boolean, default: true },
        tags: [{ type: String }],
    },
    {
        timestamps: true,
        discriminatorKey: 'type',
    }
);

// Indexes for performance
ProductSchema.index({ type: 1, category: 1, active: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ tags: 1 });

// Base Product Model
const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

// ============================================================================
// DISCRIMINATORS
// ============================================================================

// Readymade Product Discriminator
const ReadymadeProductSchema = new Schema<IReadymadeProduct>({
    sizeStock: {
        S: { type: Number, default: 0, min: 0 },
        M: { type: Number, default: 0, min: 0 },
        L: { type: Number, default: 0, min: 0 },
        XL: { type: Number, default: 0, min: 0 },
        XXL: { type: Number, default: 0, min: 0 },
    },
    material: { type: String, required: true },
    color: { type: String, required: true },
});

const ReadymadeProduct: Model<IReadymadeProduct> =
    mongoose.models.readymade ||
    Product.discriminator<IReadymadeProduct>('readymade', ReadymadeProductSchema);

// Fabric Product Discriminator
const FabricProductSchema = new Schema<IFabricProduct>({
    stockInMeters: { type: Number, required: true, min: 0 },
    pricePerMeter: { type: Number, required: true, min: 0 },
    fabricType: { type: String, required: true },
    width: { type: Number, required: true }, // in inches
    texture: { type: String }, // Cloudinary URL
    stitchingAvailable: { type: Boolean, default: true },
    stitchingPrice: { type: Number, default: 0, min: 0 },
});

const FabricProduct: Model<IFabricProduct> =
    mongoose.models.fabric ||
    Product.discriminator<IFabricProduct>('fabric', FabricProductSchema);

// Accessory Product Discriminator
const AccessoryProductSchema = new Schema<IAccessoryProduct>({
    stock: { type: Number, required: true, min: 0 },
    material: { type: String },
    color: { type: String },
});

const AccessoryProduct: Model<IAccessoryProduct> =
    mongoose.models.accessory ||
    Product.discriminator<IAccessoryProduct>('accessory', AccessoryProductSchema);

// ============================================================================
// EXPORTS
// ============================================================================

export { Product, ReadymadeProduct, FabricProduct, AccessoryProduct };
