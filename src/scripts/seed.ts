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
    {
        name: 'Emerald Green Kurta',
        slug: 'emerald-green-kurta',
        description: 'Regal emerald green kurta with subtle tonal weave. Comfortable fit for daily prayers and gatherings.',
        category: 'mens',
        subcategory: 'kurta',
        type: 'readymade',
        price: 1199,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['kurta', 'emerald', 'mens', 'cotton', 'premium'],
        sizeStock: { S: 4, M: 7, L: 10, XL: 6, XXL: 3 },
        material: 'Premium Cotton',
        color: 'Emerald Green',
    },
    {
        name: 'Stone Grey Kurta',
        slug: 'stone-grey-kurta',
        description: 'Stone grey kurta with a clean finish and breathable feel. A versatile piece for everyday wear.',
        category: 'mens',
        subcategory: 'kurta',
        type: 'readymade',
        price: 999,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['kurta', 'grey', 'mens', 'cotton-blend', 'classic'],
        sizeStock: { S: 6, M: 9, L: 8, XL: 5, XXL: 2 },
        material: 'Cotton Blend',
        color: 'Stone Grey',
    },
    {
        name: 'Royal Teal Kandoora',
        slug: 'royal-teal-kandoora',
        description: 'Royal teal kandoora with elegant detailing on the borders. Designed for a refined traditional look.',
        category: 'mens',
        subcategory: 'kandoora',
        type: 'readymade',
        price: 2499,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['kandoora', 'teal', 'mens', 'embroidered', 'royal'],
        sizeStock: { S: 2, M: 5, L: 6, XL: 4, XXL: 1 },
        material: 'Silk Blend',
        color: 'Royal Teal',
    },
    {
        name: 'Sky Blue Linen Shirt',
        slug: 'sky-blue-linen-shirt',
        description: 'Light sky blue linen shirt with crisp structure and breathable comfort for warm days.',
        category: 'mens',
        subcategory: 'shirt',
        type: 'readymade',
        price: 1299,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['shirt', 'linen', 'blue', 'mens', 'summer'],
        sizeStock: { S: 5, M: 8, L: 9, XL: 6, XXL: 2 },
        material: 'Linen',
        color: 'Sky Blue',
    },
    {
        name: 'Charcoal Straight Pant',
        slug: 'charcoal-straight-pant',
        description: 'Charcoal straight pant with a tailored silhouette and all-day comfort. Easy to style and durable.',
        category: 'mens',
        subcategory: 'pants',
        type: 'readymade',
        price: 1099,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['pants', 'charcoal', 'mens', 'cotton-blend', 'tailored'],
        sizeStock: { S: 4, M: 7, L: 8, XL: 5, XXL: 2 },
        material: 'Cotton Blend',
        color: 'Charcoal',
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
    {
        name: 'Royal Silk Fabric',
        slug: 'royal-silk-fabric',
        description: 'Premium royal silk fabric with a lustrous finish. Perfect for festive kurta and kandoora styles.',
        category: 'mens',
        subcategory: 'silk',
        type: 'fabric',
        price: 520,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['fabric', 'silk', 'royal', 'festive', 'premium'],
        stockInMeters: 180,
        pricePerMeter: 520,
        fabricType: 'Raw Silk',
        width: 56,
        gsm: 220,
        texture: '/placeholder-product.jpg',
        stitchingAvailable: true,
        stitchingPrice: 850,
        suitableFor: ['Kurta', 'Kandoora', 'Thobe'],
    },
    {
        name: 'Cotton Blend Fabric',
        slug: 'cotton-blend-fabric',
        description: 'Comfort-first cotton blend fabric that drapes beautifully and feels breathable throughout the day.',
        category: 'mens',
        subcategory: 'cotton',
        type: 'fabric',
        price: 200,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['fabric', 'cotton-blend', 'everyday', 'breathable'],
        stockInMeters: 260,
        pricePerMeter: 200,
        fabricType: 'Cotton Blend',
        width: 60,
        gsm: 190,
        texture: '/placeholder-product.jpg',
        stitchingAvailable: true,
        stitchingPrice: 450,
        suitableFor: ['Kurta', 'Shirt', 'Pant'],
    },
    {
        name: 'Premium Polyester Fabric',
        slug: 'premium-polyester-fabric',
        description: 'Durable polyester fabric with easy-care strength and clean structure for everyday tailoring.',
        category: 'mens',
        subcategory: 'polyester',
        type: 'fabric',
        price: 140,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['fabric', 'polyester', 'easy-care', 'smart'],
        stockInMeters: 400,
        pricePerMeter: 140,
        fabricType: 'Polyester',
        width: 58,
        gsm: 165,
        texture: '/placeholder-product.jpg',
        stitchingAvailable: true,
        stitchingPrice: 300,
        suitableFor: ['Shirt', 'Kurta', 'Pant'],
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
    // --- Additional Perfumes (3) ---
    {
        name: 'Oud & Rose Signature Attar',
        slug: 'oud-rose-signature-attar',
        description: 'A rich oud base with soft rose elegance. Long-lasting attar with a refined finish.',
        category: 'accessories',
        subcategory: 'floral',
        type: 'accessory',
        price: 1599,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['perfume', 'oud', 'rose', 'floral', 'signature'],
        stock: 28,
        material: 'Perfume Oil Blend',
        color: 'Amber Rose',
    },
    {
        name: 'Musk Serenity Cologne',
        slug: 'musk-serenity-cologne',
        description: 'Smooth musky notes with a clean finish. A confident everyday fragrance.',
        category: 'accessories',
        subcategory: 'woody',
        type: 'accessory',
        price: 1199,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['cologne', 'musk', 'woody', 'clean', 'daily'],
        stock: 40,
        material: 'Eau de Cologne',
        color: 'Clear',
    },
    {
        name: 'Fresh Bergamot Premium Perfume',
        slug: 'fresh-bergamot-premium-perfume',
        description: 'Bright bergamot top notes with a gentle freshness. Crisp and uplifting throughout the day.',
        category: 'accessories',
        subcategory: 'fresh',
        type: 'accessory',
        price: 899,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['perfume', 'bergamot', 'fresh', 'citrus'],
        stock: 55,
        material: 'Eau de Parfum',
        color: 'Light Citrus',
    },
    // --- Additional Caps (3) ---
    {
        name: 'Pure Cotton Everyday Kufi',
        slug: 'pure-cotton-everyday-kufi',
        description: 'Breathable everyday kufi cap crafted from pure cotton for comfort during prayer.',
        category: 'accessories',
        subcategory: 'kufi',
        type: 'accessory',
        price: 249,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['cap', 'kufi', 'cotton', 'everyday'],
        stock: 90,
        material: 'Cotton',
        color: 'Ivory',
    },
    {
        name: 'Soft Stretch Taqiyah',
        slug: 'soft-stretch-taqiyah',
        description: 'Comfort fit taqiyah skullcap with a soft stretch weave. Stays in place all day.',
        category: 'accessories',
        subcategory: 'taqiyah',
        type: 'accessory',
        price: 199,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['cap', 'taqiyah', 'soft', 'stretch'],
        stock: 110,
        material: 'Cotton Blend',
        color: 'Black',
    },
    {
        name: 'Adjustable Snapback Prayer Cap',
        slug: 'adjustable-snapback-prayer-cap',
        description: 'Adjustable snapback prayer cap with a structured shape for a clean modern look.',
        category: 'accessories',
        subcategory: 'snapback',
        type: 'accessory',
        price: 399,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['cap', 'snapback', 'adjustable', 'modern'],
        stock: 65,
        material: 'Cotton Canvas',
        color: 'Navy Blue',
    },
    // --- Additional Accessories (2) ---
    {
        name: 'Genuine Leather Belt',
        slug: 'genuine-leather-belt',
        description: 'Genuine leather belt with a smooth finish and durable buckle for everyday styling.',
        category: 'accessories',
        subcategory: 'belt',
        type: 'accessory',
        price: 899,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['belt', 'leather', 'genuine', 'accessory'],
        stock: 45,
        material: 'Genuine Leather',
        color: 'Brown',
    },
    {
        name: 'Slim Leather Wallet',
        slug: 'slim-leather-wallet',
        description: 'A slim leather wallet with smart compartments. Clean design for daily carry.',
        category: 'accessories',
        subcategory: 'wallet',
        type: 'accessory',
        price: 1199,
        images: ['/placeholder-product.jpg'],
        featured: true,
        active: true,
        tags: ['wallet', 'leather', 'slim', 'accessory'],
        stock: 60,
        material: 'Leather',
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

function parseBoolean(value: string | undefined, defaultValue: boolean) {
    if (value === undefined) return defaultValue;
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
    return defaultValue;
}

const clearExistingArg = process.argv.find((a) => a.startsWith('--clearExisting='));
const clearExisting = parseBoolean(
    clearExistingArg ? clearExistingArg.split('=')[1] : process.env.CLEAR_EXISTING,
    true
);

async function seed() {
    try {
        console.log('🌱 Starting database seed...');
        console.log('📍 Connecting to MongoDB Atlas...');

        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ Connected to MongoDB');

        if (clearExisting) {
            // Clear existing products
            await ReadymadeProduct.deleteMany({});
            await FabricProduct.deleteMany({});
            await AccessoryProduct.deleteMany({});
            console.log('🗑️  Cleared existing products');
        } else {
            console.log('➕ Adding products without clearing existing catalog...');
        }

        let insertedReadymade = 0;
        let insertedFabric = 0;
        let insertedAccessory = 0;

        // Upsert readymade products
        for (const p of READYMADE_PRODUCTS) {
            if (clearExisting) {
                await ReadymadeProduct.create(p);
                insertedReadymade++;
                console.log(`✅ Created Readymade: ${p.name} @ ₹${p.price}`);
            } else {
                const res = await ReadymadeProduct.updateOne(
                    { slug: p.slug },
                    { $setOnInsert: p },
                    { upsert: true }
                );
                if ((res as any).upsertedCount) insertedReadymade++;
            }
        }

        // Upsert fabric products
        for (const p of FABRIC_PRODUCTS) {
            if (clearExisting) {
                await FabricProduct.create(p);
                insertedFabric++;
                console.log(`✅ Created Fabric: ${p.name} @ ₹${p.pricePerMeter}/m`);
            } else {
                const res = await FabricProduct.updateOne(
                    { slug: p.slug },
                    { $setOnInsert: p },
                    { upsert: true }
                );
                if ((res as any).upsertedCount) insertedFabric++;
            }
        }

        // Upsert accessory products
        for (const p of ACCESSORY_PRODUCTS) {
            if (clearExisting) {
                await AccessoryProduct.create(p);
                insertedAccessory++;
                console.log(`✅ Created Accessory: ${p.name} @ ₹${p.price}`);
            } else {
                const res = await AccessoryProduct.updateOne(
                    { slug: p.slug },
                    { $setOnInsert: p },
                    { upsert: true }
                );
                if ((res as any).upsertedCount) insertedAccessory++;
            }
        }

        const total = READYMADE_PRODUCTS.length + FABRIC_PRODUCTS.length + ACCESSORY_PRODUCTS.length;
        console.log(`\n🎉 Database seeded successfully!`);
        console.log(`📊 Products processed (input total): ${total}`);
        console.log(`   - Newly inserted:`);
        console.log(`     - Readymade: ${insertedReadymade}`);
        console.log(`     - Fabric: ${insertedFabric}`);
        console.log(`     - Accessory: ${insertedAccessory}`);
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
