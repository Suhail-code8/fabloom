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
        slug: 'classic-white-thobe',
        description: 'Premium quality white thobe made from 100% Egyptian cotton. Perfect for daily prayers and special occasions.',
        category: 'mens',
        subcategory: 'thobe',
        type: 'readymade',
        price: 1499,
        images: ['/placeholder-product.jpg'],
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
        images: ['/placeholder-product.jpg'],
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
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['kandoora', 'embroidered', 'gold', 'luxury'],
        sizeStock: { S: 3, M: 7, L: 9, XL: 5, XXL: 2 },
        material: 'Premium Polyester Blend',
        color: 'Off White',
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
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['fabric', 'cotton', 'egyptian', 'premium'],
        stockInMeters: 500,
        pricePerMeter: 180,
        fabricType: 'Egyptian Cotton',
        width: 60,
        gsm: 200,
        texture: '/placeholder-product.jpg',
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
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['fabric', 'linen', 'summer', 'breathable'],
        stockInMeters: 300,
        pricePerMeter: 220,
        fabricType: 'Premium Linen',
        width: 58,
        gsm: 180,
        texture: '/placeholder-product.jpg',
        stitchingAvailable: true,
        stitchingPrice: 400,
        suitableFor: ['Kurta', 'Shirt', 'Thobe'],
    },
];

const ACCESSORY_PRODUCTS = [
    // --- Perfumes ---
    {
        name: 'Royal Oudh Attar',
        slug: 'royal-oudh-attar',
        description: 'Authentic Arabian oudh attar (perfume oil).',
        category: 'accessories',
        subcategory: 'arabian',
        type: 'accessory',
        price: 799,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['attar', 'perfume', 'oudh', 'fragrance', 'arabian'],
        stock: 50,
        material: 'Natural Oudh Oil',
        color: 'Amber',
    },
    {
        name: 'Jasmine Bloom Perfume',
        slug: 'jasmine-bloom-perfume',
        description: 'A light and elegant floral fragrance with strong jasmine notes.',
        category: 'accessories',
        subcategory: 'floral',
        type: 'accessory',
        price: 950,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['perfume', 'floral', 'jasmine', 'fragrance'],
        stock: 30,
        material: 'Perfume Extract',
        color: 'Clear',
    },
    {
        name: 'Citrus Fresh Cologne',
        slug: 'citrus-fresh-cologne',
        description: 'An energizing everyday citrus cologne.',
        category: 'accessories',
        subcategory: 'fresh',
        type: 'accessory',
        price: 850,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['cologne', 'citrus', 'fresh', 'fragrance'],
        stock: 45,
        material: 'Eau de Cologne',
        color: 'Clear',
    },
    // --- Caps ---
    {
        name: 'Traditional Prayer Cap',
        slug: 'traditional-prayer-cap',
        description: 'Handcrafted prayer cap (kufi) with intricate embroidery.',
        category: 'accessories',
        subcategory: 'kufi',
        type: 'accessory',
        price: 199,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['cap', 'kufi', 'prayer', 'embroidered'],
        stock: 100,
        material: 'Cotton',
        color: 'White',
    },
    {
        name: 'Classic White Taqiyah',
        slug: 'classic-white-taqiyah',
        description: 'A simple and comfortable classic skullcap.',
        category: 'accessories',
        subcategory: 'taqiyah',
        type: 'accessory',
        price: 150,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['cap', 'taqiyah', 'prayer', 'white'],
        stock: 120,
        material: 'Cotton Blend',
        color: 'White',
    },
    {
        name: 'Premium Wool Kufi',
        slug: 'premium-wool-kufi',
        description: 'Warm and comfortable wool kufi cap, perfect for colder seasons.',
        category: 'accessories',
        subcategory: 'kufi',
        type: 'accessory',
        price: 350,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['cap', 'kufi', 'wool', 'premium'],
        stock: 60,
        material: 'Wool',
        color: 'Black',
    },
    // --- Other Accessories ---
    {
        name: 'Leather Sandal',
        slug: 'leather-sandal',
        description: 'Traditional handcrafted leather sandals for everyday wear.',
        category: 'accessories',
        subcategory: 'footwear',
        type: 'accessory',
        price: 1299,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['sandal', 'leather', 'footwear'],
        stock: 40,
        material: 'Genuine Leather',
        color: 'Brown',
    },
    {
        name: 'Misbaha Prayer Beads',
        slug: 'misbaha-prayer-beads',
        description: 'Elegant 99-bead misbaha made from natural polished wood.',
        category: 'accessories',
        subcategory: 'prayer-beads',
        type: 'accessory',
        price: 450,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['misbaha', 'beads', 'prayer', 'wood'],
        stock: 80,
        material: 'Wood',
        color: 'Dark Brown',
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
