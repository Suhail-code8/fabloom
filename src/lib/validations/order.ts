import { z } from 'zod';

// Shipping address validation schema
export const shippingAddressSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must not exceed 100 characters'),

    email: z
        .string()
        .email('Please enter a valid email address')
        .min(5, 'Email is required'),

    phone: z
        .string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(20, 'Phone number must not exceed 20 digits')
        .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),

    address: z
        .string()
        .min(5, 'Address must be at least 5 characters')
        .max(200, 'Address must not exceed 200 characters'),

    city: z
        .string()
        .min(2, 'City must be at least 2 characters')
        .max(100, 'City must not exceed 100 characters'),

    postalCode: z
        .string()
        .min(3, 'Postal code must be at least 3 characters')
        .max(20, 'Postal code must not exceed 20 characters'),

    country: z
        .string()
        .min(2, 'Country must be at least 2 characters')
        .max(100, 'Country must not exceed 100 characters'),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

// Helper text for form fields
export const shippingFieldHelp = {
    fullName: 'Enter your full name as it appears on your ID',
    email: 'We\'ll send order confirmation to this email',
    phone: 'For delivery coordination',
    address: 'Street address, apartment, suite, etc.',
    city: 'City or town',
    postalCode: 'ZIP or postal code',
    country: 'Country or region',
};
