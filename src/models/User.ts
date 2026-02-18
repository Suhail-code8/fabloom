import mongoose, { Schema, Document } from 'mongoose';

// ============================================================================
// INTERFACES
// ============================================================================

export interface IUser extends Document {
    clerkId?: string; // If using Clerk
    email: string;
    name: string;
    phone?: string;
    role: 'customer' | 'admin';
    avatar?: string;
    addresses: {
        fullName: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        isDefault: boolean;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// SCHEMA
// ============================================================================

const UserSchema = new Schema<IUser>(
    {
        clerkId: { type: String, unique: true, sparse: true, index: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        name: { type: String, required: true },
        phone: { type: String },
        role: {
            type: String,
            enum: ['customer', 'admin'],
            default: 'customer',
        },
        avatar: { type: String },
        addresses: [
            {
                fullName: { type: String, required: true },
                phone: { type: String, required: true },
                addressLine1: { type: String, required: true },
                addressLine2: String,
                city: { type: String, required: true },
                state: { type: String, required: true },
                postalCode: { type: String, required: true },
                country: { type: String, required: true, default: 'India' },
                isDefault: { type: Boolean, default: false },
            },
        ],
    },
    { timestamps: true }
);

// ============================================================================
// EXPORTS
// ============================================================================

export const User =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
