'use client';
import React from 'react';
import { motion } from 'framer-motion';

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
    const displayItems = items.length > 0 ? items : [
        { id: 1, name: 'Premium Ghutra', category: 'Accessories' },
        { id: 2, name: 'Signature Perfume', category: 'Fragrances' },
        { id: 3, name: 'Classic Agal', category: 'Accessories' },
    ];

    return (
        <section className="py-24 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-serif font-light text-gray-900 mb-6">{title}</h2>
                    <p className="text-lg text-gray-500 font-light max-w-xl mx-auto leading-relaxed">{description}</p>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displayItems.map((item, idx) => (
                        <motion.div 
                            key={item.id || idx} 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: idx * 0.15 }}
                            className="group relative bg-[#fcfcfc] border border-gray-100 p-12 flex flex-col items-center justify-center h-80 hover:border-gray-300 transition-colors cursor-pointer"
                        >
                            <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-4">{item.category}</span>
                            <h3 className="text-2xl font-serif text-gray-800 group-hover:text-black transition-colors text-center">{item.name}</h3>
                            <div className="mt-8 overflow-hidden h-6">
                                <motion.span 
                                    className="inline-block border-b border-gray-900 pb-1 text-xs tracking-widest uppercase font-medium transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out"
                                >
                                    Explore
                                </motion.span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
