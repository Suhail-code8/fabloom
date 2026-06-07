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
        id: 'premium-kandoras',
        title: 'Premium Kandoras · Delivered to Your Door',
        subtitle: 'Saudi, Emirati, Chinese styles & more',
        cta: 'Shop Now',
        ctaHref: '/readymade',
        gradient: 'linear-gradient(135deg, rgba(10,11,16,0.85) 0%, rgba(26,21,40,0.9) 100%)',
        textColor: '#fff',
        badge: 'BEST SELLER',
        imageUrl: '/hero-kandoras.png',
    },
    {
        id: 'fabric-stitching',
        title: 'Buy Fabric · Get It Stitched',
        subtitle: 'Choose from our premium fabrics and add expert stitching to your order',
        cta: 'Browse Fabrics',
        ctaHref: '/fabrics',
        gradient: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
        textColor: '#fff',
        badge: 'PREMIUM SERVICE',
        imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
    },
    {
        id: 'koduvally-fashion',
        title: 'Authentic Islamic Fashion · From Koduvally',
        subtitle: 'Trusted by customers across India',
        cta: 'View Collection',
        ctaHref: '/readymade',
        gradient: 'linear-gradient(135deg, rgba(5,11,20,0.85) 0%, rgba(10,17,40,0.9) 100%)',
        textColor: '#D4A853',
        badge: 'KODUVALY ORIGIN',
        imageUrl: '/hero-koduvally.png',
    },
] as const;

export const FEATURED_CATEGORIES: CategoryCard[] = [
    {
        id: 'kurta',
        name: 'Kurta',
        href: '/readymade?sub=kurta',
        imageUrl: 'https://t3.ftcdn.net/jpg/18/49/14/48/360_F_1849144859_1Sf3ntpklK4dhJswxQS7idggb96rOUqH.jpg',
        gradient: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))',
    },
    {
        id: 'thobe',
        name: 'Thobe',
        href: '/readymade?sub=thobe',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6DGI_BC44tUrGYa2ptrLjSXbAUj-gRroiMQ&s',
        gradient: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))',
    },
    {
        id: 'stitching',
        name: 'Stitching',
        href: '/stitching',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtbhScpz4Fbw7NiH1VrcoI5bZpr8wrhYUExw&s',
        gradient: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))',
    },
    {
        id: 'fabrics',
        name: 'Fabrics',
        href: '/fabrics',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0edLImvDMPsdLzkjGGVguHDxIn87iOjQIIQ&s',
        gradient: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))',
    },
    {
        id: 'perfumes',
        name: 'Perfumes',
        href: '/perfumes',
        imageUrl: 'https://png.pngtree.com/thumb_back/fh260/background/20241018/pngtree-eau-de-parfum-hd-8k-wallpaper-stock-photographic-image-image_16359989.jpg',
        gradient: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))',
    },
    {
        id: 'caps',
        name: 'Caps',
        href: '/caps',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw0DARVSMPfXb6iy1NFoIskh-tXACAsw5Z3A&s',
        gradient: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))',
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
