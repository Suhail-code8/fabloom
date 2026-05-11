import dotenv from 'dotenv';
import { resolve } from 'path';

// CRITICAL: Load environment variables FIRST before any other imports
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

// Verify MONGODB_URI is loaded
if (!process.env.MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI not found in environment variables');
    console.error('Please check that .env.local exists and contains MONGODB_URI');
    process.exit(1);
}

// Now import database modules after env vars are loaded
import mongoose from 'mongoose';
import { ReadymadeProduct, FabricProduct, AccessoryProduct } from '../models/Product';

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}

const READYMADE_PRODUCTS = [
    {
        name: 'Classic White Thobe',
        slug: slugify('Classic White Thobe'),
        description: 'Premium quality white thobe made from 100% Egyptian cotton. Perfect for daily prayers and special occasions. Features traditional design with modern comfort.',
        category: 'mens',
        subcategory: 'thobe',
        type: 'readymade',
        price: 1499,
        images: [
            'https://images.unsplash.com/photo-1594938298603-c8148c4b4f5e?w=600&q=80',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
        ],
        featured: true,
        active: true,
        tags: ['thobe', 'white', 'cotton', 'mens', 'classic'],
        sizeStock: { S: 10, M: 15, L: 12, XL: 8, XXL: 5 },
        material: 'Egyptian Cotton',
        color: 'White',
    },
    {
        name: 'Navy Blue Kurta',
        slug: slugify('Navy Blue Kurta'),
        description: 'Elegant navy blue kurta with embroidered collar. Made from premium cotton blend for comfort and style. Perfect for Eid and festive occasions.',
        category: 'mens',
        subcategory: 'kurta',
        type: 'readymade',
        price: 899,
        images: [
            'https://images.unsplash.com/photo-1564518450819-cd07e90c2991?w=600&q=80',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
        ],
        featured: true,
        active: true,
        tags: ['kurta', 'navy', 'mens', 'embroidered'],
        sizeStock: { S: 5, M: 8, L: 10, XL: 6, XXL: 3 },
        material: 'Cotton Blend',
        color: 'Navy Blue',
    },
    {
        name: 'Embroidered Kandoora',
        slug: slugify('Embroidered Kandoora'),
        description: 'Luxurious kandoora with hand-embroidered borders in gold thread. Finest quality fabric sourced from UAE suppliers.',
        category: 'mens',
        subcategory: 'kandoora',
        type: 'readymade',
        price: 2199,
        images: [
            'https://images.unsplash.com/photo-1583394293214-9e9d10f4b668?w=600&q=80',
        ],
        featured: true,
        active: true,
        tags: ['kandoora', 'embroidered', 'gold', 'luxury'],
        sizeStock: { S: 3, M: 7, L: 9, XL: 5, XXL: 2 },
        material: 'Premium Polyester Blend',
        color: 'Off White',
    },
    {
        name: 'Cotton Pathani Set',
        slug: slugify('Cotton Pathani Set'),
        description: 'Classic Pathani suit set in breathable cotton. Includes matching kurta and salwar. Ideal for casual and semi-formal occasions.',
        category: 'mens',
        subcategory: 'kurta',
        type: 'readymade',
        price: 699,
        images: [
            'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&q=80',
        ],
        featured: false,
        active: true,
        tags: ['pathani', 'cotton', 'set', 'casual'],
        sizeStock: { S: 6, M: 10, L: 8, XL: 4, XXL: 2 },
        material: 'Pure Cotton',
        color: 'Beige',
    },
    {
        name: 'Linen Shirt',
        slug: slugify('Linen Shirt'),
        description: 'Modern slim-fit linen shirt with a clean, minimalist aesthetic. Perfect for summer or semi-formal occasions.',
        category: 'mens',
        subcategory: 'shirt',
        type: 'readymade',
        price: 549,
        images: [
            'https://images.unsplash.com/photo-1602810319250-a663f0af2f75?w=600&q=80',
        ],
        featured: false,
        active: true,
        tags: ['shirt', 'linen', 'summer', 'slim-fit'],
        sizeStock: { S: 8, M: 12, L: 10, XL: 6, XXL: 3 },
        material: 'Pure Linen',
        color: 'White',
    },
];

