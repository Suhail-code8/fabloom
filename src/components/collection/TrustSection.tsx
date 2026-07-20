'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface TrustSectionProps {
    title?: string;
    description?: string;
}

export function TrustSection({ 
    title = "The Fabloom Heritage", 
    description = "Rooted in tradition and refined for the modern gentleman. Every garment is crafted with absolute precision, utilizing the world's finest fabrics and masterful tailoring techniques." 
}: TrustSectionProps) {
    return (
        <section className="py-24 md:py-32 bg-[#0a0a0a] text-white">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16 md:gap-24">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="md:w-1/2 text-center md:text-left"
                >
                    <h2 className="text-sm tracking-[0.2em] text-white/50 uppercase mb-6 font-medium">Sartorial Excellence</h2>
                    <h3 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">{title}</h3>
                    <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-12 font-light">
                        {description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                        <div>
                            <div className="w-8 h-[1px] bg-white/30 mb-6 mx-auto md:mx-0" />
                            <h4 className="font-serif text-xl mb-3">Finest Fabrics</h4>
                            <p className="text-sm text-white/50 font-light leading-relaxed">Sourced directly from the world's premier mills, ensuring exceptional drape and longevity.</p>
                        </div>
                        <div>
                            <div className="w-8 h-[1px] bg-white/30 mb-6 mx-auto md:mx-0" />
                            <h4 className="font-serif text-xl mb-3">Master Tailoring</h4>
                            <p className="text-sm text-white/50 font-light leading-relaxed">Exquisite attention to every stitch, born from decades of artisanal craftsmanship.</p>
                        </div>
                    </div>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="md:w-1/2 w-full aspect-[3/4] md:aspect-[4/5] bg-gray-900 relative rounded-[2px] overflow-hidden"
                >
                    {/* Placeholder for a luxury brand/atelier image */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000"
                        style={{ backgroundImage: "url('/images/atelier-placeholder.jpg')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 text-center md:text-left">
                        <span className="text-xs tracking-[0.2em] text-white/70 uppercase">The Atelier</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
