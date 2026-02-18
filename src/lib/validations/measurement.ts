import { z } from 'zod';

// Garment style options
export const garmentStyles = ['Jubbah', 'Kurta', 'Shirt', 'Kandura'] as const;

// Measurement validation schema
export const measurementSchema = z.object({
    style: z.enum(garmentStyles, {
        required_error: 'Please select a garment style',
        invalid_type_error: 'Invalid garment style selected',
    }),

    neck: z
        .number({
            required_error: 'Neck measurement is required',
            invalid_type_error: 'Neck must be a number',
        })
        .min(10, 'Neck measurement must be at least 10 inches')
        .max(25, 'Neck measurement must not exceed 25 inches')
        .positive('Neck measurement must be positive'),

    chest: z
        .number({
            required_error: 'Chest measurement is required',
            invalid_type_error: 'Chest must be a number',
        })
        .min(20, 'Chest measurement must be at least 20 inches')
        .max(60, 'Chest measurement must not exceed 60 inches')
        .positive('Chest measurement must be positive'),

    waist: z
        .number({
            required_error: 'Waist measurement is required',
            invalid_type_error: 'Waist must be a number',
        })
        .min(20, 'Waist measurement must be at least 20 inches')
        .max(60, 'Waist measurement must not exceed 60 inches')
        .positive('Waist measurement must be positive'),

    shoulder: z
        .number({
            required_error: 'Shoulder measurement is required',
            invalid_type_error: 'Shoulder must be a number',
        })
        .min(10, 'Shoulder measurement must be at least 10 inches')
        .max(30, 'Shoulder measurement must not exceed 30 inches')
        .positive('Shoulder measurement must be positive'),

    sleeveLength: z
        .number({
            required_error: 'Sleeve length is required',
            invalid_type_error: 'Sleeve length must be a number',
        })
        .min(10, 'Sleeve length must be at least 10 inches')
        .max(40, 'Sleeve length must not exceed 40 inches')
        .positive('Sleeve length must be positive'),

    shirtLength: z
        .number({
            required_error: 'Garment length is required',
            invalid_type_error: 'Garment length must be a number',
        })
        .min(20, 'Garment length must be at least 20 inches')
        .max(70, 'Garment length must not exceed 70 inches')
        .positive('Garment length must be positive'),

    notes: z
        .string()
        .max(500, 'Notes must not exceed 500 characters')
        .optional()
        .or(z.literal('')),
});

// TypeScript type inferred from schema
export type MeasurementFormData = z.infer<typeof measurementSchema>;

// Garment style descriptions
export const styleDescriptions = {
    Jubbah: 'Long traditional robe (ankle length)',
    Kurta: 'Knee-length tunic',
    Shirt: 'Standard shirt (hip length)',
    Kandura: 'Traditional Emirati dress (ankle length)',
};

// Helper text for each measurement field
export const measurementHelp = {
    style: 'Select the type of garment you want stitched',
    neck: 'Measure around the base of your neck',
    chest: 'Measure around the fullest part of your chest',
    waist: 'Measure around your natural waistline',
    shoulder: 'Measure from shoulder point to shoulder point across the back',
    sleeveLength: 'Measure from shoulder to wrist with arm slightly bent',
    notes: 'Any special instructions or preferences (optional)',
};

// Dynamic length labels based on style
export const getLengthLabel = (style?: string) => {
    switch (style) {
        case 'Jubbah':
        case 'Kandura':
            return 'Full Length (Shoulder to Ankle)';
        case 'Kurta':
            return 'Length (Shoulder to Knee)';
        case 'Shirt':
            return 'Length (Shoulder to Hip)';
        default:
            return 'Garment Length';
    }
};

export const getLengthHelp = (style?: string) => {
    switch (style) {
        case 'Jubbah':
        case 'Kandura':
            return 'Measure from base of neck to ankle';
        case 'Kurta':
            return 'Measure from base of neck to knee';
        case 'Shirt':
            return 'Measure from base of neck to desired hip length';
        default:
            return 'Measure from the base of neck to desired hem length';
    }
};
