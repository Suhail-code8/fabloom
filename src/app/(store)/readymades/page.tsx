import React from 'react';
import { notFound } from 'next/navigation';
import { CollectionService } from '@/lib/services/collection.service';
import {
    CollectionHero,
    EditorialSection,
    CollectionNavigator,
    TrustSection
} from '@/components/collection';
import dbConnect from '@/lib/db';

export const metadata = {
    title: 'Luxury Readymades | Fabloom',
    description: 'Explore the definitive collection of luxury readymade garments, tailored for the modern gentleman.',
};

export default async function ReadymadesRootPage() {
    await dbConnect();
    
    // Resolve the root "readymades" collection
    const collection = await CollectionService.resolvePath(['readymades']);
    
    if (!collection) {
        return notFound();
    }

    // Fetch child collections for the navigator (Kandoora, Kurta, etc.)
    const children = await CollectionService.getChildCollections(collection._id.toString());
    
    return (
        <main className="min-h-screen bg-white pb-24">
            <CollectionHero 
                title={collection.name} 
                heroImage={collection.heroImage || '/placeholder-hero.jpg'} 
            />

            <div className="max-w-4xl mx-auto px-4 mt-8 mb-16">
                <EditorialSection 
                    content={collection.editorialText || 'Discover our premium range of readymade garments, crafted for elegance, exceptional comfort, and a flawless drape.'} 
                />
            </div>

            <CollectionNavigator 
                collections={children} 
                currentPath="/readymades" 
                title="The Collections"
            />

            <TrustSection />
        </main>
    );
}
