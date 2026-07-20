'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BuyingGuideProps {
    guideLink?: string;
}

export function BuyingGuide({ guideLink }: BuyingGuideProps) {
    if (!guideLink) return null;

    return (
        <section className="py-20 md:py-32 bg-[#f4f4f4] my-16 rounded-[4px]">
            <div className="max-w-3xl mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6 leading-tight">Master the Fit</h2>
                    <p className="text-lg text-gray-600 mb-12 font-light leading-relaxed">
                        Read our comprehensive guide to understanding fabrics, bespoke measurements, and signature styles.
                    </p>
                    <Link 
                        href={guideLink}
                        className="inline-block px-10 py-4 bg-transparent border border-gray-900 text-gray-900 text-sm tracking-widest uppercase font-medium hover:bg-gray-900 hover:text-white transition-colors duration-300"
                    >
                        Explore the Guide
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
