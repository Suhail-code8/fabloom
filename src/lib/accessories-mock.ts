import type { IAccessoryProduct } from '@/types/product';

// "New" = created within last 30 days
const NOW      = new Date();
const RECENT   = new Date(NOW.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(); // 10d ago
const OLD      = new Date(NOW.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(); // 60d ago
const img = (s: string) => `https://res.cloudinary.com/demo/image/upload/v1/samples/${s}`;

function acc(
    id: string, name: string, subcategory: string,
    price: number, color: string, isNew: boolean,
    imgSlug: string, stock = 25, featured = false,
): IAccessoryProduct {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return {
        _id: id, name, slug,
        description: `${name} — premium quality accessory.`,
        category: 'accessories', subcategory, type: 'accessory',
        price, images: [img(imgSlug)],
        featured, active: true, tags: [subcategory, color.toLowerCase()],
        stock, color, material: 'Mixed',
        createdAt: isNew ? RECENT : OLD,
        updatedAt: isNew ? RECENT : OLD,
    };
}

export const HIJABS: IAccessoryProduct[] = [
    acc('a1',  'Chiffon Hijab — Pearl',    'hijab', 299,  'Pearl',  true,  'ecommerce/accessories-bag', 30, true),
    acc('a2',  'Jersey Hijab — Black',     'hijab', 249,  'Black',  false, 'ecommerce/accessories-bag', 40),
    acc('a3',  'Satin Hijab — Champagne',  'hijab', 399,  'Champagne',true,'ecommerce/accessories-bag', 18),
    acc('a4',  'Cotton Hijab — Navy',      'hijab', 199,  'Navy',   false, 'ecommerce/accessories-bag', 35),
    acc('a5',  'Premium Silk Scarf',       'hijab', 899,  'Ivory',  true,  'ecommerce/accessories-bag', 10),
];

export const BELTS: IAccessoryProduct[] = [
    acc('a6',  'Classic Leather Belt',     'belt',  699,  'Black',  false, 'ecommerce/shoes',           20),
    acc('a7',  'Brown Braided Belt',       'belt',  599,  'Brown',  true,  'ecommerce/shoes',           15),
    acc('a8',  'Canvas Casual Belt',       'belt',  349,  'Navy',   false, 'ecommerce/shoes',           25),
];

export const SOCKS: IAccessoryProduct[] = [
    acc('a9',  'Bamboo Socks — Pack of 3', 'socks', 299,  'White',  true,  'ecommerce/accessories-bag', 50),
    acc('a10', 'Ankle Socks — Black',      'socks', 199,  'Black',  false, 'ecommerce/accessories-bag', 60),
    acc('a11', 'Premium Cotton Crew',      'socks', 249,  'Grey',   true,  'ecommerce/accessories-bag', 40),
    acc('a12', 'No-Show Socks — Beige',    'socks', 149,  'Beige',  false, 'ecommerce/accessories-bag', 55),
];

export const WALLETS: IAccessoryProduct[] = [
    acc('a13', 'Slim Leather Wallet',      'wallet', 1199,'Black',  true,  'ecommerce/accessories-bag', 12, true),
    acc('a14', 'Bifold — Dark Brown',      'wallet', 899, 'Brown',  false, 'ecommerce/accessories-bag', 18),
    acc('a15', 'Card Holder — Black',      'wallet', 649, 'Black',  true,  'ecommerce/accessories-bag', 20),
];

export const WATCHES: IAccessoryProduct[] = [
    acc('a16', 'Classic Dial — Silver',   'watch', 2999, 'Silver', true,  'ecommerce/accessories-bag', 8, true),
    acc('a17', 'Minimalist — All Black',  'watch', 2499, 'Black',  false, 'ecommerce/accessories-bag', 10),
    acc('a18', 'Leather Strap — Brown',   'watch', 3499, 'Brown',  true,  'ecommerce/accessories-bag', 6),
];

export const POCKET_SQUARES: IAccessoryProduct[] = [
    acc('a19', 'Silk Pocket Square — Ivory',  'pocket-square', 349, 'Ivory', true,  'ecommerce/accessories-bag', 20),
    acc('a20', 'Cotton — Navy Check',         'pocket-square', 249, 'Navy',  false, 'ecommerce/accessories-bag', 25),
    acc('a21', 'Embroidered — White',         'pocket-square', 399, 'White', true,  'ecommerce/accessories-bag', 15),
];

export const ALL_ACCESSORIES: IAccessoryProduct[] = [
    ...HIJABS, ...BELTS, ...SOCKS, ...WALLETS, ...WATCHES, ...POCKET_SQUARES,
];