const FABRIC_PRODUCTS = [
    {
        name: 'Egyptian Cotton Fabric',
        slug: slugify('Egyptian Cotton Fabric'),
        description: 'Premium Egyptian cotton fabric, perfect for custom stitching. Soft, breathable, and durable. Ideal for thobes, kurtas, and traditional Islamic garments.',
        category: 'mens',
        subcategory: 'cotton',
        type: 'fabric',
        price: 180,
        images: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        ],
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
        slug: slugify('Premium Linen Fabric'),
        description: 'High-quality linen fabric, breathable and perfect for summer wear. Ideal for custom thobes and kurtas. Available in natural ivory color.',
        category: 'mens',
        subcategory: 'linen',
        type: 'fabric',
        price: 220,
        images: [
            'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
        ],
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
        slug: slugify('Silk Dupion Fabric'),
        description: 'Luxurious silk dupion with natural sheen. Perfect for sherwani and festive garments. Lightweight yet richly textured.',
        category: 'mens',
        subcategory: 'silk',
        type: 'fabric',
        price: 650,
        images: [
            'https://images.unsplash.com/photo-1615529162924-f8605388461d?w=600&q=80',
        ],
        featured: false,
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
        slug: slugify('Royal Oudh Attar'),
        description: 'Authentic Arabian oudh attar (perfume oil) with rich, woody fragrance. Long-lasting and alcohol-free. Perfect for daily use and special occasions. Comes in an elegant 12ml bottle.',
        category: 'accessories',
        subcategory: 'arabian',
        type: 'accessory',
        price: 799,
        images: [
            'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80',
        ],
        featured: true,
        active: true,
        tags: ['attar', 'perfume', 'oudh', 'fragrance', 'arabian'],
        stock: 50,
        material: 'Natural Oudh Oil',
        color: 'Amber',
    },
    {
        name: 'Traditional Prayer Cap',
        slug: slugify('Traditional Prayer Cap'),
        description: 'Handcrafted prayer cap (kufi) with intricate embroidery. Comfortable fit for daily prayers. Made from breathable cotton.',
        category: 'accessories',
        subcategory: 'kufi',
        type: 'accessory',
        price: 199,
        images: [
            'https://images.unsplash.com/photo-1615886753866-79396abc446a?w=600&q=80',
        ],
        featured: true,
        active: true,
        tags: ['cap', 'kufi', 'prayer', 'embroidered'],
        stock: 100,
        material: 'Cotton',
        color: 'White',
    },
    {
        name: 'Rose Oud Perfume',
        slug: slugify('Rose Oud Perfume'),
        description: 'A harmonious blend of Bulgarian rose and Cambodian oud. An elegant fragrance for those who appreciate the finer things in life.',
        category: 'accessories',
        subcategory: 'arabian',
        type: 'accessory',
        price: 1299,
        images: [
            'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80',
        ],
        featured: false,
        active: true,
        tags: ['perfume', 'rose', 'oud', 'fragrance', 'floral'],
        stock: 30,
        material: 'Natural Fragrance',
        color: 'Gold',
    },
    {
        name: 'Embroidered Kufi Cap',
        slug: slugify('Embroidered Kufi Cap'),
        description: 'Premium kufi cap with intricate geometric embroidery. Made from fine cotton with excellent craftsmanship.',
        category: 'accessories',
        subcategory: 'kufi',
        type: 'accessory',
        price: 349,
        images: [
            'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80',
        ],
        featured: false,
        active: true,
        tags: ['cap', 'kufi', 'embroidered', 'prayer'],
        stock: 80,
        material: 'Fine Cotton',
        color: 'Cream',
    },
    {
        name: 'Classic Leather Belt',
        slug: slugify('Classic Leather Belt'),
        description: 'Premium genuine leather belt with a minimalist buckle. Perfect for formal and casual wear.',
        category: 'accessories',
        subcategory: 'belt',
        type: 'accessory',
        price: 899,
        images: [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
        ],
        featured: true,
        active: true,
        tags: ['belt', 'leather', 'accessories', 'mens'],
        stock: 50,
        material: 'Genuine Leather',
        color: 'Black',
    },
];

async function seed() {
    try {
        console.log('🌱 Starting database seed...');
        console.log('📍 Connecting to MongoDB Atlas...');

        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ Connected to MongoDB');

        // Clear existing products
        await ReadymadeProduct.deleteMany({});
        await FabricProduct.deleteMany({});
        await AccessoryProduct.deleteMany({});
        console.log('🗑️  Cleared existing products');

        // Create all readymade products
        for (const p of READYMADE_PRODUCTS) {
            await ReadymadeProduct.create(p);
            console.log(`✅ Created Readymade: ${p.name} @ ₹${p.price}`);
        }

        // Create all fabric products
        for (const p of FABRIC_PRODUCTS) {
            await FabricProduct.create(p);
            console.log(`✅ Created Fabric: ${p.name} @ ₹${p.pricePerMeter}/m`);
        }

        // Create all accessory products
        for (const p of ACCESSORY_PRODUCTS) {
            await AccessoryProduct.create(p);
            console.log(`✅ Created Accessory: ${p.name} @ ₹${p.price}`);
        }

        const total = READYMADE_PRODUCTS.length + FABRIC_PRODUCTS.length + ACCESSORY_PRODUCTS.length;
        console.log(`\n🎉 Database seeded successfully!`);
        console.log(`📊 Total products created: ${total}`);
        console.log(`   - Readymade: ${READYMADE_PRODUCTS.length}`);
        console.log(`   - Fabric: ${FABRIC_PRODUCTS.length}`);
        console.log(`   - Accessory: ${ACCESSORY_PRODUCTS.length}`);
        console.log('\n✨ All products have correct slugs and realistic prices.');

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error seeding database:', error);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
}

seed();
