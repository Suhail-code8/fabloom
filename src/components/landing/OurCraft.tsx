'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

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
// OUR CRAFT — emotional storytelling section
//
// Layout:  Left 40% text  |  Right 60% immersive image
// Feeling: luxury fashion editorial — not ecommerce
// ─────────────────────────────────────────────────────────────────────────────

// ─── ease curve shared across all animations ───
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─────────────────────────────────────────────────────────────────────────────
// LEFT COLUMN — typography + editorial details
// ─────────────────────────────────────────────────────────────────────────────

function CraftText({ isMobile }: { isMobile: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px 0px' });

    return (
        <div
            ref={ref}
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: isMobile ? 'center' : 'flex-start',
                textAlign: isMobile ? 'center' : 'left',
                padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 5rem)',
                zIndex: 2,
            }}
        >
            {/*
             * BACKGROUND QUOTATION MARK
             * Large decorative glyph, extremely low opacity (0.055).
             * Sits behind all content — reads as texture, not UI element.
             * GPU opacity transition only.
             */}
            <motion.span
                aria-hidden
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 0.055 } : {}}
                transition={{ duration: isMobile ? 1.0 : 1.8, delay: 0.1, ease: EASE }}
                style={{
                    position: 'absolute',
                    top: isMobile ? '50%' : 'clamp(1rem, 4vw, 2.5rem)',
                    left: isMobile ? '50%' : 'clamp(0.5rem, 3vw, 2rem)',
                    transform: isMobile ? 'translate(-50%, -50%)' : 'none',
                    fontFamily: 'var(--font-playfair)',
                    fontSize: 'clamp(12rem, 18vw, 18rem)',
                    lineHeight: 1,
                    color: '#D4A853',
                    zIndex: 0,
                    userSelect: 'none',
                    pointerEvents: 'none',
                    willChange: 'opacity',
                }}
            >
                &ldquo;
            </motion.span>

            {/*
             * VERTICAL GOLD ACCENT LINE
             * Grows from scaleY 0 → 1 on entry (GPU transform only).
             * Sits left of the text content as an editorial detail.
             */}
            <motion.div
                aria-hidden
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : {}}
                transition={{ duration: isMobile ? 0.6 : 1.1, delay: 0.25, ease: EASE }}
                style={{
                    position: 'absolute',
                    left: 'clamp(1.5rem, 5vw, 5rem)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1px',
                    height: '35%',
                    background: 'linear-gradient(to bottom, transparent, rgba(212,168,83,0.5), transparent)',
                    transformOrigin: 'top center',
                    zIndex: 1,
                    pointerEvents: 'none',
                    willChange: 'transform',
                    display: isMobile ? 'none' : 'block', // hidden on mobile
                }}
            />

            {/* Content — sits above the decorative elements */}
            <div style={{ position: 'relative', zIndex: 2, paddingLeft: isMobile ? '0' : 'clamp(1rem, 2.5vw, 2rem)' }}>

                {/* Overline */}
                <motion.span
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                    style={{
                        display: 'block',
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.58rem',
                        letterSpacing: '0.32em',
                        textTransform: 'uppercase',
                        color: '#D4A853',
                        marginBottom: '1.75rem',
                    }}
                >
                    Our Craft
                </motion.span>

                {/* Heading — line-by-line reveal */}
                <h2
                    style={{
                        fontFamily: 'var(--font-playfair)',
                        fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                        fontWeight: 700,
                        lineHeight: 1.08,
                        letterSpacing: '-0.01em',
                        marginBottom: '2.25rem',
                    }}
                >
                    {/* Line 1 */}
                    <span style={{ display: 'block', overflow: 'hidden' }}>
                        <motion.span
                            initial={{ y: '110%', opacity: 0 }}
                            animate={inView ? { y: '0%', opacity: 1 } : {}}
                            transition={{ duration: isMobile ? 0.6 : 1.0, delay: 0.2, ease: EASE }}
                            style={{ display: 'block', color: '#f6e1a1' }}
                        >
                            Every Stitch
                        </motion.span>
                    </span>
                    {/* Line 2 — italic */}
                    <span style={{ display: 'block', overflow: 'hidden' }}>
                        <motion.span
                            initial={{ y: '110%', opacity: 0 }}
                            animate={inView ? { y: '0%', opacity: 1 } : {}}
                            transition={{ duration: isMobile ? 0.6 : 1.0, delay: isMobile ? 0.25 : 0.49, ease: EASE }}
                            style={{
                                display: 'block',
                                fontStyle: 'italic',
                                background: 'linear-gradient(110deg, #c9992a 0%, #D4A853 40%, #f5e0a0 70%, #D4A853 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Carries a Story.
                        </motion.span>
                    </span>
                </h2>

                {/* Body paragraph */}
                <motion.p
                    initial={{ opacity: 0, y: isMobile ? 12 : 22 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: isMobile ? 0.6 : 0.95, delay: isMobile ? 0.35 : 0.65, ease: EASE }}
                    style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: 'clamp(0.95rem, 1.1vw, 0.95rem)',
                        fontWeight: 300,
                        lineHeight: 1.9,
                        color: 'rgba(201,197,204,0.7)',
                        maxWidth: '36ch',
                        marginBottom: '2.75rem',
                        marginInline: isMobile ? 'auto' : '0',
                    }}
                >
                    At Fabloom, tailoring is more than taking measurements.
                    Every garment reflects craftsmanship, patience and precision.
                    From selecting premium fabrics to the final finishing touch,
                    each piece is created to become part of someone&apos;s story.
                </motion.p>

                {/* Subtle text CTA — not a button, editorial link style */}
                <motion.div
                    initial={{ opacity: 0, y: isMobile ? 8 : 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: isMobile ? 0.5 : 0.85, delay: isMobile ? 0.45 : 0.8, ease: EASE }}
                >
                    <Link
                        href="/stitching"
                        aria-label="Discover our bespoke tailoring"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontFamily: 'var(--font-dm-sans)',
                            fontSize: '0.65rem',
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            color: '#D4A853',
                            textDecoration: 'none',
                            transition: 'opacity 0.3s ease',
                        }}
                        onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.7')}
                        onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
                    >
                        Discover Bespoke Tailoring
                        <span aria-hidden style={{ fontSize: '0.8rem' }}>→</span>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// RIGHT COLUMN — immersive editorial image
