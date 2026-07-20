'use client';
import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/product/ProductCard';

interface CollectionProductGridProps {
    products: any[];
}

export function CollectionProductGrid({ products }: CollectionProductGridProps) {
    if (!products || products.length === 0) {
        return (
            <div className="py-32 text-center text-gray-400 font-serif italic text-xl">
                <p>The collection is currently being curated.</p>
            </div>
        );
    }

    return (
        <section className="py-16 md:py-24">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 border-b border-gray-100 pb-4">
                <h2 className="text-2xl md:text-3xl font-serif font-light text-gray-900 mb-2 md:mb-0">The Catalog</h2>
                <span className="text-xs tracking-widest text-gray-400 uppercase">{products.length} {products.length === 1 ? 'Piece' : 'Pieces'}</span>
            </div>
            
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16"
            >
                {products.map((product) => (
                    <motion.div
                        key={product._id}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                        }}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
