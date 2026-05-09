// ============================================================================
// TYPES
// ============================================================================

export type ProductSummary = {
    _id: string;
    name: string;
    price: number;
    images: string[];
    productType: 'readymade' | 'fabric' | 'accessory';
    slug: string;
};

export type Testimonial = {
    id: string;
    customerName: string;
    garmentType: string;
    rating: number; // 1–5
    quote: string;
    avatarInitials: string;
};

export type CategoryCard = {
    id: string;
    name: string;
    href: string;
    // Cloudinary URL — in dev we use placeholder gradients
    imageUrl: string;
    gradient: string; // fallback gradient
};

// ============================================================================
// MOCK DATA — swap these functions for real Mongoose queries in production
// ============================================================================

export const HERO_BANNERS = [
    {
        id: 'summer-linen',
        title: 'New Collection',
        subtitle: 'Summer Linen — Light. Breathable. Timeless.',
        cta: 'Shop Now',
        ctaHref: '/fabrics',
        gradient: 'linear-gradient(135deg, #D4A853 0%, #b8860b 40%, #7a5c0f 100%)',
        textColor: '#fff',
        badge: 'NEW ARRIVAL',
    },
    {
        id: 'custom-stitching',
        title: 'Custom Stitching',
        subtitle: 'Your Measurements. Our Craft. Perfect Every Time.',
        cta: 'Get Stitched',
        ctaHref: '/stitching',
        gradient: 'linear-gradient(135deg, #2d1b69 0%, #11003b 60%, #0a001a 100%)',
        textColor: '#e2d9f3',
        badge: 'BESPOKE',
    },
    {
        id: 'readymade-kurtas',
        title: 'Readymade Kurtas',
        subtitle: 'Premium styles starting at just ₹499',
        cta: 'Explore',
        ctaHref: '/readymade',
        gradient: 'linear-gradient(135deg, #0f1035 0%, #1a237e 60%, #283593 100%)',
        textColor: '#D4A853',
        badge: 'FROM ₹499',
    },
] as const;

export const FEATURED_CATEGORIES: CategoryCard[] = [
    {
        id: 'kurta',
        name: 'Kurta',
        href: '/readymade?sub=kurta',
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/boy-snow-hoodie',
        gradient: 'linear-gradient(160deg, #D4A853aa 0%, #0f1035ee 100%)',
    },
    {
        id: 'thobe',
        name: 'Thobe',
        href: '/readymade?sub=thobe',
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man',
        gradient: 'linear-gradient(160deg, #b8860baa 0%, #0a001aee 100%)',
    },
    {
        id: 'kandoora',
        name: 'Kandoora',
        href: '/readymade?sub=kandoora',
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/bicycle',
        gradient: 'linear-gradient(160deg, #1a237eaa 0%, #0f1035ee 100%)',
    },
    {
        id: 'linen-fabric',
        name: 'Linen Fabric',
        href: '/fabrics?type=linen',
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/beach-boat',
        gradient: 'linear-gradient(160deg, #D4A853bb 0%, #7a5c0fee 100%)',
    },
    {
        id: 'perfumes',
        name: 'Perfumes',
        href: '/perfumes',
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/accessories-bag',
        gradient: 'linear-gradient(160deg, #6a1b9aaa 0%, #1a0030ee 100%)',
    },
    {
        id: 'caps',
        name: 'Caps',
        href: '/caps',
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/shoes',
        gradient: 'linear-gradient(160deg, #0f1035aa 0%, #D4A853ee 100%)',
    },
];

export const TRENDING_READYMADE: ProductSummary[] = [
    {
        _id: 'rm001',
        name: 'Classic White Thobe',
        price: 1299,
        images: ['https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man'],
        productType: 'readymade',
        slug: 'classic-white-thobe',
    },
    {
        _id: 'rm002',
        name: 'Premium Linen Kurta',
        price: 849,
        images: ['https://res.cloudinary.com/demo/image/upload/v1/samples/people/boy-snow-hoodie'],
        productType: 'readymade',
        slug: 'premium-linen-kurta',
    },
    {
        _id: 'rm003',
        name: 'Embroidered Kandoora',
        price: 2199,
        images: ['https://res.cloudinary.com/demo/image/upload/v1/samples/people/bicycle'],
        productType: 'readymade',
        slug: 'embroidered-kandoora',
    },
    {
        _id: 'rm004',
        name: 'Cotton Pathani Set',
        price: 699,
        images: ['https://res.cloudinary.com/demo/image/upload/v1/samples/people/jazz'],
        productType: 'readymade',
        slug: 'cotton-pathani-set',
    },
    {
        _id: 'rm005',
        name: 'Festive Sherwani',
        price: 3499,
        images: ['https://res.cloudinary.com/demo/image/upload/v1/samples/people/kitchen-bar'],
        productType: 'readymade',
        slug: 'festive-sherwani',
    },
];

export const PREMIUM_FABRICS: ProductSummary[] = [
    {
        _id: 'fb001',
        name: 'Egyptian Linen — Ivory',
        price: 340,
        images: ['https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/beach-boat'],
        productType: 'fabric',
        slug: 'egyptian-linen-ivory',
    },
    {
        _id: 'fb002',
        name: 'Pure Cotton — Slate Blue',
        price: 220,
        images: ['https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/nature-mountains'],
        productType: 'fabric',
        slug: 'pure-cotton-slate-blue',
    },
    {
        _id: 'fb003',
        name: 'Italian Wool Blend',
        price: 580,
        images: ['https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/road-safari'],
        productType: 'fabric',
        slug: 'italian-wool-blend',
    },
    {
        _id: 'fb004',
        name: 'Silk Dupion — Champagne',
        price: 760,
        images: ['https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/girl-urban-view'],
        productType: 'fabric',
        slug: 'silk-dupion-champagne',
    },
];

export const TESTIMONIALS: Testimonial[] = [
    {
        id: 't1',
        customerName: 'Mohammed Al-Rashid',
        garmentType: 'Custom Thobe',
        rating: 5,
        quote: 'The stitching quality is exceptional. My thobe fits perfectly — exactly what I wanted.',
        avatarInitials: 'MA',
    },
    {
        id: 't2',
        customerName: 'Farhan Siddiqui',
        garmentType: 'Linen Kurta',
        rating: 5,
        quote: 'Ordered 3 kurtas and every single one fits like it was made for me. Will order again!',
        avatarInitials: 'FS',
    },
    {
        id: 't3',
        customerName: 'Zara Noor',
        garmentType: 'Custom Dress',
        rating: 5,
        quote: 'Finally, custom tailoring on an app! The measurements guide made it so easy.',
        avatarInitials: 'ZN',
    },
];
