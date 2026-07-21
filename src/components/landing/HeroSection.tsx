'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
    return (
        <section
            aria-label="Hero — Fabloom Kandoras"
            className="relative w-full min-h-[90vh] flex items-center justify-center bg-background overflow-hidden"
        >
            {/* Soft background noise/texture for a tactile feel */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-multiply"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '180px 180px',
                }}
            />

            <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 pt-32 pb-16 flex flex-col items-center text-center">
                
                {/* Micro Label */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-4 mb-8"
                >
                    <span className="w-8 h-[1px] bg-accent/40" />
                    <span className="text-[10px] tracking-[0.25em] uppercase text-foreground/60 font-medium">
                        House of Fabloom
                    </span>
                    <span className="w-8 h-[1px] bg-accent/40" />
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="font-serif text-[clamp(3rem,8vw,7rem)] leading-[1.05] tracking-[-0.02em] text-foreground mb-6"
                >
                    Crafted for <br className="hidden md:block" />
                    <span className="italic text-foreground/90">Modern Elegance.</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-[42ch] text-[clamp(1rem,1.2vw,1.1rem)] leading-relaxed text-foreground/70 font-light mb-12"
                >
                    Rooted in heritage. Refined through craft. Every Kandora is a conversation between tradition and precision.
                </motion.p>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-6 items-center"
                >
                    <Link
                        href="/readymades"
                        className="inline-flex items-center justify-center px-10 py-4 bg-foreground text-background text-[10px] tracking-[0.2em] uppercase transition-all duration-300 hover:bg-foreground/90"
                    >
                        Explore Collections
                    </Link>
                    <Link
                        href="/stitching"
                        className="inline-flex items-center justify-center px-10 py-4 border border-foreground/20 text-foreground text-[10px] tracking-[0.2em] uppercase transition-all duration-300 hover:border-foreground"
                    >
                        Bespoke Tailoring
                    </Link>
                </motion.div>
            </div>

            {/* Immersive Image spanning bottom width */}
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-0 left-0 right-0 h-[35vh] md:h-[45vh] z-0 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent z-10" />
                <Image
                    src="/hero-kandora.png"
                    alt="Fabloom Kandora Collection"
                    fill
                    priority
                    className="object-cover object-[50%_15%] opacity-80"
                />
            </motion.div>
        </section>
    );
}
