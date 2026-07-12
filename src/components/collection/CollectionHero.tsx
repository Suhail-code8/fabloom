import React from 'react';

interface CollectionHeroProps {
    title: string;
    heroImage?: string;
}

export function CollectionHero({ title, heroImage }: CollectionHeroProps) {
    return (
        <section className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center bg-gray-900 text-white overflow-hidden rounded-xl mb-8">
            {heroImage && (
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                    style={{ backgroundImage: `url(${heroImage})` }}
                />
            )}
            <div className="relative z-10 text-center px-4">
                <h1 className="text-4xl md:text-5xl font-light tracking-tight">{title}</h1>
            </div>
        </section>
    );
}
