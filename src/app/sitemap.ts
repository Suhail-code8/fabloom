import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://fabloom.in';

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/readymade`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/stitching`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/fabrics`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/perfumes`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/caps`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/accessories`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    ];

    try {
        await dbConnect();
        const activeProducts = await Product.find({ active: true }).select('slug type updatedAt').lean();

        const productRoutes: MetadataRoute.Sitemap = activeProducts.map((product: any) => ({
            url: `${baseUrl}/${product.type}/${product.slug}`,
            lastModified: product.updatedAt || new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        return [...staticRoutes, ...productRoutes];
    } catch (error) {
        console.error('Error generating sitemap:', error);
        return staticRoutes;
    }
}
