import mongoose from 'mongoose';
import connectDB from '../lib/db';
import { Product } from '../models/Product';
import Collection from '../models/Collection';
import fs from 'fs';
import path from 'path';

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
                displayOrder: 1
            },
            { upsert: true, new: true }
        );

        // Child Collections
        const collectionsData = [
            { name: 'Kandoora', slug: 'kandoora' },
            { name: 'Kurta', slug: 'kurta' },
            { name: 'Jubba Set', slug: 'jubba-set' },
            { name: 'Paijama', slug: 'paijama' },
            { name: 'Dhotis', slug: 'dhotis' },
            { name: 'Voil', slug: 'voil' },
            { name: 'Dasthar', slug: 'dasthar' }
        ];

        const createdCollections: Record<string, mongoose.Types.ObjectId> = {};

        for (const [index, col] of collectionsData.entries()) {
            const doc = await Collection.findOneAndUpdate(
                { slug: col.slug },
                { 
                    name: col.name, 
                    slug: col.slug, 
                    moduleId: 'readymades', 
                    parentId: readymadesMod._id, 
                    type: 'STANDARD',
                    isActive: true,
                    displayOrder: index + 1
                },
                { upsert: true, new: true }
            );
            createdCollections[col.slug] = doc._id;
        }

        // Sub-Collections for Kandoora
        const kandooraSubData = [
            { name: 'Saudi', slug: 'saudi' },
            { name: 'Kuwaiti', slug: 'kuwaiti' },
            { name: 'Emirati', slug: 'emirati' }
        ];

        for (const [index, sub] of kandooraSubData.entries()) {
            const doc = await Collection.findOneAndUpdate(
                { slug: `kandoora-${sub.slug}` },
                { 
                    name: sub.name, 
                    slug: `kandoora-${sub.slug}`, 
                    moduleId: 'readymades', 
                    parentId: createdCollections['kandoora'], 
                    type: 'STANDARD',
                    isActive: true,
                    displayOrder: index + 1
                },
                { upsert: true, new: true }
            );
            createdCollections[`kandoora-${sub.slug}`] = doc._id;
        }

        console.log('Migrating products...');

        const allReadymades = await Product.find({ type: 'readymade' });
        const needsReview: any[] = [];
        let migratedCount = 0;

        for (const product of allReadymades) {
            const subcat = (product.subcategory || '').toLowerCase();
            let targetCollectionId = null;

            if (subcat === 'kandoora') {
                // If it's a kandoora but we don't know the exact type, map to Kandoora root for now,
                // but realistically they might have a style variant we don't parse easily.
                // Assuming "color" or "name" might contain 'saudi' etc.
                const nameStr = product.name.toLowerCase();
                if (nameStr.includes('saudi')) targetCollectionId = createdCollections['kandoora-saudi'];
                else if (nameStr.includes('kuwaiti')) targetCollectionId = createdCollections['kandoora-kuwaiti'];
                else if (nameStr.includes('emirati')) targetCollectionId = createdCollections['kandoora-emirati'];
                else targetCollectionId = createdCollections['kandoora'];
            } else if (subcat === 'kurta') {
                targetCollectionId = createdCollections['kurta'];
            } else if (subcat === 'jubba set' || subcat === 'jubbaset') {
                targetCollectionId = createdCollections['jubba-set'];
            } else if (subcat === 'paijama') {
                targetCollectionId = createdCollections['paijama'];
            } else if (subcat === 'dhotis' || subcat === 'dhoti') {
                targetCollectionId = createdCollections['dhotis'];
            } else if (subcat === 'voil') {
                targetCollectionId = createdCollections['voil'];
            } else if (subcat === 'dasthar') {
                targetCollectionId = createdCollections['dasthar'];
            }

            if (targetCollectionId) {
                await Product.findByIdAndUpdate(product._id, {
                    $addToSet: { collectionIds: targetCollectionId }
                });
                migratedCount++;
            } else {
                needsReview.push({
                    productId: product._id,
                    name: product.name,
                    slug: product.slug,
                    legacyCategory: product.category,
                    legacySubcategory: product.subcategory
                });
            }
        }

        console.log(`Successfully migrated ${migratedCount} products.`);

        if (needsReview.length > 0) {
            const reportPath = path.join(__dirname, 'migration_review_report.json');
            fs.writeFileSync(reportPath, JSON.stringify(needsReview, null, 2));
            console.log(`WARNING: ${needsReview.length} products could not be automatically mapped.`);
            console.log(`Report generated at: ${reportPath}`);
        } else {
            console.log('All readymade products mapped successfully.');
        }

        // Cleanup legacy incorrect collections created by the previous run
        const legacySlugs = ['thobe', 'shirts', 'pants'];
        await Collection.deleteMany({ slug: { $in: legacySlugs } });
        console.log('Cleaned up legacy/incorrect collections.');

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
