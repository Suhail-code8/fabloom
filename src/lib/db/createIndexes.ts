import dbConnect from '../db';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';
import { UserMeasurementProfile } from '@/models/UserMeasurementProfile';

/**
 * Ensures critical database indexes are created for performance.
 * Run this on application startup or during deployment.
 */
export async function ensureIndexes() {
    try {
        await dbConnect();
        console.log('--- Ensuring Database Indexes ---');

        // Product Indexes
        console.log('Indexing Products...');
        await Product.collection.createIndex({ type: 1, active: 1 });
        await Product.collection.createIndex({ slug: 1 }, { unique: true });
        await Product.collection.createIndex({ category: 1, type: 1 });

        // Order Indexes
        console.log('Indexing Orders...');
        await Order.collection.createIndex({ userId: 1, createdAt: -1 });
        await Order.collection.createIndex({ orderNumber: 1 }, { unique: true });
        await Order.collection.createIndex({ status: 1 }); // renamed from stitchingStatus in user request to match our model
        
        // MeasurementProfile Indexes
        console.log('Indexing Measurement Profiles...');
        await UserMeasurementProfile.collection.createIndex({ clerkId: 1 }); // our model uses clerkId

        console.log('--- Indexes Ensured Successfully ---');
    } catch (error) {
        console.error('Error creating database indexes:', error);
    }
}
