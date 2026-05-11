import type { IFabricProduct } from '@/types/product';

// ============================================================================
// FABRIC MOCK DATA — all 6 subcategories
// subcategory values must match FabricSubcategory type:
// 'linen' | 'cotton' | 'polyester' | 'silk' | 'wool' | 'special'
// ============================================================================

function fab(
    id: string,
    name: string,
    desc: string,
    subcategory: string,
    fabricType: string,
    pricePerMeter: number,
    stockInMeters: number,
    width: number,
    gsm: number,
    suitableFor: string[],
    imgSlug: string,
    featured = false,
): IFabricProduct {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return {
        _id: id,
        name,
        slug,
        description: desc,
        category: 'mens',
        subcategory,
        type: 'fabric',
        price: pricePerMeter,
        images: [`https://res.cloudinary.com/demo/image/upload/v1/samples/${imgSlug}`],
        featured,
        active: true,
        tags: [subcategory, fabricType.toLowerCase()],
        stockInMeters,
        pricePerMeter,
        fabricType,
        width,
        gsm,
        texture: `https://res.cloudinary.com/demo/image/upload/v1/samples/${imgSlug}`,
        stitchingAvailable: true,
        stitchingPrice: 0,
        suitableFor,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

// ── 1. Linen ──────────────────────────────────────────────────────────────────
export const LINEN_FABRICS: IFabricProduct[] = [
    fab('ln1', 'Egyptian Linen — Natural',    'Premium Egyptian linen, breathable & light.',   'linen', 'Linen', 340, 48, 58, 180, ['Kurta','Thobe','Shirt'],     'landscapes/beach-boat', true),
    fab('ln2', 'Irish Linen — Off White',      'Crisp Irish linen with a clean drape.',          'linen', 'Linen', 390, 30, 60, 195, ['Kurta','Thobe'],             'landscapes/nature-mountains'),
    fab('ln3', 'Washed Linen — Stone Grey',    'Pre-washed for softness. Everyday essential.',   'linen', 'Linen', 310, 60, 54, 170, ['Shirt','Pant','Kurta'],      'landscapes/road-safari'),
    fab('ln4', 'Linen-Cotton Blend — Sky',     'Linen-cotton blend, wrinkle-resistant.',          'linen', 'Linen-Cotton', 260, 55, 58, 160, ['Shirt','Kurta'],     'landscapes/girl-urban-view'),
];

// ── 2. Cotton & Cotton Blends ─────────────────────────────────────────────────
export const COTTON_FABRICS: IFabricProduct[] = [
    fab('ct1', 'Pure Cotton — Slate Blue',     'Soft weave cotton, ideal for casual wear.',      'cotton', 'Cotton', 220, 60, 54, 140, ['Kurta','Shirt','Pant'],    'landscapes/nature-mountains'),
    fab('ct2', 'Khadi Cotton — Off White',     'Hand-spun khadi, textured and authentic.',        'cotton', 'Khadi', 290, 36, 48, 155, ['Kurta','Thobe'],           'ecommerce/accessories-bag'),
    fab('ct3', 'Premium Poplin — White',       'Crisp poplin, wrinkle-resistant, formal drape.',  'cotton', 'Poplin', 380, 55, 60, 130, ['Thobe','Shirt'],          'ecommerce/shoes', true),
    fab('ct4', 'Cotton Voile — Ivory',         'Sheer cotton voile, flowy and breathable.',       'cotton', 'Voile', 195, 40, 56, 80,  ['Kurta','Shirt'],          'landscapes/beach-boat'),
    fab('ct5', 'Cotton Twill — Navy',          'Dense twill weave, structured feel.',             'cotton', 'Twill', 245, 44, 58, 200, ['Pant','Shirt'],           'landscapes/road-safari'),
];

// ── 3. Polyester & Blends ─────────────────────────────────────────────────────
export const POLYESTER_FABRICS: IFabricProduct[] = [
    fab('py1', 'Poly-Cotton — Charcoal',       'Easy-care poly-cotton blend, sharp finish.',     'polyester', 'Poly-Cotton', 165, 80, 60, 150, ['Shirt','Pant'],   'landscapes/road-safari'),
    fab('py2', 'Microfiber — Pearl White',     'Ultra-smooth microfiber, wrinkle-free.',          'polyester', 'Microfiber', 195, 70, 58, 120, ['Thobe','Shirt'],   'landscapes/nature-mountains'),
    fab('py3', 'Poly-Viscose — Dark Brown',    'Poly-viscose blend with a subtle sheen.',         'polyester', 'Poly-Viscose', 180, 65, 56, 145, ['Kurta','Pant'],  'landscapes/girl-urban-view'),
];

// ── 4. Silk & Satin ───────────────────────────────────────────────────────────
export const SILK_FABRICS: IFabricProduct[] = [
    fab('sk1', 'Silk Dupion — Champagne',      'Lustrous dupion, subtle texture and sheen.',     'silk', 'Silk Dupion', 760, 14, 44, 110, ['Kurta','Thobe'],       'landscapes/girl-urban-view', true),
    fab('sk2', 'Pure Silk — Ivory',            '100% mulberry silk, ultra-smooth drape.',         'silk', 'Pure Silk', 950, 8,  44, 100, ['Kurta','Shirt'],         'landscapes/beach-boat', true),
    fab('sk3', 'Satin Weave — Midnight Navy',  'Glossy satin-weave polyester, rich appearance.', 'silk', 'Satin', 340, 22, 54, 120,    ['Thobe','Kurta'],          'landscapes/road-safari'),
    fab('sk4', 'Crepe Silk — Blush Pink',      'Lightweight crepe with elegant drape.',           'silk', 'Crepe Silk', 680, 12, 42, 90,   ['Kurta','Shirt'],       'landscapes/nature-mountains'),
];

// ── 5. Woolen & Winter ────────────────────────────────────────────────────────
export const WOOLEN_FABRICS: IFabricProduct[] = [
    fab('wl1', 'Italian Wool Blend — Charcoal','Luxurious mid-weight wool blend.',               'wool', 'Wool Blend', 580, 22, 60, 280, ['Pant','Shirt','Kurta'], 'landscapes/road-safari', true),
    fab('wl2', 'Tweed — Earthy Brown',         'Classic tweed with a warm, rustic feel.',         'wool', 'Tweed', 650, 18, 54, 320, ['Pant','Shirt'],            'landscapes/beach-boat'),
    fab('wl3', 'Merino Wool — Cream',          'Fine merino, soft against skin, light weight.',   'wool', 'Merino Wool', 780, 14, 58, 240, ['Shirt','Kurta'],      'landscapes/nature-mountains'),
    fab('wl4', 'Sherwani Brocade-Wool — Navy', 'Structured wool with brocade motif panel.',       'wool', 'Wool Brocade', 890, 10, 52, 350, ['Kurta','Thobe'],     'landscapes/girl-urban-view'),
];

// ── 6. Special Occasion ───────────────────────────────────────────────────────
export const SPECIAL_FABRICS: IFabricProduct[] = [
    fab('sp1', 'Zari Brocade — Gold',          'Heavy zari weave, festive gold motifs.',          'special', 'Brocade', 1200, 8,  44, 380, ['Kurta','Thobe'],      'landscapes/beach-boat', true),
    fab('sp2', 'Velvet — Royal Maroon',        'Plush velvet, rich texture and depth.',           'special', 'Velvet', 870, 12, 48, 340, ['Kurta','Pant'],         'landscapes/road-safari', true),
    fab('sp3', 'Jacquard — Ivory Gold',        'Woven jacquard pattern, subtle sheen.',           'special', 'Jacquard', 740, 10, 52, 290, ['Kurta','Thobe'],      'landscapes/girl-urban-view'),
    fab('sp4', 'Chanderi Silk-Cotton',         'Traditional Chanderi, light and translucent.',    'special', 'Chanderi', 560, 16, 42, 85,  ['Kurta','Shirt'],       'landscapes/nature-mountains'),
    fab('sp5', 'Banarasi Silk — Crimson',      'Authentic Banarasi weave with zari border.',      'special', 'Banarasi Silk', 1450, 6, 44, 130, ['Thobe','Kurta'],  'landscapes/beach-boat', true),
];

// ── All combined ──────────────────────────────────────────────────────────────
export const ALL_FABRICS: IFabricProduct[] = [
    ...LINEN_FABRICS,
    ...COTTON_FABRICS,
    ...POLYESTER_FABRICS,
    ...SILK_FABRICS,
    ...WOOLEN_FABRICS,
    ...SPECIAL_FABRICS,
];
