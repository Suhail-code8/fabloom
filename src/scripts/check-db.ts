import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Product } from '../models/Product';

async function checkDatabase() {
    try {
        console.log('🔍 Checking MongoDB database...\n');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ Connected to MongoDB Atlas\n');

        // Count products
        const count = await Product.countDocuments();
        console.log(`📊 Total products in database: ${count}\n`);

        if (count > 0) {
            // Fetch all products
            const products = await Product.find({}).lean();

            console.log('Products:');
            products.forEach((product: any, index: number) => {
                console.log(`\n${index + 1}. ${product.name}`);
                console.log(`   Type: ${product.type}`);
                console.log(`   Category: ${product.category}`);
                console.log(`   Price: $${product.price}`);
                console.log(`   Active: ${product.active}`);
                console.log(`   ID: ${product._id}`);
            });
        } else {
            console.log('❌ No products found in database!');
            console.log('Run: npm run seed');
        }

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');

    } catch (error) {
        console.error('❌ Error:', error);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
    }
}

checkDatabase();
