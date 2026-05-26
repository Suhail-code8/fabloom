import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { Product, ReadymadeProduct, FabricProduct, AccessoryProduct } from '@/models/Product';

export interface GetProductsFilters {
    type?: string;
    category?: string;
    featured?: boolean;
    slug?: string;
    search?: string;
    limit?: number;
    sort?: string;
}

/**
 * PRODUCTION HARDENING: Shared data access function.
 * Avoids self-fetching during build which causes 500s.
 */
export async function getProductsAction(filters: GetProductsFilters = {}) {
    try {
        await dbConnect();

        const query: any = { active: true };
        if (filters.type && filters.type !== 'products') query.type = filters.type;
        if (filters.category) query.category = filters.category;
        if (filters.featured !== undefined) query.featured = filters.featured;
        
        if (filters.slug) {
            if (mongoose.Types.ObjectId.isValid(filters.slug)) {
                query._id = filters.slug;
            } else {
                query.slug = filters.slug;
            }
        }

        if (filters.search && filters.search.trim()) {
            query.$text = { $search: filters.search.trim() };
        }

        let cursor = Product.find(query);

        // Sorting
        if (filters.search && filters.search.trim()) {
            // Text relevance sort (requires a text index on the Product schema)
            cursor = cursor
                .select({ score: { $meta: 'textScore' } })
                .sort({ score: { $meta: 'textScore' } });
        } else if (filters.sort === 'createdAt') {
            cursor = cursor.sort({ createdAt: -1 });
        } else {
            cursor = cursor.sort({ featured: -1, createdAt: -1 });
        }

        // Limit
        if (filters.limit) {
            cursor = cursor.limit(filters.limit);
        }

        const products = await cursor.lean();
        
        console.log(`DAL: Found ${products.length} products for query:`, JSON.stringify(query));
        
        // Serialize for Client Components (remove Mongoose internal props)
        return JSON.parse(JSON.stringify(products));
    } catch (error) {
        console.error('DAL: Failed to get products:', error);
        return [];
    }
}
