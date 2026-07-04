'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

interface Collection {
    id: string;
    label: string;
    title: string;
    description: string;
    href: string;
    image: string;
    alt: string;
    /** CSS aspect-ratio string e.g. '3 / 4' */
    aspectRatio: string;
}

const COLLECTIONS: Collection[] = [
    {
        id: 'readymade',
        label: 'Collection 01',
        title: 'Ready-made',
        description:
            'Elegant garments ready to wear. Crafted with premium fabrics and finished to perfection.',
        href: '/readymade',
        image: '/hero-kandoras.png',
        alt: 'Premium ready-made Kandoras neatly presented',
        aspectRatio: '3 / 4',           // portrait — tall left
    },
    {
        id: 'stitching',
        label: 'Collection 02',
        title: 'Bespoke Tailoring',
        description:
            'Crafted precisely to your measurements. A private conversation between you and the craft.',
        href: '/stitching',
        image: '/hero-tailor.png',
        alt: 'Master tailor at work in Koduvally atelier',
        aspectRatio: '4 / 3',           // landscape — wide right-top
    },
    {
        id: 'fabrics',
        label: 'Collection 03',
        title: 'Luxury Fabrics',
        description:
            'Premium imported fabrics selected for comfort and elegance. Available by the metre.',
        href: '/fabrics',
        image: '/hero-fabric.png',
        alt: 'Rolls of premium luxury fabric in neutral tones',
        aspectRatio: '4 / 3',           // landscape — wide left-bottom
    },
    {
        id: 'accessories',
        label: 'Collection 04',
        title: 'Accessories',
        description:
            'Complete your wardrobe with carefully selected essentials — caps, perfumes and more.',
        href: '/home',
        image: '/hero-perfume.png',
        alt: 'Arabian oud perfume and Fabloom accessories',
        aspectRatio: '3 / 4',           // portrait — tall right
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// COLLECTION CARD
// ─────────────────────────────────────────────────────────────────────────────

interface CollectionCardProps {
    collection: Collection;
    /** Used to stagger scroll-entry animation */
    scrollDelay: number;
}

function CollectionCard({ collection, scrollDelay }: CollectionCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px 0px' });

    return (
        /*
         * Outer div handles scroll-entry animation.
         * Inner motion.div handles hover — keeping the two concerns separate
         * avoids conflicting `initial` props on a single element.
         */
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 52 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 52 }}
            transition={{
                duration: 0.95,
                delay: scrollDelay,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {/*
             * Hover orchestrator: parent is in "rest" by default, switches to "hover"
             * on pointer-enter. All child variants receive this automatically.
             */}
            <motion.div
                initial="rest"
                whileHover="hover"
                animate="rest"
                style={{ cursor: 'pointer', position: 'relative' }}
            >
                {/* Subtle lift shadow enhancement on hover */}
                <motion.div
                    variants={{
                        rest: { boxShadow: '0 4px 24px rgba(0,0,0,0)' },
                        hover: {
                            boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
                            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                        },
                    }}
                    style={{ borderRadius: '0px' }}
                >
                    <Link
                        href={collection.href}
                        aria-label={`Explore ${collection.title}`}
                        style={{ display: 'block', textDecoration: 'none' }}
                    >
                        {/* ── IMAGE WRAPPER — clips zoom overflow ── */}
                        <div
                            style={{
                                position: 'relative',
                                width: '100%',
                                aspectRatio: collection.aspectRatio,
                                overflow: 'hidden',
                            }}
                        >
                            {/* Image zooms via variant inheritance */}
                            <motion.div
                                variants={{
                                    rest: { scale: 1 },
                                    hover: {
                                        scale: 1.045,
                                        transition: {
                                            duration: 0.8,
                                            ease: [0.22, 1, 0.36, 1],
                                        },
                                    },
                                }}
                                style={{ position: 'absolute', inset: 0 }}
                            >
                                <Image
                                    src={collection.image}
                                    alt={collection.alt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    style={{
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                        willChange: 'transform',
                                    }}
                                />
                            </motion.div>

                            {/* ── VIGNETTES — create depth ── */}

                            {/* Bottom: deep gradient for text legibility */}
                            <div
                                aria-hidden
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '72%',
                                    background:
                                        'linear-gradient(to top, rgba(8,6,28,0.96) 0%, rgba(15,16,53,0.55) 50%, transparent 100%)',
                                    pointerEvents: 'none',
                                    zIndex: 2,
                                }}
                            />

                            {/* Top: studio-ceiling ambient */}
                            <div
                                aria-hidden
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '22%',
                                    background:
                                        'linear-gradient(to bottom, rgba(8,6,28,0.4) 0%, transparent 100%)',
                                    pointerEvents: 'none',
                                    zIndex: 2,
                                }}
                            />

                            {/* ── GOLD ACCENT LINE — Fabloom signature ── */}
                            {/*
                             * Draws left-to-right on hover entry (scaleX 0→1).
                             * Same GPU-only technique as the HeroSection gold thread.
                             * Lives at the top edge — editorial crop-mark feeling.
                             */}
                            <motion.div
                                aria-hidden
                                variants={{
                                    rest: { scaleX: 0 },
                                    hover: {
                                        scaleX: 1,
                                        transition: {
                                            duration: 0.5,
                                            ease: [0.22, 1, 0.36, 1],
                                        },
                                    },
                                }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '1.5px',
                                    background:
                                        'linear-gradient(to right, transparent 0%, #D4A853 20%, #f5e0a0 50%, #D4A853 80%, transparent 100%)',
                                    transformOrigin: 'left center',
                                    zIndex: 5,
                                    pointerEvents: 'none',
                                }}
                            />

                            {/* ── CONTENT OVERLAY — bottom of image ── */}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    padding: 'clamp(1.25rem, 3.5vw, 2.25rem)',
                                    zIndex: 3,
                                }}
                            >
                                {/* Collection number label */}
                                <span
                                    style={{
                                        display: 'block',
                                        fontFamily: 'var(--font-dm-sans)',
                                        fontSize: '0.57rem',
                                        letterSpacing: '0.3em',
                                        textTransform: 'uppercase',
                                        color: '#D4A853',
                                        marginBottom: '0.55rem',
                                        opacity: 0.85,
                                    }}
                                >
                                    {collection.label}
                                </span>

                                {/* Title — Playfair, unchanged */}
                                <h3
                                    style={{
                                        fontFamily: 'var(--font-playfair)',
                                        fontSize: 'clamp(1.35rem, 2.4vw, 1.8rem)',
                                        fontWeight: 700,
                                        color: '#f6e1a1',
                                        lineHeight: 1.1,
                                        letterSpacing: '-0.01em',
                                        marginBottom: '0.6rem',
                                    }}
                                >
                                    {collection.title}
                                </h3>

                                {/* Description — DM Sans light */}
                                <p
                                    style={{
                                        fontFamily: 'var(--font-dm-sans)',
                                        fontSize: '0.8rem',
                                        fontWeight: 300,
                                        lineHeight: 1.75,
                                        color: 'rgba(201,197,204,0.6)',
                                        maxWidth: '28ch',
                                        marginBottom: '1.1rem',
                                    }}
                                >
                                    {collection.description}
                                </p>

                                {/* Explore CTA with animated arrow */}
                                <div
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.45rem',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: 'var(--font-dm-sans)',
                                            fontSize: '0.6rem',
                                            letterSpacing: '0.22em',
                                            textTransform: 'uppercase',
                                            color: '#D4A853',
                                        }}
                                    >
                                        Explore
                                    </span>
                                    <motion.span
                                        aria-hidden
                                        variants={{
                                            rest: { x: 0, opacity: 0.65 },
                                            hover: {
                                                x: 5,
                                                opacity: 1,
                                                transition: {
                                                    duration: 0.3,
                                                    ease: [0.22, 1, 0.36, 1],
                                                },
                                            },
                                        }}
                                        style={{
                                            color: '#D4A853',
                                            fontSize: '0.8rem',
                                            display: 'inline-block',
                                            lineHeight: 1,
                                        }}
                                    >
                                        →
                                    </motion.span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-60px 0px' });

    return (
        <div
            ref={ref}
            style={{
                maxWidth: '1440px',
                margin: '0 auto',
                padding: '0 clamp(1.5rem, 5vw, 5rem)',
                marginBottom: 'clamp(3rem, 6vw, 5rem)',
            }}
        >
            {/* Overline label + short gold rule */}
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.75rem',
                }}
            >
                <span
                    style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.58rem',
                        letterSpacing: '0.32em',
                        textTransform: 'uppercase',
                        color: '#D4A853',
                    }}
                >
                    Featured Collections
                </span>
                <div
                    aria-hidden
                    style={{
                        width: '4.5rem',
                        height: '1px',
                        background: 'linear-gradient(to right, rgba(212,168,83,0.5), transparent)',
                    }}
                />
            </motion.div>

            {/*
             * Two-column layout on desktop: large heading left, body copy right.
             * Single column stacked on mobile.
             * Uses lp- CSS class to avoid duplicate style tag issues.
             */}
            <div className="lp-fc-header">
                <motion.h2
                    id="fc-heading"
                    initial={{ opacity: 0, y: 28 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                        duration: 0.9,
                        delay: 0.1,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                        fontFamily: 'var(--font-playfair)',
                        fontSize: 'clamp(2.2rem, 4.5vw, 3.75rem)',
                        fontWeight: 700,
                        lineHeight: 1.06,
                        color: '#f6e1a1',
                        letterSpacing: '-0.01em',
                    }}
                >
                    Designed Around
                    <br />
                    <span style={{ fontStyle: 'italic' }}>Your Lifestyle.</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                        duration: 0.9,
                        delay: 0.2,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: 'clamp(0.875rem, 1.1vw, 0.95rem)',
                        fontWeight: 300,
                        lineHeight: 1.85,
                        color: 'rgba(201,197,204,0.55)',
                        maxWidth: '40ch',
                    }}
                >
                    From premium ready-made Kandoras to hand-finished bespoke tailoring, luxury
                    fabrics and curated accessories — every offering at Fabloom is an act of
                    intention.
                </motion.p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED COLLECTIONS — default export
