import React from 'react';
import { notFound } from 'next/navigation';
import { CollectionService } from '@/lib/services/collection.service';
import { Product } from '@/models/Product';
import {
    CollectionHero,
    EditorialSection,
    ChildCollectionGrid,
    FeaturedProducts,
    CollectionProductGrid,
    BuyingGuide,
    TestimonialsSection,
    CollectionBreadcrumbs
} from '@/components/collection';
import dbConnect from '@/lib/db';

export const metadata = {
    title: 'Readymades | Fabloom',
    description: 'Shop our premium collection of readymade Islamic fashion.',
};

export default async function ReadymadesRootPage() {
    await dbConnect();
    
    // Resolve the root "readymades" collection
    const collection = await CollectionService.resolvePath(['readymades']);
    
    if (!collection) {
        return notFound();
    }

    // Fetch required data
    const children = await CollectionService.getChildCollections(collection._id.toString());
    const products = await Product.find({ collectionIds: collection._id }).limit(20).lean();
    
    // Breadcrumbs
    const breadcrumbs = [
        { name: collection.name, slug: collection.slug, path: '/readymades' }
    ];

    // Placeholder data for featured products
    const featuredProducts = products.slice(0, 4);

    return (
        <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CollectionBreadcrumbs items={breadcrumbs} />
            
            <CollectionHero 
                title={collection.name} 
                heroImage={collection.heroImage} 
            />

            <EditorialSection 
                content={collection.editorialText || 'Discover our premium range of readymade garments, crafted for elegance and comfort.'} 
            />

            <ChildCollectionGrid 
                childrenCollections={children} 
                currentPath="/readymades" 
            />

            {featuredProducts.length > 0 && (
                <FeaturedProducts products={featuredProducts} />
            )}

            <CollectionProductGrid products={products} />

            <BuyingGuide guideLink={collection.buyingGuideLink} />

            <TestimonialsSection show={collection.showTestimonials !== false} />
        </main>
    );
}
