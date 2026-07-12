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

export async function generateMetadata({ params }: { params: { slug: string[] } }) {
    await dbConnect();
    const fullPath = ['readymades', ...params.slug];
    const collection = await CollectionService.resolvePath(fullPath);

    if (!collection) {
        return {
            title: 'Collection Not Found | Fabloom'
        };
    }

    return {
        title: `${collection.seoTitle || collection.name} | Fabloom`,
        description: collection.metaDescription || `Shop our exclusive ${collection.name} collection at Fabloom.`
    };
}

export default async function ReadymadesDynamicPage({ params }: { params: { slug: string[] } }) {
    await dbConnect();
    
    // Resolve the collection by prefixing with 'readymades'
    const fullPath = ['readymades', ...params.slug];
    const collection = await CollectionService.resolvePath(fullPath);
    
    if (!collection) {
        return notFound();
    }

    // Fetch required data
    const children = await CollectionService.getChildCollections(collection._id.toString());
    const products = await Product.find({ collectionIds: collection._id }).limit(20).lean();
    const breadcrumbNodes = await CollectionService.getBreadcrumbs(collection._id.toString());
    
    // Build breadcrumbs for the UI
    const breadcrumbs = breadcrumbNodes.map((node, index) => {
        // Construct path iteratively based on index
        const pathSlugs = breadcrumbNodes.slice(0, index + 1).map(n => n.slug);
        const path = `/${pathSlugs.join('/')}`;
        return {
            name: node.name,
            slug: node.slug,
            path
        };
    });

    const currentPath = `/${fullPath.join('/')}`;
    const featuredProducts = products.slice(0, 4);

    return (
        <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CollectionBreadcrumbs items={breadcrumbs} />
            
            <CollectionHero 
                title={collection.name} 
                heroImage={collection.heroImage} 
            />

            <EditorialSection 
                content={collection.editorialText} 
            />

            <ChildCollectionGrid 
                childrenCollections={children} 
                currentPath={currentPath} 
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
