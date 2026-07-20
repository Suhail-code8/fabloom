import React from 'react';
import Link from 'next/link';
import { ICollectionModel } from '@/models/Collection';

interface CollectionNavigatorProps {
    collections: any[];
    currentPath: string;
    title?: string;
}

export function CollectionNavigator({ collections, currentPath, title = "Explore Collections" }: CollectionNavigatorProps) {
    if (!collections || collections.length === 0) return null;

    return (
        <section className="py-12 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4">
                {title && <h2 className="text-sm tracking-widest uppercase text-gray-500 mb-8 text-center">{title}</h2>}
                
                {/* Mobile: Horizontal scroll, Desktop: Flex wrap or Grid */}
                <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-6 md:justify-center md:flex-wrap">
                    {collections.map(col => {
                        const href = `${currentPath}/${col.slug}`;
                        return (
                            <Link 
                                key={col._id} 
                                href={href}
                                className="group flex-shrink-0 w-[280px] md:w-[320px] flex flex-col items-center"
                            >
                                <div className="w-full h-[360px] bg-gray-100 overflow-hidden relative mb-4 rounded-sm">
                                    {col.heroImage ? (
                                        <div 
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                            style={{ backgroundImage: `url(${col.heroImage})` }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-300">
                                            <span className="font-serif italic text-lg">{col.name}</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                                </div>
                                <h3 className="text-xl font-serif text-gray-900 mb-2">{col.name}</h3>
                                <span className="text-xs tracking-wider uppercase text-gray-500 border-b border-transparent group-hover:border-gray-500 transition-colors pb-1">
                                    Discover
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
