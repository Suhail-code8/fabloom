import { unstable_cache } from 'next/cache';
import dbConnect from './db';
import { Product } from '@/models/Product';

export const CACHE_TAGS = {
    products: 'products',
    product: (slug: string) => `product-${slug}`,
    orders: (userId: string) => `orders-${userId}`,
    inventory: 'inventory',
};

// ============================================================================
// CACHED DATA FETCHERS
// ============================================================================

/**
 * Fetch all active products with caching
 */
export const getCachedProducts = unstable_cache(
    async () => {
        await dbConnect();
        return Product.find({ active: true }).sort({ createdAt: -1 }).lean();
    },
    ['products'],
    {
        revalidate: 3600, // 1 hour
        tags: [CACHE_TAGS.products],
    }
);

/**
 * Fetch a single product by slug with caching
 */
export const getCachedProductBySlug = (slug: string) => 
    unstable_cache(
        async () => {
            await dbConnect();
            return Product.findOne({ slug, active: true }).lean();
        },
        [`product-${slug}`],
        {
            revalidate: 3600,
            tags: [CACHE_TAGS.product(slug), CACHE_TAGS.products],
        }
    )();

/**
 * Fetch products by category with caching
 */
export const getCachedProductsByCategory = (category: string) =>
    unstable_cache(
        async () => {
            await dbConnect();
            return Product.find({ category, active: true }).sort({ createdAt: -1 }).lean();
        },
        [`products-cat-${category}`],
        {
            revalidate: 3600,
            tags: [CACHE_TAGS.products],
        }
    )();
