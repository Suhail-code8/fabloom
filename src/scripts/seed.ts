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

async function seed() {
    try {
        console.log('🌱 Starting database seed...');
        console.log('📍 Connecting to MongoDB Atlas...');

        // Connect directly using mongoose
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ Connected to MongoDB');

        // Clear existing products
        await ReadymadeProduct.deleteMany({});
        await FabricProduct.deleteMany({});
        await AccessoryProduct.deleteMany({});
        console.log('🗑️  Cleared existing products');

        // Item 1: Readymade Product - Classic White Thobe
        const readymadeProduct = await ReadymadeProduct.create({
            name: 'Classic White Thobe',
            description: 'Premium quality white thobe made from 100% Egyptian cotton. Perfect for daily prayers and special occasions. Features traditional design with modern comfort.',
            category: 'mens',
            subcategory: 'thobe',
            type: 'readymade',
            price: 50,
            images: [
                'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500',
                'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500'
            ],
            featured: true,
            active: true,
            tags: ['thobe', 'white', 'cotton', 'mens', 'classic'],
            sizeStock: {
                S: 10,
                M: 15,
                L: 12,
                XL: 8,
                XXL: 5
            },
            material: 'Egyptian Cotton',
            color: 'White'
        });
        console.log('✅ Created Readymade Product:', readymadeProduct.name);

        // Item 2: Fabric Product - Egyptian Cotton
        const fabricProduct = await FabricProduct.create({
            name: 'Egyptian Cotton Fabric',
            description: 'Premium Egyptian cotton fabric, perfect for custom stitching. Soft, breathable, and durable. Ideal for thobes, kurtas, and traditional Islamic garments. Available in natural cream color.',
            category: 'mens',
            subcategory: 'fabric',
            type: 'fabric',
            price: 15,
            images: [
                'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=500',
                'https://images.unsplash.com/photo-1558769132-cb1aea3c1c1d?w=500'
            ],
            featured: true,
            active: true,
            tags: ['fabric', 'cotton', 'egyptian', 'premium', 'natural'],
            stockInMeters: 500,
            pricePerMeter: 15,
            fabricType: 'Egyptian Cotton',
            width: 60,
            texture: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=500',
            stitchingAvailable: true,
            stitchingPrice: 35
        });
        console.log('✅ Created Fabric Product:', fabricProduct.name);

        // Item 3: Accessory Product - Royal Oudh Attar
        const accessoryProduct = await AccessoryProduct.create({
            name: 'Royal Oudh Attar',
            description: 'Authentic Arabian oudh attar (perfume oil) with rich, woody fragrance. Long-lasting and alcohol-free. Perfect for daily use and special occasions. Comes in an elegant 12ml bottle.',
            category: 'accessories',
            subcategory: 'fragrance',
            type: 'accessory',
            price: 25,
            images: [
                'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500',
                'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500'
            ],
            featured: false,
            active: true,
            tags: ['attar', 'perfume', 'oudh', 'fragrance', 'arabian'],
            stock: 50,
            material: 'Natural Oudh Oil',
            color: 'Amber'
        });
        console.log('✅ Created Accessory Product:', accessoryProduct.name);

        // Create additional products for better listing display
        await ReadymadeProduct.create({
            name: 'Navy Blue Kurta',
            description: 'Elegant navy blue kurta with embroidered collar. Made from premium cotton blend for comfort and style.',
            category: 'mens',
            subcategory: 'kurta',
            type: 'readymade',
            price: 45,
            images: ['https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=500'],
            featured: false,
            active: true,
            tags: ['kurta', 'navy', 'mens', 'embroidered'],
            sizeStock: { S: 5, M: 8, L: 10, XL: 6, XXL: 3 },
            material: 'Cotton Blend',
            color: 'Navy Blue'
        });

        await FabricProduct.create({
            name: 'Premium Linen Fabric',
            description: 'High-quality linen fabric, breathable and perfect for summer wear. Ideal for custom thobes and kurtas.',
            category: 'mens',
            subcategory: 'fabric',
            type: 'fabric',
            price: 20,
            images: ['https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=500'],
            featured: false,
            active: true,
            tags: ['fabric', 'linen', 'summer', 'breathable'],
            stockInMeters: 300,
            pricePerMeter: 20,
            fabricType: 'Premium Linen',
            width: 58,
            texture: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=500',
            stitchingAvailable: true,
            stitchingPrice: 40
        });

        await AccessoryProduct.create({
            name: 'Traditional Prayer Cap',
            description: 'Handcrafted prayer cap (kufi) with intricate embroidery. Comfortable fit for daily prayers.',
            category: 'accessories',
            subcategory: 'cap',
            type: 'accessory',
            price: 15,
            images: ['https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=500'],
            featured: false,
            active: true,
            tags: ['cap', 'kufi', 'prayer', 'embroidered'],
            stock: 100,
            material: 'Cotton',
            color: 'White'
        });

        console.log('\n🎉 Database seeded successfully!');
        console.log('📊 Total products created: 6');
        console.log('   - Readymade: 2');
        console.log('   - Fabric: 2');
        console.log('   - Accessory: 2');
        console.log('\n✨ You can now view products at:');
        console.log('   - http://localhost:3000/products');
        console.log('   - http://localhost:3000/fabrics');

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

// Run the seed function
seed();
