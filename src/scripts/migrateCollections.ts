import mongoose from 'mongoose';
import connectDB from '../lib/db';
import { Product } from '../models/Product';
import Collection from '../models/Collection';

async function runMigration() {
    try {
        console.log('Connecting to database...');
        await connectDB();
        console.log('Connected.');

        console.log('Creating base collections...');
        
        // Modules
        const readymadesMod = await Collection.findOneAndUpdate(
            { slug: 'readymades' },
            { 
                name: 'Readymades', 
                slug: 'readymades', 
                moduleId: 'readymades', 
                parentId: null, 
                type: 'STANDARD',
                isActive: true,
                seoTitle: 'Premium Readymades | Fabloom',
                metaDescription: 'Shop our premium collection of readymade Islamic fashion.'
            },
            { upsert: true, new: true }
        );

        // Child Collections
        const kandooraColl = await Collection.findOneAndUpdate(
            { slug: 'kandoora' },
            { 
                name: 'Kandoora', 
                slug: 'kandoora', 
                moduleId: 'readymades', 
                parentId: readymadesMod._id, 
                type: 'STANDARD',
                isActive: true 
            },
            { upsert: true, new: true }
        );

        const kurtaColl = await Collection.findOneAndUpdate(
            { slug: 'kurta' },
            { 
                name: 'Kurta', 
                slug: 'kurta', 
                moduleId: 'readymades', 
                parentId: readymadesMod._id, 
                type: 'STANDARD',
                isActive: true 
            },
            { upsert: true, new: true }
        );

        const thobeColl = await Collection.findOneAndUpdate(
            { slug: 'thobe' },
            { 
                name: 'Thobe', 
                slug: 'thobe', 
                moduleId: 'readymades', 
                parentId: readymadesMod._id, 
                type: 'STANDARD',
                isActive: true 
            },
            { upsert: true, new: true }
        );

        const shirtColl = await Collection.findOneAndUpdate(
            { slug: 'shirts' },
            { 
                name: 'Shirts', 
                slug: 'shirts', 
                moduleId: 'readymades', 
                parentId: readymadesMod._id, 
                type: 'STANDARD',
                isActive: true 
            },
            { upsert: true, new: true }
        );
        
        const pantColl = await Collection.findOneAndUpdate(
            { slug: 'pants' },
            { 
                name: 'Pants', 
                slug: 'pants', 
                moduleId: 'readymades', 
                parentId: readymadesMod._id, 
                type: 'STANDARD',
                isActive: true 
            },
            { upsert: true, new: true }
        );

        console.log('Migrating products...');

        // Kandooras
        await Product.updateMany(
            { type: 'readymade', subcategory: 'kandoora' },
            { $addToSet: { collectionIds: kandooraColl._id } }
        );

        // Kurtas
        await Product.updateMany(
            { type: 'readymade', subcategory: 'kurta' },
            { $addToSet: { collectionIds: kurtaColl._id } }
        );

        // Thobes
        await Product.updateMany(
            { type: 'readymade', subcategory: 'thobe' },
            { $addToSet: { collectionIds: thobeColl._id } }
        );

        // Shirts
        await Product.updateMany(
            { type: 'readymade', subcategory: 'shirts' },
            { $addToSet: { collectionIds: shirtColl._id } }
        );

        // Pants
        await Product.updateMany(
            { type: 'readymade', subcategory: 'pants' },
            { $addToSet: { collectionIds: pantColl._id } }
        );

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
