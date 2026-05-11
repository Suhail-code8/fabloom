import type { IPerfumeProduct } from '@/types/product';

const D = new Date().toISOString();
const img = (s: string) => `https://res.cloudinary.com/demo/image/upload/v1/samples/${s}`;

function perf(
    id: string, name: string, subcategory: IPerfumeProduct['subcategory'],
    price: number, volume: number, gender: IPerfumeProduct['gender'],
    top: string[], heart: string[], base: string[],
    concentration = 'EDP', stock = 20, featured = false,
): IPerfumeProduct {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return {
        _id: id, name, slug,
        description: `${name} — a captivating ${subcategory} fragrance.`,
        category: 'accessories', subcategory, type: 'accessory',
        price, images: [img('ecommerce/accessories-bag')],
        featured, active: true, tags: [subcategory, gender.toLowerCase()],
        stock, material: 'Glass',
        fragranceNotes: { top, heart, base },
        volume, gender, concentration,
        createdAt: D, updatedAt: D,
    };
}

export const ARABIAN_OUD: IPerfumeProduct[] = [
    perf('p1','Royal Oud Noir',     'arabian', 2499, 100,'Men',   ['Saffron','Cardamom'],['Oud','Rose'],['Ambergris','Musk'],      'Attar', 15, true),
    perf('p2','Oud Al Emarat',      'arabian', 1899, 50, 'Unisex',['Bergamot','Pepper'], ['Oud','Patchouli'],['Sandalwood','Vetiver'],'EDP',  20),
    perf('p3','Bakhoor Intense',    'arabian', 3299, 100,'Men',   ['Incense','Smoke'],   ['Oud','Agarwood'], ['Musk','Amber'],       'Attar', 8, true),
    perf('p4','Arabian Nights',     'arabian', 1599, 50, 'Women', ['Jasmine','Saffron'], ['Rose','Oud'],     ['Vanilla','Amber'],    'EDP',  18),
];

export const FLORAL_PERFUMES: IPerfumeProduct[] = [
    perf('p5','Rose Garden',        'floral',  1199, 50, 'Women', ['Peach','Citrus'],    ['Rose','Peony'],   ['Musk','Cedarwood'],   'EDT',  25),
    perf('p6','Jasmine Bloom',      'floral',  1399, 75, 'Women', ['Bergamot','Green'],  ['Jasmine','Lily'], ['Sandalwood','Musk'],  'EDP',  18),
    perf('p7','White Floral',       'floral',  1699, 100,'Unisex',['Neroli','Lemon'],    ['Tuberose','Iris'],['Amber','Vetiver'],    'EDP',  12, true),
];

export const FRESH_PERFUMES: IPerfumeProduct[] = [
    perf('p8','Ocean Breeze',       'fresh',   899,  50, 'Men',   ['Lemon','Grapefruit'],['Aqua','Lavender'],['Cedar','Musk'],      'EDT',  30),
    perf('p9','Citrus Burst',       'fresh',   999,  75, 'Unisex',['Bergamot','Orange'], ['Green Tea','Mint'],['Vetiver','Musk'],   'EDT',  22),
    perf('p10','Morning Dew',       'fresh',   1099, 50, 'Women', ['Cucumber','Melon'],  ['Freesia','Violet'],['Musk','Cedar'],     'EDP',  16),
];

export const WOODY_PERFUMES: IPerfumeProduct[] = [
    perf('p11','Dark Forest',       'woody',   1599, 100,'Men',   ['Black Pepper','Ginger'],['Patchouli','Cedar'],['Vetiver','Oud'],'EDP', 14, true),
    perf('p12','Sandalwood Dreams', 'woody',   1299, 50, 'Unisex',['Bergamot','Nutmeg'], ['Sandalwood','Iris'],['Musk','Amber'],   'EDP',  20),
    perf('p13','Musk & Cedar',      'woody',   1199, 75, 'Men',   ['Lemon','Basil'],     ['Cedar','Rosemary'],['Musk','Moss'],     'EDT',  18),
];

export const GIFT_SETS: IPerfumeProduct[] = [
    perf('p14','Royal Gift Set',    'gift-set',3999, 50, 'Unisex',['Saffron','Rose'],    ['Oud','Sandalwood'],['Amber','Musk'],    'EDP',  10, true),
    perf('p15','Duo Floral Set',    'gift-set',2499, 50, 'Women', ['Peach','Bergamot'],  ['Rose','Jasmine'],  ['Musk','Vanilla'],  'EDT',  12),
];

export const ALL_PERFUMES: IPerfumeProduct[] = [
    ...ARABIAN_OUD, ...FLORAL_PERFUMES, ...FRESH_PERFUMES, ...WOODY_PERFUMES, ...GIFT_SETS
];