// ─────────────────────────────────────────────────────────────────────────────

function CraftImage({ isMobile }: { isMobile: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-60px 0px' });

    return (
        <div
            ref={ref}
            style={{
                position: 'relative',
                width: '100%',
                // Full section height on desktop, restricted to 45vh max on mobile
                height: '100%',
                minHeight: isMobile ? 'clamp(280px, 45vh, 400px)' : 'clamp(420px, 70vh, 820px)',
            }}
        >
            {/*
             * WARM AMBIENT GLOW — behind the image column.
             * Almost invisible — just enough to give the image column warmth
             * and separate it perceptually from the flat navy background.
             */}
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    inset: '-10%',
                    background:
                        'radial-gradient(ellipse at 60% 50%, rgba(212,168,83,0.07) 0%, transparent 65%)',
                    filter: 'blur(50px)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            {/*
             * IMAGE REVEAL — clip-path wipe from bottom, simultaneous scale 1.04→1.
             * clipPath is GPU-composited in modern browsers.
             * The clip reveals the image as if a curtain is being raised.
             */}
            <motion.div
                initial={{ clipPath: 'inset(100% 0% 0% 0%)', scale: 1.04 }}
                animate={
                    inView
                        ? { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }
                        : {}
                }
                transition={{ duration: isMobile ? 0.75 : 1.3, delay: 0.15, ease: EASE }}
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1,
                    willChange: 'clip-path, transform',
                    overflow: 'hidden',
                }}
            >
                {/*
                 * Inner wrapper isolates the subtle hover zoom so clip-path
                 * and scale don't compound on the same element.
                 */}
                <motion.div
                    whileHover={!isMobile ? { scale: 1.025 } : {}}
                    transition={{ duration: 0.9, ease: EASE }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        willChange: 'transform',
                    }}
                >
                    <Image
                        src="/hero-kandoras.png"
                        alt="Master tailor working with fabric — hands, needle, craft"
                        fill
                        sizes="(max-width: 768px) 100vw, 60vw"
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center 20%',
                        }}
                    />

                    {/*
                     * DEPTH VIGNETTES — layered, not one heavy gradient.
                     * Together they give the image studio warmth, not a harsh crop.
                     */}

                    {/* Left edge — blends into text column on desktop */}
                    <div
                        aria-hidden
                        style={{
                            position: 'absolute',
                            inset: '0 auto 0 0',
                            width: '18%',
                            background:
                                'linear-gradient(to right, #0f1035 0%, transparent 100%)',
                            pointerEvents: 'none',
                            zIndex: 2,
                        }}
                    />

                    {/* Bottom — grounds the image */}
                    <div
                        aria-hidden
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '28%',
                            background:
                                'linear-gradient(to top, rgba(10,8,32,0.7) 0%, transparent 100%)',
                            pointerEvents: 'none',
                            zIndex: 2,
                        }}
                    />

                    {/* Top — studio overhead */}
                    <div
                        aria-hidden
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '20%',
                            background:
                                'linear-gradient(to bottom, rgba(10,8,32,0.35) 0%, transparent 100%)',
                            pointerEvents: 'none',
                            zIndex: 2,
                        }}
                    />
                </motion.div>
            </motion.div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// OUR CRAFT — default export
