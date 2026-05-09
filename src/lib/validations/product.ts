import { z } from 'zod';

// ============================================================================
// PRODUCT VALIDATION SCHEMAS (Discriminated Union by type)
// ============================================================================

const sizeStockSchema = z.object({
    S:   z.number().min(0).default(0),
    M:   z.number().min(0).default(0),
    L:   z.number().min(0).default(0),
    XL:  z.number().min(0).default(0),
    XXL: z.number().min(0).optional(),
});

const baseFields = {
    name:        z.string().min(2, 'Name must be at least 2 characters').max(200),
    description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
    category:    z.enum(['mens', 'womens', 'kids', 'accessories']),
    subcategory: z.string().optional(),
    price:       z.number().min(0, 'Price must be non-negative'),
    slug:        z.string().min(2).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
    images:      z.array(z.string()).min(1, 'At least one image is required'),
    featured:    z.boolean().default(false),
    active:      z.boolean().default(true),
    tags:        z.array(z.string()).default([]),
};

export const readymadeProductSchema = z.object({
    ...baseFields,
    type:      z.literal('readymade'),
    sizeStock: sizeStockSchema,
    material:  z.string().min(1, 'Material is required'),
    color:     z.string().min(1, 'Color is required'),
});

export const fabricProductSchema = z.object({
    ...baseFields,
    type:               z.literal('fabric'),
    stockInMeters:      z.number().min(0),
    pricePerMeter:      z.number().min(0),
    fabricType:         z.string().min(1, 'Fabric type is required'),
    width:              z.number().min(1),
    texture:            z.string().optional(),
    stitchingAvailable: z.boolean().default(true),
    stitchingPrice:     z.number().min(0).default(0),
});

export const accessoryProductSchema = z.object({
    ...baseFields,
    type:     z.literal('accessory'),
    stock:    z.number().min(0),
    material: z.string().optional(),
    color:    z.string().optional(),
});

export const productSchema = z.discriminatedUnion('type', [
    readymadeProductSchema,
    fabricProductSchema,
    accessoryProductSchema,
]);

// For admin field-only edits (no type change, all optional)
export const updateProductSchema = z.object({
    name:               z.string().min(2).max(200).optional(),
    description:        z.string().min(10).max(5000).optional(),
    price:              z.number().min(0).optional(),
    featured:           z.boolean().optional(),
    active:             z.boolean().optional(),
    tags:               z.array(z.string()).optional(),
    // Readymade
    sizeStock:          sizeStockSchema.optional(),
    material:           z.string().optional(),
    color:              z.string().optional(),
    // Fabric
    stockInMeters:      z.number().min(0).optional(),
    pricePerMeter:      z.number().min(0).optional(),
    stitchingAvailable: z.boolean().optional(),
    stitchingPrice:     z.number().min(0).optional(),
    // Accessory
    stock:              z.number().min(0).optional(),
});

export type ProductInput       = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
