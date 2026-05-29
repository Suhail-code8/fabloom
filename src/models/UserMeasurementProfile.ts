import mongoose, { Schema, Document } from 'mongoose';

// ============================================================================
// INTERFACES
// ============================================================================

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
    neckType?: 'cut_neck' | 'full_neck' | 'qathari';
    fitPreference?: 'slim' | 'medium' | 'loose';
    cuffType?: 'simple' | 'button' | 'french';
    chestFinish?: number;
    waistFinish?: number;
}

export interface IUserMeasurementProfile extends Document {
    userId: string; // Store Clerk ID as string
    profileName: string; // e.g., "My Default", "For Son"
    measurements: IMeasurements;
    preferences?: IPreferences;
    garmentTypes: string[]; // e.g., ['saudi_kandora', 'kurta', etc]
    isDefault: boolean; // Quick select for checkout
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// SCHEMAS
// ============================================================================

const MeasurementSchema = new Schema<IMeasurements>({
    length: { type: Number, min: 20, max: 180 },
    shoulder: { type: Number, min: 10, max: 60 },
    sleeveLength: { type: Number, min: 10, max: 80 },
    loose1: { type: Number, min: 10, max: 60 },
    loose2: { type: Number, min: 10, max: 50 },
    chest: { type: Number, min: 20, max: 150 },
    waist: { type: Number, min: 20, max: 150 },
    bottom: { type: Number, min: 20, max: 150 },
    neck: { type: Number, min: 10, max: 60 },
});

const PreferenceSchema = new Schema<IPreferences>({
    neckType: { type: String, enum: ['cut_neck', 'full_neck', 'qathari'] },
    fitPreference: { type: String, enum: ['slim', 'medium', 'loose'] },
    cuffType: { type: String, enum: ['simple', 'button', 'french'] },
    chestFinish: { type: Number, min: 20, max: 150 },
    waistFinish: { type: Number, min: 20, max: 150 },
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
        preferences: { type: PreferenceSchema },
        garmentTypes: {
            type: [String],
            default: [],
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
