import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product, ReadymadeProduct, FabricProduct, AccessoryProduct } from '@/models/Product';

// ============================================================================
// SEED API — POST /api/seed
// Protected by secret key. Call this from the Vercel environment to seed the
// production database that Vercel is actually connected to.
//
// Usage: curl -X POST https://fablooom.vercel.app/api/seed \
//   -H "x-seed-secret: fabloom_seed_2026"
// ============================================================================

const SEED_SECRET = process.env.SEED_SECRET || 'fabloom_seed_2026';

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}

const READYMADE_PRODUCTS = [
    {
        name: 'Classic White Thobe',
        slug: 'classic-white-thobe',
        description: 'Premium quality white thobe made from 100% Egyptian cotton. Perfect for daily prayers and special occasions.',
        category: 'mens',
        subcategory: 'thobe',
        type: 'readymade',
        price: 1499,
        images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b4f5e?w=600&q=80'],
        featured: true,
        active: true,
        tags: ['thobe', 'white', 'cotton', 'mens', 'classic'],
        sizeStock: { S: 10, M: 15, L: 12, XL: 8, XXL: 5 },
        material: 'Egyptian Cotton',
        color: 'White',
    },
    {
        name: 'Navy Blue Kurta',
        slug: 'navy-blue-kurta',
        description: 'Elegant navy blue kurta with embroidered collar. Made from premium cotton blend.',
        category: 'mens',
        subcategory: 'kurta',
        type: 'readymade',
        price: 899,
        images: ['https://images.unsplash.com/photo-1564518450819-cd07e90c2991?w=600&q=80'],
        featured: true,
        active: true,
        tags: ['kurta', 'navy', 'mens', 'embroidered'],
        sizeStock: { S: 5, M: 8, L: 10, XL: 6, XXL: 3 },
        material: 'Cotton Blend',
        color: 'Navy Blue',
    },
    {
        name: 'Embroidered Kandoora',
        slug: 'embroidered-kandoora',
        description: 'Luxurious kandoora with hand-embroidered borders. Finest quality fabric.',
        category: 'mens',
        subcategory: 'kandoora',
        type: 'readymade',
        price: 2199,
        images: ['https://images.unsplash.com/photo-1583394293214-9e9d10f4b668?w=600&q=80'],
        featured: true,
        active: true,
        tags: ['kandoora', 'embroidered', 'gold', 'luxury'],
        sizeStock: { S: 3, M: 7, L: 9, XL: 5, XXL: 2 },
        material: 'Premium Polyester Blend',
        color: 'Off White',
    },
    {
        name: 'Cotton Pathani Set',
        slug: 'cotton-pathani-set',
        description: 'Classic Pathani suit set in breathable cotton. Includes matching kurta and salwar.',
        category: 'mens',
        subcategory: 'kurta',
        type: 'readymade',
        price: 699,
        images: ['https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&q=80'],
        featured: true,
        active: true,
        tags: ['pathani', 'cotton', 'set', 'casual'],
        sizeStock: { S: 6, M: 10, L: 8, XL: 4, XXL: 2 },
        material: 'Pure Cotton',
        color: 'Beige',
    },
    {
        name: 'Premium Silk Kurta',
        slug: 'premium-silk-kurta',
        description: 'Luxurious silk kurta for festive occasions. Lightweight and elegant.',
        category: 'mens',
        subcategory: 'kurta',
        type: 'readymade',
        price: 1899,
        images: ['https://images.unsplash.com/photo-1602810319250-a663f0af2f75?w=600&q=80'],
        featured: true,
        active: true,
        tags: ['kurta', 'silk', 'festive', 'luxury'],
        sizeStock: { S: 4, M: 6, L: 5, XL: 3, XXL: 1 },
        material: 'Pure Silk',
        color: 'Ivory',
    },
];

