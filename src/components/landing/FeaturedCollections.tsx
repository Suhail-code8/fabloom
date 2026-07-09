'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─────────────────────────────────────────────────────────────────────────────
// DATA  (descriptions shortened to one sentence — luxury brands don't over-explain)
// ─────────────────────────────────────────────────────────────────────────────

interface Collection {
    id: string;
    label: string;
    title: string;
    description: string;
    href: string;
    image: string;
    alt: string;
    objectPosition: string;
}

const COLLECTIONS: Collection[] = [
    {
        id: 'readymade',
        label: '01',
        title: 'Ready-made',
        description: 'Elegant garments, finished to perfection and ready to wear.',
        href: '/readymade',
        image: '/hero-kandoras.png',
        alt: 'Premium ready-made Kandoras',
        objectPosition: 'center 20%',
    },
    {
        id: 'stitching',
        label: '02',
        title: 'Bespoke\nTailoring',
        description: 'A private conversation between your measurements and our craft.',
        href: '/stitching',
        image: '/hero-tailor.png',
        alt: 'Master tailor at work',
        objectPosition: 'center 15%',
    },
    {
        id: 'fabrics',
        label: '03',
        title: 'Luxury\nFabrics',
        description: 'Imported fabrics of rare comfort — available by the metre.',
        href: '/fabrics',
        image: '/hero-fabric.png',
        alt: 'Premium luxury fabric rolls',
        objectPosition: 'center center',
    },
    {
        id: 'accessories',
        label: '04',
        title: 'Accessories',
        description: 'Carefully selected essentials that complete the silhouette.',
        href: '/home',
        image: '/hero-perfume.png',
        alt: 'Arabian oud and Fabloom accessories',
        objectPosition: 'center 30%',
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// EDITORIAL BLOCK — base component used for all four placements
// Hover is orchestrated at the parent level via Framer variant propagation.
// ─────────────────────────────────────────────────────────────────────────────

interface BlockProps {
    collection: Collection;
    /** Height of the image area in px or CSS string */
    height: string;
    /** Stagger delay from when the grid enters view */
    delay: number;
    /** Extra inline styles on the outer wrapper (for grid-area or z-index overrides) */
    outerStyle?: React.CSSProperties;
}

function EditorialBlock({ collection, height, delay, outerStyle }: BlockProps) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-60px 0px' });

    return (
        // Scroll-entry wrapper
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1.0, delay, ease: EASE }}
            style={{ position: 'relative', ...outerStyle }}
        >
            {/*
             * Hover orchestrator — variant "hover" propagates to all children.
             * No card border, no box-shadow border — depth comes from layered shadows.
             */}
            <motion.div
                initial="rest"
                whileHover="hover"
                animate="rest"
                style={{ cursor: 'pointer', position: 'relative', height: '100%' }}
            >
                <Link
                    href={collection.href}
                    aria-label={`Explore ${collection.title.replace('\n', ' ')}`}
                    style={{ display: 'block', textDecoration: 'none', height: '100%' }}
                >
                    {/* ── IMAGE AREA ── */}
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            height,
                            overflow: 'hidden',
                        }}
                    >
                        {/* Image — zooms on hover via variant */}
                        <motion.div
                            variants={{
                                rest: { scale: 1 },
                                hover: {
                                    scale: 1.06,
                                    transition: { duration: 0.85, ease: EASE },
                                },
                            }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                willChange: 'transform',
                            }}
                        >
                            <Image
                                src={collection.image}
                                alt={collection.alt}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw"
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: collection.objectPosition,
                                }}
                            />
                        </motion.div>

                        {/* ── VIGNETTES ── */}

                        {/* Bottom — text legibility */}
                        <div
                            aria-hidden
                            style={{
                                position: 'absolute',
                                bottom: 0, left: 0, right: 0,
                                height: '68%',
                                background:
                                    'linear-gradient(to top, rgba(8,6,28,0.97) 0%, rgba(15,16,53,0.6) 45%, transparent 100%)',
                                pointerEvents: 'none',
                                zIndex: 2,
                            }}
                        />

                        {/* Top — studio ceiling */}
                        <div
                            aria-hidden
                            style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0,
                                height: '20%',
                                background:
                                    'linear-gradient(to bottom, rgba(8,6,28,0.35) 0%, transparent 100%)',
                                pointerEvents: 'none',
                                zIndex: 2,
                            }}
                        />

                        {/*
                         * ── GOLD ACCENT LINE ──
                         * Draws left-to-right on hover. GPU scaleX only.
                         * Fabloom's editorial signature.
                         */}
                        <motion.div
                            aria-hidden
                            variants={{
                                rest: { scaleX: 0 },
                                hover: {
                                    scaleX: 1,
                                    transition: { duration: 0.48, ease: EASE },
                                },
                            }}
                            style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0,
                                height: '1.5px',
                                background:
                                    'linear-gradient(to right, transparent 0%, #D4A853 20%, #f5e0a0 50%, #D4A853 80%, transparent 100%)',
                                transformOrigin: 'left center',
                                zIndex: 5,
                                pointerEvents: 'none',
                            }}
                        />

                        {/* ── TEXT CONTENT ── lifted 4px on hover */}
                        <motion.div
                            variants={{
                                rest: { y: 0 },
                                hover: {
                                    y: -4,
                                    transition: { duration: 0.35, ease: EASE },
                                },
                            }}
                            style={{
                                position: 'absolute',
                                bottom: 0, left: 0, right: 0,
                                padding: 'clamp(1.25rem, 3vw, 2rem)',
                                zIndex: 3,
                            }}
                        >
                            {/* Collection number */}
                            <span
                                style={{
                                    display: 'block',
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontSize: '0.55rem',
                                    letterSpacing: '0.35em',
                                    textTransform: 'uppercase',
                                    color: '#D4A853',
                                    opacity: 0.75,
                                    marginBottom: '0.5rem',
                                }}
                            >
                                {collection.label}
                            </span>

                            {/* Title — preserves intentional line breaks */}
                            <h3
                                style={{
                                    fontFamily: 'var(--font-playfair)',
                                    fontSize: 'clamp(1.5rem, 2.6vw, 2rem)',
                                    fontWeight: 700,
                                    color: '#f6e1a1',
                                    lineHeight: 1.1,
                                    letterSpacing: '-0.01em',
                                    marginBottom: '0.5rem',
                                    whiteSpace: 'pre-line',
                                }}
                            >
                                {collection.title}
                            </h3>

                            {/* One sentence — reduced from previous multi-sentence */}
                            <p
                                style={{
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontSize: '0.78rem',
                                    fontWeight: 300,
                                    lineHeight: 1.65,
                                    color: 'rgba(201,197,204,0.55)',
                                    maxWidth: '26ch',
                                    marginBottom: '0.85rem',
                                }}
                            >
                                {collection.description}
                            </p>

                            {/* Explore + arrow */}
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: 'var(--font-dm-sans)',
                                        fontSize: '0.58rem',
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
                                        rest: { x: 0, opacity: 0.6 },
                                        hover: {
                                            x: 6,
                                            opacity: 1,
                                            transition: { duration: 0.3, ease: EASE },
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
                        </motion.div>
                    </div>
                </Link>
            </motion.div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-40px 0px' });

    return (
        <div
            ref={ref}
            style={{
                maxWidth: '1440px',
                margin: '0 auto',
                padding: '0 clamp(1.5rem, 5vw, 5rem)',
                // 120–160px breathing room before title — smooth entry from Hero
                paddingTop: 'clamp(7.5rem, 11vw, 10rem)',
                paddingBottom: 'clamp(3rem, 5vw, 4.5rem)',
            }}
        >
            {/* Overline */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: EASE }}
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

            {/* Heading row — title left, body copy right */}
            <div className="lp-fc-header">
                <motion.h2
                    id="fc-heading"
                    initial={{ opacity: 0, y: 28 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
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
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.9, delay: 0.18, ease: EASE }}
                    style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: 'clamp(0.875rem, 1.1vw, 0.95rem)',
                        fontWeight: 300,
                        lineHeight: 1.85,
                        color: 'rgba(201,197,204,0.5)',
                        maxWidth: '38ch',
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
//
// Desktop grid: 12 columns, 2 rows, controlled asymmetry.
//
//   Row 1:  [─ Block 1 (7 cols, ~620px tall) ─][─ Block 2 (5 cols, ~440px tall) ─]
//   Row 2:  [─ Block 3 (5 cols, ~380px tall) ─][── Block 4 (7 cols, ~560px tall, overlaps -60px) ──]
//
// The overlap on Block 4 is the editorial tension point — it visually connects
// the two rows instead of leaving a gutter gap.
// ─────────────────────────────────────────────────────────────────────────────

export default function FeaturedCollections() {
    // Trigger for the entire grid — cards appear 250ms after header has settled.
    const gridRef = useRef<HTMLDivElement>(null);
    const gridInView = useInView(gridRef, { once: true, margin: '-60px 0px' });

    return (
        <>
            <style>{`
                /* Header: stacked mobile, side-by-side desktop */
                .lp-fc-header {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                @media (min-width: 768px) {
                    .lp-fc-header {
                        flex-direction: row;
                        align-items: flex-end;
                        gap: clamp(3rem, 6vw, 6rem);
                    }
                }

                /*
                 * EDITORIAL GRID — 12-column basis on desktop.
                 * On mobile: single column, generous gaps.
                 * On tablet: 2-column even split.
                 * On desktop: true 12-col with named areas for asymmetric placement.
                 */
                .lp-fc-editorial {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                @media (min-width: 640px) {
                    .lp-fc-editorial {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        grid-template-rows: auto auto;
                        gap: 1rem;
                        align-items: start;
                    }
                }

                @media (min-width: 1024px) {
                    .lp-fc-editorial {
                        /* 12 equal columns */
                        grid-template-columns: repeat(12, 1fr);
                        grid-template-rows: auto auto;
                        gap: 1rem;
                        align-items: start;
                    }

                    /* Block 1 — large portrait, spans 7 of 12 cols */
                    .lp-fc-b1 { grid-column: 1 / 8; grid-row: 1; }

                    /* Block 2 — landscape, spans 5 of 12 cols */
                    .lp-fc-b2 { grid-column: 8 / 13; grid-row: 1; }

                    /* Block 3 — landscape, spans 5 of 12 cols */
                    .lp-fc-b3 { grid-column: 1 / 6; grid-row: 2; }

                    /*
                     * Block 4 — tall portrait, spans 7 of 12 cols.
                     * margin-top: -60px creates the deliberate overlap into Row 1's space,
                     * connecting the two rows visually and breaking the rigid grid rhythm.
                     * z-index: 2 keeps it above Block 2 at the overlap seam.
                     */
                    .lp-fc-b4 {
                        grid-column: 6 / 13;
                        grid-row: 2;
                        margin-top: -60px;
                        position: relative;
                        z-index: 2;
                    }
                }
            `}</style>

            <section
                aria-labelledby="fc-heading"
                style={{
                    background: '#0f1035',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/*
                 * Warm radial glow behind the grid — below 4% opacity.
                 * Provides the section with a sense of depth vs. the flat navy.
                 */}
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        top: '20%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80%',
                        height: '60%',
                        background:
                            'radial-gradient(ellipse at center, rgba(212,168,83,0.038) 0%, transparent 70%)',
                        filter: 'blur(80px)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Header — fades in first */}
                <SectionHeader />

                {/* Grid — 250ms after header */}
                <div
                    ref={gridRef}
                    style={{
                        maxWidth: '1440px',
                        margin: '0 auto',
                        padding: '0 clamp(1.5rem, 5vw, 5rem)',
                        paddingBottom: 'clamp(5rem, 9vw, 8rem)',
                    }}
                >
                    <div className="lp-fc-editorial">

                        {/*
                         * Block 1 — Ready-made
                         * Tall portrait (7 cols). Dominates the first row.
                         * The biggest block anchors the viewer's eye first.
                         */}
                        <div className="lp-fc-b1">
                            <EditorialBlock
                                collection={COLLECTIONS[0]}
                                height="clamp(420px, 62vh, 680px)"
                                delay={gridInView ? 0.25 : 0}
                            />
                        </div>

                        {/*
                         * Block 2 — Bespoke Tailoring
                         * Landscape (5 cols). Shorter than Block 1 — creates the vertical
                         * tension that makes Row 1 feel alive rather than uniform.
                         */}
                        <div className="lp-fc-b2">
                            <EditorialBlock
                                collection={COLLECTIONS[1]}
                                height="clamp(320px, 45vh, 500px)"
                                delay={gridInView ? 0.37 : 0}
                            />
                        </div>

                        {/*
                         * Block 3 — Luxury Fabrics
                         * Landscape (5 cols). Shorter block on Row 2 left.
                         * Its lower height exposes Block 4's overlap edge.
                         */}
                        <div className="lp-fc-b3">
                            <EditorialBlock
                                collection={COLLECTIONS[2]}
                                height="clamp(300px, 40vh, 460px)"
                                delay={gridInView ? 0.32 : 0}
                            />
                        </div>

                        {/*
                         * Block 4 — Accessories
                         * Tall portrait (7 cols). margin-top: -60px creates the deliberate
                         * overlap — Block 4's top edge intrudes into Row 1's space.
                         * This is the editorial centrepiece of the grid rhythm.
                         */}
                        <div className="lp-fc-b4">
                            <EditorialBlock
                                collection={COLLECTIONS[3]}
                                height="clamp(460px, 65vh, 700px)"
                                delay={gridInView ? 0.44 : 0}
                            />
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
