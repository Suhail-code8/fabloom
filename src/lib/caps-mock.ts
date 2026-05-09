import type { ICapProduct, ColorVariant, CapSize } from '@/types/product';

const D = new Date().toISOString();
const img = () => `https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/accessories-bag`;

function cap(
    id: string, name: string, subcategory: ICapProduct['subcategory'],
    price: number, colors: ColorVariant[], sizes: CapSize[],
    stock = 20, featured = false,
): ICapProduct {
    return {
        _id: id, name,
        description: `Premium ${name.toLowerCase()} — crafted for everyday elegance.`,
        category: 'accessories', subcategory, type: 'accessory',
        price, images: [img()], featured, active: true,
        tags: [subcategory], stock, color: colors[0]?.name,
        colorVariants: colors, sizeVariants: sizes,
        createdAt: D, updatedAt: D,
    };
}

const WHITE  = { name: 'White',   hex: '#FFFFFF', stock: 15 };
const CREAM  = { name: 'Cream',   hex: '#F5F0E8', stock: 12 };
const BLACK  = { name: 'Black',   hex: '#1a1a1a', stock: 20 };
const NAVY   = { name: 'Navy',    hex: '#0f1035', stock: 10 };
const GREY   = { name: 'Grey',    hex: '#9ca3af', stock: 8  };
const BROWN  = { name: 'Brown',   hex: '#92400e', stock: 6  };
const OLIVE  = { name: 'Olive',   hex: '#4d5a2a', stock: 9  };
const BEIGE  = { name: 'Beige',   hex: '#d4b896', stock: 11 };
const GOLD   = { name: 'Gold',    hex: '#D4A853', stock: 7  };

export const KUFI_CAPS: ICapProduct[] = [
    cap('c1', 'Classic Kufi — Knit',    'kufi',    299,  [WHITE,CREAM,BLACK],    ['One-Size'],       30, true),
    cap('c2', 'Premium Kufi — Cotton',  'kufi',    399,  [WHITE,CREAM,GREY],     ['S','M','L'],      20),
    cap('c3', 'Embroidered Kufi',       'kufi',    549,  [WHITE,CREAM,GOLD],     ['One-Size'],       12),
    cap('c4', 'Crochet Kufi',           'kufi',    249,  [WHITE,BEIGE,BROWN],    ['One-Size'],       25),
];

export const PRAYER_CAPS: ICapProduct[] = [
    cap('c5', 'Simple Prayer Cap',      'prayer',  149,  [WHITE,CREAM],          ['One-Size'],       40),
    cap('c6', 'Embroidered Prayer Cap', 'prayer',  299,  [WHITE,CREAM,BEIGE],    ['S','M','L'],      18, true),
    cap('c7', 'Velvet Prayer Cap',      'prayer',  399,  [WHITE,NAVY,BLACK],     ['One-Size'],       10),
];

export const SNAPBACKS: ICapProduct[] = [
    cap('c8', 'Classic Snapback',       'snapback', 599,  [BLACK,NAVY,GREY],     ['One-Size'],       22),
    cap('c9', 'Premium Wool Snapback',  'snapback', 799,  [BLACK,OLIVE,GREY],    ['One-Size'],       14, true),
    cap('c10','Structured 6-Panel',     'snapback', 649,  [NAVY,BLACK,BROWN],    ['One-Size'],       18),
];

export const TAQIYAHS: ICapProduct[] = [
    cap('c11','Traditional Taqiyah',    'taqiyah',  349,  [WHITE,CREAM,BEIGE],  ['S','M','L'],      20),
    cap('c12','Brocade Taqiyah',        'taqiyah',  599,  [WHITE,GOLD,CREAM],   ['One-Size'],       10, true),
    cap('c13','Knit Taqiyah',           'taqiyah',  249,  [WHITE,GREY,NAVY],    ['S','M','L'],      28),
];

export const SUMMER_HATS: ICapProduct[] = [
    cap('c14','Straw Sun Hat',          'summer',   799,  [BEIGE,BROWN],         ['One-Size'],       15),
    cap('c15','Cotton Bucket Hat',      'summer',   499,  [NAVY,OLIVE,BLACK],    ['S','M','L'],      20, true),
    cap('c16','Linen Flat Cap',         'summer',   649,  [BEIGE,GREY,NAVY],     ['S','M','L'],      12),
];

export const ALL_CAPS: ICapProduct[] = [
    ...KUFI_CAPS, ...PRAYER_CAPS, ...SNAPBACKS, ...TAQIYAHS, ...SUMMER_HATS
];

export const ALL_CAP_COLORS = [
    WHITE, CREAM, BLACK, NAVY, GREY, BROWN, OLIVE, BEIGE, GOLD,
];
