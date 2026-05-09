// ============================================================================
// READYMADE MOCK DATA
// Swap each function body for a real dbConnect() + ReadymadeProduct.find() call.
// ============================================================================

import type { IReadymadeProduct } from '@/types/product';

// Helper: build a mock product quickly
function mock(
    id: string,
    name: string,
    subcategory: string,
    price: number,
    color: string,
    material: string,
    S = 5, M = 8, L = 6, XL = 3, XXL = 1
): IReadymadeProduct {
    return {
        _id: id,
        name,
        description: `Premium ${material} ${name.toLowerCase()} for everyday elegance.`,
        category: 'mens',
        subcategory,
        type: 'readymade',
        price,
        images: [
            `https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man`,
        ],
        featured: false,
        active: true,
        tags: [subcategory, material.toLowerCase(), color.toLowerCase()],
        sizeStock: { S, M, L, XL, XXL },
        material,
        color,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

// ── Kurta ────────────────────────────────────────────────────────────────────
export const MOCK_KURTAS: IReadymadeProduct[] = [
    mock('k1', 'Classic White Kurta',       'kurta', 849,  'White',      'Cotton',    8, 10, 8, 4, 2),
    mock('k2', 'Embroidered Linen Kurta',   'kurta', 1299, 'Off-White',  'Linen',     5,  8, 6, 3, 1),
    mock('k3', 'Festive Silk Kurta',        'kurta', 1899, 'Ivory',      'Silk',      3,  5, 4, 2, 0),
    mock('k4', 'Casual Cotton Kurta',       'kurta', 599,  'Sky Blue',   'Cotton',   10, 12, 9, 5, 2),
    mock('k5', 'Nehru Collar Kurta',        'kurta', 999,  'Charcoal',   'Cotton',    6,  8, 7, 3, 1),
    mock('k6', 'Premium Linen Kurta',       'kurta', 1499, 'Beige',      'Linen',     4,  7, 5, 2, 1),
];

// ── Kandoora & Jubba ─────────────────────────────────────────────────────────
export const MOCK_KANDOORAS: IReadymadeProduct[] = [
    mock('kd1', 'Classic White Kandoora',   'kandoora', 1299, 'White',    'Cotton',    5, 8, 7, 3, 1),
    mock('kd2', 'Embroidered Jubba',        'kandoora', 1899, 'Off-White','Linen',     4, 6, 5, 2, 1),
    mock('kd3', 'Premium Kandoora',         'kandoora', 2199, 'Pearl',    'Egyptian Cotton', 3, 5, 4, 2, 0),
    mock('kd4', 'Slim Fit Kandoora',        'kandoora', 1599, 'White',    'Cotton',    6, 8, 6, 3, 1),
];

// ── Thobe ────────────────────────────────────────────────────────────────────
export const MOCK_THOBES: IReadymadeProduct[] = [
    mock('th1', 'Saudi Thobe — White',      'thobe', 1499, 'White',      'Cotton',    5, 8, 7, 4, 2),
    mock('th2', 'Emirati Kandura',          'thobe', 1799, 'White',      'Linen',     4, 7, 6, 3, 1),
    mock('th3', 'Qatari Thobe',             'thobe', 1999, 'Off-White',  'Silk-blend',3, 5, 4, 2, 1),
    mock('th4', 'Pakistani Thobe — Grey',   'thobe', 1099, 'Grey',       'Cotton',    6, 9, 7, 4, 1),
];

// ── Casual Shirts ─────────────────────────────────────────────────────────────
export const MOCK_SHIRTS: IReadymadeProduct[] = [
    mock('sh1', 'Oxford Button-Down',       'shirt',  699, 'White',      'Cotton',   10,12, 9, 5, 2),
    mock('sh2', 'Linen Summer Shirt',       'shirt',  899, 'Light Blue', 'Linen',     7,10, 8, 4, 1),
    mock('sh3', 'Flannel Check Shirt',      'shirt',  799, 'Navy Check', 'Flannel',   8,11, 9, 5, 2),
    mock('sh4', 'Mandarin Collar Shirt',    'shirt',  949, 'Sage Green', 'Cotton',    6, 9, 7, 3, 1),
    mock('sh5', 'Premium Poplin Shirt',     'shirt', 1099, 'White',      'Poplin',    5, 8, 6, 3, 1),
    mock('sh6', 'Half-Sleeve Casual',       'shirt',  549, 'Sky Blue',   'Cotton',   12,14,11, 6, 2),
];

// ── Pants & Bottoms ──────────────────────────────────────────────────────────
export const MOCK_PANTS: IReadymadeProduct[] = [
    mock('pt1', 'Slim Fit Trousers',        'pants',  799, 'Charcoal',   'Wool-blend', 6, 9, 7, 4, 1),
    mock('pt2', 'Relaxed Linen Pants',      'pants',  899, 'Beige',      'Linen',      7,10, 8, 4, 2),
    mock('pt3', 'Cotton Chinos',            'pants',  699, 'Khaki',      'Cotton',    10,12,10, 5, 2),
    mock('pt4', 'Salwar Pants',             'pants',  499, 'White',      'Cotton',     8,11, 9, 5, 1),
];

// ── Co-ord Sets ───────────────────────────────────────────────────────────────
export const MOCK_COORDS: IReadymadeProduct[] = [
    mock('co1', 'Linen Co-ord Set — Cream', 'coord-set', 1799, 'Cream',  'Linen',    5, 7, 6, 3, 1),
    mock('co2', 'Kurta & Salwar Set',       'coord-set', 1299, 'White',  'Cotton',   6, 9, 7, 4, 1),
    mock('co3', 'Embroidered Co-ord Set',   'coord-set', 2499, 'Ivory',  'Silk',     3, 5, 4, 2, 0),
    mock('co4', 'Pathani Suit Set',         'coord-set', 1599, 'Navy',   'Cotton',   5, 7, 6, 3, 1),
];
