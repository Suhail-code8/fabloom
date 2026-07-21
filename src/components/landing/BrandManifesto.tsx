'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BrandManifesto() {
    return (
        <section className="bg-background text-foreground py-32 md:py-48 px-6 relative overflow-hidden">
            {/* Subtle Top Divider */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-foreground/10 to-transparent" />
            
            <div className="max-w-[800px] mx-auto text-center flex flex-col items-center">
                <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="block text-[10px] tracking-[0.25em] uppercase text-accent mb-12"
                >
                    The House Manifesto
                </motion.span>
                
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[1.2] text-foreground mb-12 font-light"
                >
                    Rooted in tradition and refined for the modern gentleman. Every garment is crafted with <span className="italic text-foreground/80">absolute precision.</span>
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4 }}
                >
                    <Link href="/about" className="group inline-flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-foreground/60 transition-colors hover:text-foreground">
                        <span>Discover the House</span>
                        <span className="w-8 h-[1px] bg-foreground/20 transition-all group-hover:w-12 group-hover:bg-foreground" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
