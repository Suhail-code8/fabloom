import mongoose, { Schema, Document } from 'mongoose';

// ============================================================================
// INTERFACES
// ============================================================================

export interface IMeasurements {
    neck: number; // in inches
    chest: number;
    waist?: number;
    shoulder: number;
    sleeveLength: number;
    shirtLength: number;
    pantLength?: number;
    pantWaist?: number;
}

export interface IUserMeasurementProfile extends Document {
    userId: mongoose.Types.ObjectId; // Reference to User
    profileName: string; // e.g., "My Default", "For Son"
    measurements: IMeasurements;
    garmentType: 'kurta' | 'thobe' | 'shirt' | 'pant' | 'other';
    isDefault: boolean; // Quick select for checkout
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// SCHEMAS
// ============================================================================

const MeasurementSchema = new Schema<IMeasurements>({
    neck: { type: Number, required: true, min: 10, max: 30 },
    chest: { type: Number, required: true, min: 20, max: 60 },
    waist: { type: Number, min: 20, max: 60 },
    shoulder: { type: Number, required: true, min: 10, max: 30 },
    sleeveLength: { type: Number, required: true, min: 10, max: 40 },
    shirtLength: { type: Number, required: true, min: 20, max: 60 },
    pantLength: { type: Number, min: 20, max: 50 },
    pantWaist: { type: Number, min: 20, max: 60 },
});

const UserMeasurementProfileSchema = new Schema<IUserMeasurementProfile>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        profileName: { type: String, required: true, trim: true },
        measurements: { type: MeasurementSchema, required: true },
        garmentType: {
            type: String,
            enum: ['kurta', 'thobe', 'shirt', 'pant', 'other'],
            required: true,
        },
        isDefault: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Ensure only one default profile per user per garment type
UserMeasurementProfileSchema.index(
    { userId: 1, garmentType: 1, isDefault: 1 },
    { unique: true, partialFilterExpression: { isDefault: true } }
);

// ============================================================================
// EXPORTS
// ============================================================================

export const UserMeasurementProfile =
    mongoose.models.UserMeasurementProfile ||
    mongoose.model<IUserMeasurementProfile>(
        'UserMeasurementProfile',
        UserMeasurementProfileSchema
    );
