import mongoose, { Schema, Document } from 'mongoose';

// ============================================================================
// INTERFACES
// ============================================================================

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

export interface IUserMeasurementProfile extends Document {
    userId: string; // Store Clerk ID as string
    profileName: string; // e.g., "My Default", "For Son"
    measurements: IMeasurements;
    garmentTypes: string[]; // e.g., ['kurta', 'thobe']
    isDefault: boolean; // Quick select for checkout
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// SCHEMAS
// ============================================================================

const MeasurementSchema = new Schema<IMeasurements>({
    neck: { type: Number, min: 5, max: 50 },
    chest: { type: Number, min: 10, max: 100 },
    waist: { type: Number, min: 10, max: 100 },
    hip: { type: Number, min: 10, max: 100 },
    shoulder: { type: Number, min: 5, max: 50 },
    sleeveLength: { type: Number, min: 5, max: 60 },
    shirtLength: { type: Number, min: 10, max: 100 },
    thobeLength: { type: Number, min: 20, max: 150 },
    pantLength: { type: Number, min: 10, max: 100 },
    pantWaist: { type: Number, min: 10, max: 100 },
    inseam: { type: Number, min: 10, max: 100 },
});

const UserMeasurementProfileSchema = new Schema<IUserMeasurementProfile>(
    {
        userId: {
            type: String, // Clerk IDs are strings
            required: true,
            index: true,
        },
        profileName: { type: String, required: true, trim: true },
        measurements: { type: MeasurementSchema, required: true },
        garmentTypes: {
            type: [String],
            default: ['other'],
        },
        isDefault: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Ensure only one default profile per user
UserMeasurementProfileSchema.index(
    { userId: 1, isDefault: 1 },
    { unique: true, partialFilterExpression: { isDefault: true } }
);

// ============================================================================
// EXPORTS
// ============================================================================

if (mongoose.models.UserMeasurementProfile) {
    delete (mongoose.models as any).UserMeasurementProfile;
}

export const UserMeasurementProfile = mongoose.model<IUserMeasurementProfile>(
    'UserMeasurementProfile',
    UserMeasurementProfileSchema
);
