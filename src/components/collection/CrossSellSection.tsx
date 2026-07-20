import React from 'react';
import Link from 'next/link';

interface CrossSellSectionProps {
    title?: string;
    description?: string;
    items?: any[]; // Typically related products or collections
}

export function CrossSellSection({ 
    title = "Complete the Look", 
    description = "Elevate your ensemble with our signature accessories and bespoke additions.",
    items = []
}: CrossSellSectionProps) {
    // If no explicit items, we just show a static placeholder to prove the concept
    const displayItems = items.length > 0 ? items : [
        { id: 1, name: 'Premium Ghutra', category: 'Accessories' },
        { id: 2, name: 'Signature Perfume', category: 'Fragrances' },
        { id: 3, name: 'Classic Agal', category: 'Accessories' },
    ];

    return (
        <section className="py-16 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-2xl font-light mb-4">{title}</h2>
                <p className="text-gray-500 mb-10 max-w-xl mx-auto">{description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayItems.map((item, idx) => (
                        <div key={item.id || idx} className="group relative bg-gray-50 rounded-lg p-8 flex flex-col items-center justify-center h-64 hover:bg-gray-100 transition-colors cursor-pointer">
                            <span className="text-sm tracking-widest uppercase text-gray-400 mb-2">{item.category}</span>
                            <h3 className="text-xl font-serif text-gray-900 group-hover:text-black transition-colors">{item.name}</h3>
                            <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="border-b border-gray-900 pb-1 text-sm font-medium">Explore</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
