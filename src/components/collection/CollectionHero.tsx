'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface CollectionHeroProps {
    title: string;
    heroImage?: string;
}

export function CollectionHero({ title, heroImage }: CollectionHeroProps) {
    return (
        <section className="relative w-full h-[60vh] md:h-[75vh] min-h-[400px] flex items-center justify-center bg-[#0a0a0a] text-white overflow-hidden mb-12">
            {heroImage && (
                <motion.div 
                    initial={{ scale: 1.05, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.6 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
                    style={{ backgroundImage: `url(${heroImage})` }}
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0a0a0a]/80" />
            
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-7xl font-serif font-light tracking-tight text-white/90 drop-shadow-sm"
                >
                    {title}
                </motion.h1>
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
                    className="h-[1px] w-16 bg-white/40 mx-auto mt-8"
                />
            </div>
        </section>
    );
}
