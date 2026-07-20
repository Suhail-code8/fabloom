'use client';
import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/product/ProductCard';

interface FeaturedProductsProps {
    products: any[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
    if (!products || products.length === 0) return null;

    const isSingle = products.length === 1;

    return (
        <section className="py-16 md:py-24 border-t border-gray-100 bg-[#fafafa]">
            <div className="max-w-7xl mx-auto px-4">
                {!isSingle && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-serif font-light text-gray-900 mb-4">Curated Highlights</h2>
                        <div className="w-12 h-[1px] bg-gray-300 mx-auto" />
                    </motion.div>
                )}
                
                <div className={`grid ${isSingle ? 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto items-center gap-12' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12'}`}>
                    {products.map((product, idx) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: idx * 0.15 }}
                            className={isSingle ? 'col-span-1' : ''}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}

                    {isSingle && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-col justify-center"
                        >
                            <h3 className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-4">The Signature Piece</h3>
                            <h4 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6 leading-snug">Exacting Standards. Absolute Perfection.</h4>
                            <p className="text-gray-600 font-light leading-relaxed mb-8">
                                Hand-selected as the pinnacle expression of this collection. Experience the uncompromising quality, flawless drape, and master tailoring that define Fabloom.
                            </p>
                            <div>
                                <span className="inline-block border-b border-gray-900 pb-1 text-sm font-medium hover:text-gray-500 hover:border-gray-500 transition-colors cursor-pointer">
                                    Discover the Craft
                                </span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
