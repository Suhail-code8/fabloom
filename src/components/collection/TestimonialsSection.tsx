'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface TestimonialsSectionProps {
    show?: boolean;
}

export function TestimonialsSection({ show }: TestimonialsSectionProps) {
    if (!show) return null;

    return (
        <section className="py-24 md:py-32 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-4">Clientele</h2>
                    <h3 className="text-3xl font-serif font-light text-gray-900">Voices of the Discerning</h3>
                </motion.div>
                
                <div className="grid md:grid-cols-3 gap-12 text-center max-w-6xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="px-6"
                    >
                        <p className="text-gray-700 italic mb-6 font-serif leading-relaxed text-lg">"The fit and finish is absolutely premium. Very satisfied with my purchase."</p>
                        <p className="text-xs tracking-widest text-gray-500 uppercase font-medium">— Ahmed K.</p>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="px-6 border-l border-r border-gray-100"
                    >
                        <p className="text-gray-700 italic mb-6 font-serif leading-relaxed text-lg">"Exceptional fabric quality that lasts. Will definitely buy again."</p>
                        <p className="text-xs tracking-widest text-gray-500 uppercase font-medium">— Tariq M.</p>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="px-6"
                    >
                        <p className="text-gray-700 italic mb-6 font-serif leading-relaxed text-lg">"Fast shipping and luxurious packaging. A truly premium experience."</p>
                        <p className="text-xs tracking-widest text-gray-500 uppercase font-medium">— Omar S.</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
