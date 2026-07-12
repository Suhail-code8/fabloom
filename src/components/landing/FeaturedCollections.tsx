'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSIVE HOOK
// ─────────────────────────────────────────────────────────────────────────────
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);
    return isMobile;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
// EDITORIAL BLOCK
// ─────────────────────────────────────────────────────────────────────────────

interface EditorialBlockProps {
    collection: Collection;
    height: string;
    delay: number;
    alignText?: 'top' | 'bottom';
    className?: string;
}

function EditorialBlock({ collection, height, delay, alignText = 'bottom', className }: EditorialBlockProps) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-60px 0px' });
    const isMobile = useIsMobile();

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.45, delay, ease: EASE }}
            className={className}
        >
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
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: isMobile ? '55vh' : height,
                            overflow: 'hidden',
                        }}
                    >
                        <motion.div
                            variants={{
                                rest: { scale: 1 },
                                hover: {
                                    scale: 1.05,
                                    transition: { duration: 0.3, ease: EASE },
                                },
                            }}
                            style={{ position: 'absolute', inset: 0, willChange: 'transform' }}
                        >
                            <Image
                                src={collection.image}
                                alt={collection.alt}
                                fill
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                style={{ objectFit: 'cover', objectPosition: collection.objectPosition }}
                            />
                        </motion.div>

                        <div
                            aria-hidden
                            style={{
                                position: 'absolute',
                                ...(alignText === 'bottom'
                                    ? { bottom: 0, left: 0, right: 0, height: '65%', background: 'linear-gradient(to top, rgba(15,16,53,0.95) 0%, transparent 100%)' }
                                    : { top: 0, left: 0, right: 0, height: '65%', background: 'linear-gradient(to bottom, rgba(15,16,53,0.95) 0%, transparent 100%)' }),
                                pointerEvents: 'none',
                                zIndex: 2,
                            }}
                        />

                        <motion.div
                            variants={{
                                rest: { y: 0 },
                                hover: {
                                    y: isMobile ? 0 : (alignText === 'bottom' ? -4 : 4),
                                    transition: { duration: 0.3, ease: EASE },
                                },
                            }}
                            style={{
                                position: 'absolute',
                                ...(alignText === 'bottom' ? { bottom: 0 } : { top: 0 }),
                                left: 0, right: 0,
                                padding: '2rem',
                                zIndex: 3,
                            }}
                        >
                            <span style={{ display: 'block', fontFamily: 'var(--font-dm-sans)', fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D4A853', marginBottom: '0.5rem' }}>
                                {collection.label}
                            </span>
                            <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.75rem', fontWeight: 700, color: '#f6e1a1', lineHeight: 1.1, marginBottom: '0.5rem', whiteSpace: 'pre-line' }}>
                                {collection.title}
                            </h3>
                            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', maxWidth: '24ch', marginBottom: '1rem' }}>
                                {collection.description}
                            </p>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#D4A853' }}>
                                    Explore
                                </span>
                                <motion.span
                                    aria-hidden
                                    variants={{
                                        rest: { x: 0, opacity: 0.6 },
                                        hover: { x: 6, opacity: 1, transition: { duration: 0.3, ease: EASE } },
                                    }}
                                    style={{ color: '#D4A853', fontSize: '0.8rem', display: 'inline-block', lineHeight: 1 }}
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
    const isMobile = useIsMobile();

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
                    initial={{ opacity: 0, y: isMobile ? 16 : 28 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: isMobile ? 0.6 : 0.9, delay: 0.1, ease: EASE }}
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
                    initial={{ opacity: 0, y: isMobile ? 12 : 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: isMobile ? 0.6 : 0.9, delay: 0.18, ease: EASE }}
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
    const isMobile = useIsMobile();
    // Trigger for the entire grid — cards appear shortly after header has settled.
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
                @media (min-width: 1024px) {
                    .lp-fc-header {
                        flex-direction: row;
                        align-items: flex-end;
                        gap: clamp(3rem, 6vw, 6rem);
                    }
                }

                /*
                 * EDITORIAL GRID
                 * On mobile (<1024px): 1-2-1 layout. Asymmetric 65fr 35fr split on middle row.
                 * On desktop (≥1024px): 12-col with complex overlap.
                 */
                .lp-fc-editorial {
                    display: grid;
                    grid-template-columns: 65fr 35fr;
                    grid-template-rows: auto auto auto;
                    gap: 0.75rem;
                    align-items: start;
                }

                /* Mobile Block Placements */
                .lp-fc-b1 { grid-column: 1 / 3; grid-row: 1; }
                .lp-fc-b2 { grid-column: 1 / 2; grid-row: 2; }
                .lp-fc-b3 { grid-column: 2 / 3; grid-row: 2; }
                .lp-fc-b4 { grid-column: 1 / 3; grid-row: 3; }

                @media (min-width: 1024px) {
                    .lp-fc-editorial {
                        /* 12 equal columns */
                        grid-template-columns: repeat(12, 1fr);
                        grid-template-rows: auto auto;
                        gap: 1rem;
                    }

                    /* Block 1 — spans 7 cols */
                    .lp-fc-b1 { grid-column: 1 / 8; grid-row: 1; }
                    /* Block 2 — spans 5 cols */
                    .lp-fc-b2 { grid-column: 8 / 13; grid-row: 1; }
                    /* Block 3 — spans 5 cols */
                    .lp-fc-b3 { grid-column: 1 / 6; grid-row: 2; }
                    /* Block 4 — spans 7 cols, overlaps Row 1 */
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

                <div
                    ref={gridRef}
                    style={{
                        maxWidth: '1440px',
                        margin: '0 auto',
                        // V3 mobile: consistent 64px padding bottom mapping to 128px desktop
                        padding: '0 clamp(1.5rem, 5vw, 5rem)',
                        paddingBottom: 'clamp(4rem, 9vw, 8rem)',
                    }}
                >
                    <div className="lp-fc-editorial">

                        {/* Block 1 — Ready-made */}
                        <div className="lp-fc-b1">
                            <EditorialBlock
                                collection={COLLECTIONS[0]}
                                height={isMobile ? 'clamp(340px, 55vh, 480px)' : 'clamp(420px, 62vh, 680px)'}
                                delay={gridInView ? (isMobile ? 0.1 : 0.25) : 0}
                            />
                        </div>

                        {/* Block 2 — Bespoke Tailoring (Taller, 65% width on mobile) */}
                        <div className="lp-fc-b2">
                            <EditorialBlock
                                collection={COLLECTIONS[1]}
                                height={isMobile ? 'clamp(280px, 45vh, 400px)' : 'clamp(320px, 45vh, 500px)'}
                                delay={gridInView ? (isMobile ? 0.2 : 0.37) : 0}
                                alignText="bottom"
                            />
                        </div>

                        {/* Block 3 — Luxury Fabrics (Shorter, 35% width, Text-First on mobile) */}
                        <div className="lp-fc-b3">
                            <EditorialBlock
                                collection={COLLECTIONS[2]}
                                height={isMobile ? 'clamp(220px, 35vh, 320px)' : 'clamp(300px, 40vh, 460px)'}
                                delay={gridInView ? (isMobile ? 0.3 : 0.32) : 0}
                                alignText={isMobile ? 'top' : 'bottom'}
                            />
                        </div>

                        {/* Block 4 — Accessories */}
                        <div className="lp-fc-b4">
                            <EditorialBlock
                                collection={COLLECTIONS[3]}
                                height={isMobile ? 'clamp(340px, 55vh, 480px)' : 'clamp(460px, 65vh, 700px)'}
                                delay={gridInView ? (isMobile ? 0.4 : 0.44) : 0}
                            />
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
