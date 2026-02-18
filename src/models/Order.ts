import mongoose, { Schema, Document } from 'mongoose';

// ============================================================================
// INTERFACES
// ============================================================================

interface IOrderItem {
    itemType: 'readymade' | 'fabric' | 'accessory';
    productId: mongoose.Types.ObjectId;
    productName: string; // Snapshot
    productImage: string; // Snapshot

    // Readymade/Accessory fields
    size?: 'S' | 'M' | 'L' | 'XL' | 'XXL';
    quantity?: number;
    price?: number;

    // Fabric fields
    meters?: number;
    pricePerMeter?: number;
    totalPrice?: number;

    // Stitching fields (only for fabric with stitching)
    stitchingDetails?: {
        measurements: {
            neck: number;
            chest: number;
            waist: number;
            shoulder: number;
            sleeveLength: number;
            shirtLength: number;
        };
        stitchingPrice: number;
        specialInstructions?: string;
        status: 'pending' | 'in_progress' | 'completed' | 'delivered';
        estimatedCompletionDate?: Date;
    };
}

export interface IOrder extends Document {
    userId: string; // Clerk user ID (e.g. 'user_2abc...') or 'guest'
    orderNumber: string; // Auto-generated unique order number
    items: IOrderItem[];

    // Pricing
    subtotal: number;
    tax: number;
    shippingCost: number;
    totalAmount: number;

    // Shipping
    shippingAddress: {
        fullName: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };

    // Order status
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    paymentMethod: 'card' | 'cod' | 'upi';

    // Tracking
    trackingNumber?: string;
    estimatedDeliveryDate?: Date;
    deliveredAt?: Date;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// SCHEMAS
// ============================================================================

const OrderItemSchema = new Schema({
    itemType: {
        type: String,
        enum: ['readymade', 'fabric', 'accessory'],
        required: true,
    },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },

    // Readymade/Accessory
    size: { type: String, enum: ['S', 'M', 'L', 'XL', 'XXL'] },
    quantity: { type: Number, min: 1 },
    price: { type: Number, min: 0 },

    // Fabric
    meters: { type: Number, min: 0.5 },
    pricePerMeter: { type: Number, min: 0 },
    totalPrice: { type: Number, min: 0 },

    // Stitching
    stitchingDetails: {
        measurements: {
            neck: Number,
            chest: Number,
            waist: Number,
            shoulder: Number,
            sleeveLength: Number,
            shirtLength: Number,
        },
        stitchingPrice: { type: Number, min: 0 },
        specialInstructions: { type: String, maxlength: 500 },
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed', 'delivered'],
            default: 'pending',
        },
        estimatedCompletionDate: Date,
    },
});

const OrderSchema = new Schema<IOrder>(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        items: [OrderItemSchema],

        subtotal: { type: Number, required: true, min: 0 },
        tax: { type: Number, default: 0, min: 0 },
        shippingCost: { type: Number, default: 0, min: 0 },
        totalAmount: { type: Number, required: true, min: 0 },

        shippingAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            addressLine1: { type: String, required: true },
            addressLine2: String,
            city: { type: String, required: true },
            state: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true, default: 'India' },
        },

        status: {
            type: String,
            enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
            index: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
            index: true,
        },
        paymentMethod: {
            type: String,
            enum: ['card', 'cod', 'upi'],
            required: true,
        },

        trackingNumber: String,
        estimatedDeliveryDate: Date,
        deliveredAt: Date,
    },
    { timestamps: true }
);

// Auto-generate order number before validation
OrderSchema.pre('validate', async function (next) {
    if (!this.orderNumber) {
        const count = await mongoose.model('Order').countDocuments();
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        this.orderNumber = `FB${year}${month}${(count + 1).toString().padStart(5, '0')}`;
    }
    next();
});

// Indexes for queries
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });

// ============================================================================
// EXPORTS
// ============================================================================

export const Order =
    mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export type { IOrderItem };
