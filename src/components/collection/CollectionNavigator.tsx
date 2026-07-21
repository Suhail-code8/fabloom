'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ICollectionModel } from '@/models/Collection';

interface CollectionNavigatorProps {
    collections: any[];
    currentPath: string;
    title?: string;
}

export function CollectionNavigator({ collections, currentPath, title = "Explore Collections" }: CollectionNavigatorProps) {
    if (!collections || collections.length === 0) return null;

    return (
        <section className="py-16 md:py-24">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                {title && (
                    <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-[10px] tracking-[0.25em] uppercase text-foreground/50 mb-12 text-center font-medium"
                    >
                        {title}
                    </motion.h2>
                )}
                
                {/* Horizontal scroll container with smooth snapping for mobile */}
                <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 md:gap-8 snap-x snap-mandatory hide-scrollbar justify-start">
                    {collections.map((col, idx) => {
                        const href = `${currentPath}/${col.slug}`;
                        return (
                            <Link 
                                key={col._id} 
                                href={href}
                                className="group flex-shrink-0 w-[80vw] sm:w-[300px] md:w-[360px] flex flex-col items-center snap-center"
                            >
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                                    className="w-full"
                                >
                                    <div className="w-full aspect-[4/5] bg-foreground/5 overflow-hidden relative mb-6 rounded-[2px]">
                                        {col.heroImage ? (
                                            <div 
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                                                style={{ backgroundImage: `url(${col.heroImage})` }}
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-foreground/5 text-foreground/30">
                                                <span className="font-serif italic text-xl">{col.name}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-foreground/5 group-hover:bg-black/0 transition-colors duration-500" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-2xl font-serif text-foreground mb-3 group-hover:text-foreground/80 transition-colors">{col.name}</h3>
                                        <div className="inline-block relative">
                                            <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/60 transition-colors pb-1 group-hover:text-accent">
                                                Discover
                                            </span>
                                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
