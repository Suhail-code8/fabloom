import React from 'react';
import Link from 'next/link';
import { ICollectionModel } from '@/models/Collection';

interface ChildCollectionGridProps {
    childrenCollections: any[]; // Using any to bypass strict type for now, it's ICollectionModel[]
    currentPath: string;
}

export function ChildCollectionGrid({ childrenCollections, currentPath }: ChildCollectionGridProps) {
    if (!childrenCollections || childrenCollections.length === 0) return null;

    return (
        <section className="py-8">
            <h2 className="text-2xl font-light mb-6">Explore Collections</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {childrenCollections.map(child => (
                    <Link 
                        key={child._id} 
                        href={`${currentPath}/${child.slug}`}
                        className="group relative block h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center transition-all hover:shadow-lg"
                    >
                        {child.heroImage && (
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105"
                                style={{ backgroundImage: `url(${child.heroImage})` }}
                            />
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                        <h3 className="relative z-10 text-white font-medium text-lg tracking-wide">{child.name}</h3>
                    </Link>
                ))}
            </div>
        </section>
    );
}