// ─────────────────────────────────────────────────────────────────────────────

export default function OurCraft() {
    const isMobile = useIsMobile();
    
    return (
        <>
            <style>{`
                /*
                 * Section grid: stacked on mobile, split on desktop.
                 * Left: 40%, Right: 60% — image dominates on desktop.
                 */
                .lp-craft-grid {
                    display: flex;
                    flex-direction: column;
                    min-height: clamp(480px, 80vh, 900px);
                }
                @media (min-width: 1024px) {
                    .lp-craft-grid {
                        display: grid;
                        grid-template-columns: 40fr 60fr;
                        align-items: stretch;
                    }
                }
            `}</style>

            <section
                aria-label="Our Craft — Fabloom"
                style={{
                    position: 'relative',
                    background: '#0f1035',
                    overflow: 'hidden',
                    // Generous vertical breathing room above (connects from FeaturedCollections)
                    // and below (connects into Marquee / Bespoke section)
                    paddingTop: 'clamp(4rem, 8vw, 7rem)',
                    paddingBottom: 'clamp(3.5rem, 8vw, 7rem)',
                }}
            >
                {/*
                 * Section-level ambient glow — extremely faint.
                 * Warms the section perceptually without adding a visible shape.
                 */}
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        top: '0%',
                        right: '0%',
                        width: '60%',
                        height: '100%',
                        background:
                            'radial-gradient(ellipse at 70% 50%, rgba(212,168,83,0.04) 0%, transparent 65%)',
                        filter: 'blur(80px)',
                        pointerEvents: 'none',
                        zIndex: 0,
                    }}
                />

                {/* Thin top rule — editorial divider from section above */}
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 'clamp(1.5rem, 5vw, 5rem)',
                        right: 'clamp(1.5rem, 5vw, 5rem)',
                        height: '1px',
                        background:
                            'linear-gradient(to right, transparent, rgba(212,168,83,0.15), transparent)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Grid */}
                <div
                    className="lp-craft-grid"
                    style={{
                        maxWidth: '1440px',
                        margin: '0 auto',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    {/* Left — text */}
                    <CraftText isMobile={isMobile} />

                    {/* Right — image */}
                    <CraftImage isMobile={isMobile} />
                </div>
            </section>
        </>
    );
}
