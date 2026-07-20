'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface EditorialSectionProps {
    content?: string;
}

export function EditorialSection({ content }: EditorialSectionProps) {
    if (!content) return null;

    return (
        <section className="max-w-4xl mx-auto py-16 md:py-24 px-6 text-center">
            <motion.p 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-xl md:text-3xl text-[#1a1a1a] font-serif leading-[1.8] font-light tracking-wide"
            >
                {content}
            </motion.p>
        </section>
    );
}
