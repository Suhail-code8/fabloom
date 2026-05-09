import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function checkDB() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI not found in .env.local');
        return;
    }

    try {
        await mongoose.connect(uri);
        console.log('Connected to:', uri.split('@')[1]); // Log host only for safety

        const products = await mongoose.connection.db?.collection('products').find({}).toArray();
        console.log('Total products found:', products?.length);
        
        if (products) {
            products.forEach(p => {
                console.log(`- ID: ${p._id} | TYPE: ${p.type} | SUB: ${p.subcategory} | NAME: ${p.name} | SLUG: ${p.slug}`);
            });
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkDB();
