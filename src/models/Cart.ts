import mongoose, { Schema, Document } from 'mongoose';

// ============================================================================
// INTERFACES
// ============================================================================

// Cart Item Types
interface IReadymadeCartItem {
    itemType: 'readymade';
    productId: mongoose.Types.ObjectId;
    size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
    quantity: number;
    price: number; // Snapshot at time of adding
}

interface IFabricCartItem {
    itemType: 'fabric';
    productId: mongoose.Types.ObjectId;
    meters: number; // Quantity in meters
    pricePerMeter: number; // Snapshot
    totalPrice: number; // meters * pricePerMeter
    addStitching: boolean; // Did user opt for stitching?
    stitchingDetails?: {
        measurementProfileId?: mongoose.Types.ObjectId; // Link to saved profile
        customMeasurements?: {
            neck: number;
            chest: number;
            shoulder: number;
            sleeveLength: number;
            shirtLength: number;
        };
        stitchingPrice: number; // Snapshot
        specialInstructions?: string;
    };
}

interface IAccessoryCartItem {
    itemType: 'accessory';
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number; // Snapshot
}

type CartItem = IReadymadeCartItem | IFabricCartItem | IAccessoryCartItem;

export interface ICart extends Document {
    userId: mongoose.Types.ObjectId;
    items: CartItem[];
    totalAmount: number; // Calculated field
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// SCHEMAS
// ============================================================================

const CartItemSchema = new Schema(
    {
        itemType: {
            type: String,
            enum: ['readymade', 'fabric', 'accessory'],
            required: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },

        // Readymade fields
        size: {
            type: String,
            enum: ['S', 'M', 'L', 'XL', 'XXL'],
        },
        quantity: { type: Number, min: 1 },
        price: { type: Number, min: 0 },

        // Fabric fields
        meters: { type: Number, min: 0.5 },
        pricePerMeter: { type: Number, min: 0 },
        totalPrice: { type: Number, min: 0 },
        addStitching: { type: Boolean, default: false },
        stitchingDetails: {
            measurementProfileId: {
                type: Schema.Types.ObjectId,
                ref: 'UserMeasurementProfile',
            },
            customMeasurements: {
                neck: Number,
                chest: Number,
                shoulder: Number,
                sleeveLength: Number,
                shirtLength: Number,
            },
            stitchingPrice: { type: Number, min: 0 },
            specialInstructions: { type: String, maxlength: 500 },
        },
    },
    { _id: false }
);

const CartSchema = new Schema<ICart>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
            index: true,
        },
        items: [CartItemSchema],
        totalAmount: { type: Number, default: 0, min: 0 },
    },
    { timestamps: true }
);

// Pre-save hook to calculate total amount
CartSchema.pre('save', function (next) {
    let total = 0;

    this.items.forEach((item: any) => {
        if (item.itemType === 'readymade' || item.itemType === 'accessory') {
            total += item.price * item.quantity;
        } else if (item.itemType === 'fabric') {
            total += item.totalPrice;
            if (item.addStitching && item.stitchingDetails) {
                total += item.stitchingDetails.stitchingPrice;
            }
        }
    });

    this.totalAmount = Math.round(total * 100) / 100; // Round to 2 decimals
    next();
});

// ============================================================================
// EXPORTS
// ============================================================================

export const Cart =
    mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

// Export types for use in other files
export type { IReadymadeCartItem, IFabricCartItem, IAccessoryCartItem, CartItem };
