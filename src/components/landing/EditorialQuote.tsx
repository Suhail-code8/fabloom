'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function EditorialQuote() {
    return (
        <section className="py-32 md:py-48 bg-background text-foreground flex items-center justify-center px-6">
            <div className="max-w-[1000px] text-center">
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[1.2] font-light"
                >
                    "The art of the Kandora is not in its complexity, but in its <span className="italic text-foreground/80">unapologetic perfection.</span>"
                </motion.p>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="mt-12 text-[10px] tracking-[0.25em] uppercase text-foreground/50 font-medium"
                >
                    — The Master Tailor
                </motion.div>
            </div>
        </section>
    );
}
