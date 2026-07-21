import React from 'react';
import { notFound } from 'next/navigation';
import { CollectionService } from '@/lib/services/collection.service';
import { Product } from '@/models/Product';
import {
    CollectionHero,
    EditorialSection,
    CollectionNavigator,
    FeaturedProducts,
    CollectionProductGrid,
    BuyingGuide,
    CollectionBreadcrumbs,
    CrossSellSection
} from '@/components/collection';
import dbConnect from '@/lib/db';

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
    await dbConnect();
    const resolvedParams = await params;
    const fullPath = ['readymades', ...resolvedParams.slug];
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

export default async function ReadymadesDynamicPage({ params }: { params: Promise<{ slug: string[] }> }) {
    await dbConnect();
    
    const resolvedParams = await params;
    const fullPath = ['readymades', ...resolvedParams.slug];
    const collection = await CollectionService.resolvePath(fullPath);
    
    if (!collection) {
        return notFound();
    }

    const depth = resolvedParams.slug.length;
    const isLevel2 = depth === 1; // e.g., kandoora
    const isLevel3 = depth === 2; // e.g., kandoora/saudi

    // Fetch required data
    const children = await CollectionService.getChildCollections(collection._id.toString());
    const products = await Product.find({ collectionIds: collection._id }).limit(24).lean();
    const breadcrumbNodes = await CollectionService.getBreadcrumbs(collection._id.toString());
    
    // Build breadcrumbs for the UI
    const breadcrumbs = breadcrumbNodes.map((node, index) => {
        const pathSlugs = breadcrumbNodes.slice(0, index + 1).map(n => n.slug);
        const path = `/${pathSlugs.join('/')}`;
        return {
            name: node.name,
            slug: node.slug,
            path
        };
    });

    const currentPath = `/${fullPath.join('/')}`;
    
    // We differentiate Featured Piece vs Featured Products by slicing different amounts
    const featuredProducts = isLevel3 ? products.slice(0, 1) : products.slice(0, 3);
    const gridProducts = isLevel3 ? products.slice(1) : products.slice(3);

    return (
        <main className="min-h-screen bg-white pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <CollectionBreadcrumbs items={breadcrumbs} />
            </div>
            
            <CollectionHero 
                title={collection.name} 
                heroImage={collection.heroImage || '/placeholder-hero.jpg'} 
            />

            {/* Level 2: Parent Collection Experience */}
            {isLevel2 && (
                <>
                    {children.length > 0 && (
                        <div className="mt-8 mb-16">
                            <CollectionNavigator 
                                collections={children} 
                                currentPath={currentPath}
                                title="Explore Styles"
                            />
                        </div>
                    )}
                    
                    <div className="max-w-3xl mx-auto px-4 mb-16">
                        <EditorialSection content={collection.editorialText || `The quintessential ${collection.name}, reimagined for modern luxury.`} />
                    </div>
                    
                    {featuredProducts.length > 0 && (
                        <FeaturedProducts products={featuredProducts} />
                    )}
                    
                    <div className="max-w-7xl mx-auto px-4 mt-16">
                        <CollectionProductGrid products={gridProducts} />
                    </div>
                </>
            )}

            {/* Level 3: Leaf Collection Experience */}
            {isLevel3 && (
                <>
                    <div className="max-w-3xl mx-auto px-4 mt-12 mb-16">
                        <EditorialSection content={collection.editorialText || `Signature design and master tailoring define our ${collection.name}.`} />
                    </div>

                    {featuredProducts.length > 0 && (
                        <div className="max-w-5xl mx-auto px-4 mb-16">
                            <h2 className="text-xl tracking-widest text-center text-gray-500 uppercase mb-8">The Signature Piece</h2>
                            {/* We just reuse FeaturedProducts but with 1 item it will render nicely centered */}
                            <FeaturedProducts products={featuredProducts} />
                        </div>
                    )}

                    <div className="max-w-7xl mx-auto px-4 mb-16">
                        <BuyingGuide guideLink={collection.buyingGuideUrl || '/measure-guide'} />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 mt-16">
                        <CollectionProductGrid products={gridProducts} />
                    </div>

                    <CrossSellSection />
                </>
            )}
            
        </main>
    );
}