// ─────────────────────────────────────────────────────────────────────────────

export default function FeaturedCollections() {
    return (
        <>
            {/*
             * Scoped styles — kept minimal.
             * Only layout rules that cannot cleanly be expressed as inline styles.
             */}
            <style>{`
                /* Section header: stacked on mobile, side-by-side on tablet+ */
                .lp-fc-header {
                    display: flex;
                    flex-direction: column;
                    gap: 1.75rem;
                }
                @media (min-width: 768px) {
                    .lp-fc-header {
                        flex-direction: row;
                        align-items: flex-end;
                        gap: clamp(3rem, 6vw, 6rem);
                    }
                }

                /* Card grid: single column mobile → 2-col desktop */
                .lp-fc-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }
                @media (min-width: 768px) {
                    .lp-fc-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 1.25rem;
                        align-items: start;
                    }
                    /*
                     * Right column shifted down 4rem — this is the editorial rhythm.
                     * It prevents both columns starting at the same baseline,
                     * creating the diagonal visual tension of a magazine spread.
                     */
                    .lp-fc-col-right {
                        padding-top: 4rem;
                    }
                }
            `}</style>

            <section
                aria-labelledby="fc-heading"
                style={{
                    background: '#0f1035',
                    padding: 'clamp(5rem, 9vw, 8rem) 0',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/*
                 * Ambient top-center glow — provides a soft visual break
                 * between this section and the Hero/Marquee above.
                 * Deliberately faint so it doesn't compete with the cards.
                 */}
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        top: '-8%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '70%',
                        height: '45%',
                        background:
                            'radial-gradient(ellipse at center, rgba(212,168,83,0.03) 0%, transparent 70%)',
                        filter: 'blur(70px)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Section header */}
                <SectionHeader />

                {/* Cards */}
                <div
                    style={{
                        maxWidth: '1440px',
                        margin: '0 auto',
                        padding: '0 clamp(1.5rem, 5vw, 5rem)',
                    }}
                >
                    <div className="lp-fc-grid">
                        {/*
                         * Left column — Card 1 (portrait 3:4) sits above Card 3 (landscape 4:3).
                         * The tall card anchors the left; the wide card creates horizontal rhythm below.
                         *
                         * Scroll delay: 0s and 0.15s — they stagger slightly as column enters view.
                         */}
                        <div
                            className="lp-fc-col-left"
                            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                        >
                            <CollectionCard collection={COLLECTIONS[0]} scrollDelay={0} />
                            <CollectionCard collection={COLLECTIONS[2]} scrollDelay={0.15} />
                        </div>

                        {/*
                         * Right column — Card 2 (landscape 4:3) sits above Card 4 (portrait 3:4).
                         * Padded down 4rem on desktop (via .lp-fc-col-right) for the offset.
                         *
                         * Scroll delay: 0.1s and 0.25s — staggered relative to left column.
                         */}
                        <div
                            className="lp-fc-col-right"
                            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                        >
                            <CollectionCard collection={COLLECTIONS[1]} scrollDelay={0.1} />
                            <CollectionCard collection={COLLECTIONS[3]} scrollDelay={0.25} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