const FABRIC_PRODUCTS = [
    {
        name: 'Egyptian Cotton Fabric',
        slug: 'egyptian-cotton-fabric',
        description: 'Premium Egyptian cotton fabric, perfect for custom stitching.',
        category: 'mens',
        subcategory: 'cotton',
        type: 'fabric',
        price: 180,
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],
        featured: true,
        active: true,
        tags: ['fabric', 'cotton', 'egyptian', 'premium'],
        stockInMeters: 500,
        pricePerMeter: 180,
        fabricType: 'Egyptian Cotton',
        width: 60,
        gsm: 200,
        texture: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        stitchingAvailable: true,
        stitchingPrice: 350,
        suitableFor: ['Thobe', 'Kurta', 'Kandoora'],
    },
    {
        name: 'Premium Linen Fabric',
        slug: 'premium-linen-fabric',
        description: 'High-quality linen fabric, breathable and perfect for summer wear.',
        category: 'mens',
        subcategory: 'linen',
        type: 'fabric',
        price: 220,
        images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80'],
        featured: true,
        active: true,
        tags: ['fabric', 'linen', 'summer', 'breathable'],
        stockInMeters: 300,
        pricePerMeter: 220,
        fabricType: 'Premium Linen',
        width: 58,
        gsm: 180,
        texture: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
        stitchingAvailable: true,
        stitchingPrice: 400,
        suitableFor: ['Kurta', 'Shirt', 'Thobe'],
    },
    {
        name: 'Silk Dupion Fabric',
        slug: 'silk-dupion-fabric',
        description: 'Luxurious silk dupion with natural sheen. Perfect for sherwani and festive garments.',
        category: 'mens',
        subcategory: 'silk',
        type: 'fabric',
        price: 650,
        images: ['https://images.unsplash.com/photo-1615529162924-f8605388461d?w=600&q=80'],
        featured: true,
        active: true,
        tags: ['fabric', 'silk', 'luxury', 'festive'],
        stockInMeters: 100,
        pricePerMeter: 650,
        fabricType: 'Silk Dupion',
        width: 44,
        gsm: 120,
        texture: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?w=600&q=80',
        stitchingAvailable: true,
        stitchingPrice: 600,
        suitableFor: ['Sherwani', 'Kurta'],
    },
];

const ACCESSORY_PRODUCTS = [
    {
        name: 'Royal Oudh Attar',
        slug: 'royal-oudh-attar',
        description: 'Authentic Arabian oudh attar (perfume oil) with rich, woody fragrance.',
        category: 'accessories',
        subcategory: 'arabian',
        type: 'accessory',
        price: 799,
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80'],
        featured: true,
        active: true,
        tags: ['attar', 'perfume', 'oudh', 'fragrance', 'arabian'],
        stock: 50,
        material: 'Natural Oudh Oil',
        color: 'Amber',
    },
    {
        name: 'Traditional Prayer Cap',
        slug: 'traditional-prayer-cap',
        description: 'Handcrafted prayer cap (kufi) with intricate embroidery.',
        category: 'accessories',
        subcategory: 'kufi',
        type: 'accessory',
        price: 199,
        images: ['https://images.unsplash.com/photo-1615886753866-79396abc446a?w=600&q=80'],
        featured: true,
        active: true,
        tags: ['cap', 'kufi', 'prayer', 'embroidered'],
        stock: 100,
        material: 'Cotton',
        color: 'White',
    },
];

export async function POST(request: Request) {
    try {
        const secret = request.headers.get('x-seed-secret');
        if (secret !== SEED_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Clear existing products
        await Product.deleteMany({});

        const results: string[] = [];

        // Insert readymade products
        for (const p of READYMADE_PRODUCTS) {
            await ReadymadeProduct.create(p);
            results.push(`✅ Readymade: ${p.name} @ ₹${p.price}`);
        }

        // Insert fabric products
        for (const p of FABRIC_PRODUCTS) {
            await FabricProduct.create(p);
            results.push(`✅ Fabric: ${p.name} @ ₹${p.price}/m`);
        }

        // Insert accessory products
        for (const p of ACCESSORY_PRODUCTS) {
            await AccessoryProduct.create(p);
            results.push(`✅ Accessory: ${p.name} @ ₹${p.price}`);
        }

        return NextResponse.json({
            success: true,
            message: '🎉 Production database seeded successfully!',
            mongoUri: process.env.MONGODB_URI?.replace(/:([^@]+)@/, ':***@'), // mask password
            productsCreated: results.length,
            details: results,
        });
    } catch (error: any) {
        console.error('Seed API error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}

// Also allow GET to check what DB is connected
export async function GET(request: Request) {
    const secret = request.headers.get('x-seed-secret');
    if (secret !== SEED_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { Product } = await import('@/models/Product');
        const products = await Product.find({ active: true }).limit(5).lean();
        
        return NextResponse.json({
            connected: true,
            mongoUri: process.env.MONGODB_URI?.replace(/:([^@]+)@/, ':***@'),
            productCount: products.length,
            sample: products.map((p: any) => ({
                name: p.name,
                price: p.price,
                slug: p.slug,
                type: p.type,
            })),
        });
    } catch (error: any) {
        return NextResponse.json({ connected: false, error: error.message }, { status: 500 });
    }
}
