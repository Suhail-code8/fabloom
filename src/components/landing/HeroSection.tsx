'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    motion,
    useMotionValue,
    useTransform,
    useSpring,
    type Variants,
} from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS  (unchanged from V1)
// ─────────────────────────────────────────────────────────────────────────────

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.14, delayChildren: 0.2 },
    },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
};

const badgeVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
};

const lineReveal: Variants = {
    hidden: { opacity: 0, y: '110%' },
    visible: {
        opacity: 1,
        y: '0%',
        transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] },
    },
};

const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 1.06 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
    },
};

const glowBreath: Variants = {
    initial: { opacity: 0.4, scale: 1 },
    animate: {
        opacity: [0.4, 0.65, 0.4],
        scale: [1, 1.04, 1],
        transition: {
            duration: 6,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
        },
    },
};

const scrollBounce: Variants = {
    initial: { y: 0, opacity: 0.5 },
    animate: {
        y: [0, 8, 0],
        opacity: [0.5, 1, 0.5],
        transition: {
            duration: 2.2,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
        },
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS — Left Column  (typography/spacing refined, not redesigned)
// ─────────────────────────────────────────────────────────────────────────────

function HeroBadge() {
    return (
        <motion.div
            variants={badgeVariants}
            // V2: increased bottom margin for breathing room on mobile
            className="inline-flex items-center gap-3 mb-10 md:mb-12"
        >
            <span
                aria-hidden
                className="block h-px w-8 bg-gradient-to-r from-transparent to-[#D4A853]"
            />
            <span
                className="text-[0.6rem] tracking-[0.28em] uppercase"
                style={{ color: '#D4A853', fontFamily: 'var(--font-dm-sans)' }}
            >
                Digital Haute Couture · Koduvally, Kerala
            </span>
            <span
                aria-hidden
                className="block h-px w-8 bg-gradient-to-l from-transparent to-[#D4A853]"
            />
        </motion.div>
    );
}

function HeroHeading() {
    return (
        <motion.h1
            variants={containerVariants}
            // V2: increased bottom margin
            className="mb-10 md:mb-12"
            style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: '-0.01em',
            }}
        >
            <span className="overflow-hidden block">
                <motion.span
                    variants={lineReveal}
                    className="block"
                    style={{
                        fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)',
                        color: '#f6e1a1',
                    }}
                >
                    Crafted for
                </motion.span>
            </span>

            <span className="overflow-hidden block">
                <motion.span
                    variants={lineReveal}
                    className="block"
                    style={{
                        fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)',
                        fontStyle: 'italic',
                        background:
                            'linear-gradient(110deg, #c9992a 0%, #D4A853 40%, #f5e0a0 70%, #D4A853 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    Modern Elegance.
                </motion.span>
            </span>
        </motion.h1>
    );
}

function HeroBody() {
    return (
        <motion.p
            variants={fadeUp}
            // V2: increased bottom margin
            className="mb-12 md:mb-14 max-w-[38ch]"
            style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: 'clamp(0.875rem, 1.1vw, 1rem)',
                fontWeight: 300,
                lineHeight: 1.85,
                color: 'rgba(201, 197, 204, 0.65)',
            }}
        >
            Rooted in heritage. Refined through craft. Every Kandora is a
            conversation between tradition and precision — made for men who
            dress with intention.
        </motion.p>
    );
}

function HeroActions() {
    return (
        <motion.div
            variants={fadeUp}
            className="flex flex-wrap gap-4 items-center"
        >
            <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
            >
                <Link
                    href="/home"
                    aria-label="Shop the collection"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        border: '1px solid #D4A853',
                        background: '#D4A853',
                        color: '#0f1035',
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.68rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        padding: '1rem 2.25rem',
                        textDecoration: 'none',
                        fontWeight: 500,
                        transition: 'background 0.35s ease, color 0.35s ease, box-shadow 0.35s ease',
                    }}
                    onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.background = '#c9992a';
                        el.style.boxShadow = '0 8px 32px rgba(212,168,83,0.25)';
                    }}
                    onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.background = '#D4A853';
                        el.style.boxShadow = 'none';
                    }}
                >
                    Shop Collection
                    <span aria-hidden style={{ fontSize: '0.75rem', opacity: 0.8 }}>→</span>
                </Link>
            </motion.div>

            <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
            >
                <Link
                    href="/stitching"
                    aria-label="Book bespoke tailoring"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        border: '1px solid rgba(201,197,204,0.25)',
                        color: 'rgba(201,197,204,0.75)',
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.68rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        padding: '1rem 2.25rem',
                        textDecoration: 'none',
                        fontWeight: 400,
                        transition: 'border-color 0.35s ease, color 0.35s ease',
                    }}
                    onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.borderColor = '#D4A853';
                        el.style.color = '#D4A853';
                    }}
                    onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.borderColor = 'rgba(201,197,204,0.25)';
                        el.style.color = 'rgba(201,197,204,0.75)';
                    }}
                >
                    Book Tailoring
                </Link>
            </motion.div>
        </motion.div>
    );
}

function HeroTrustBar() {
    const items = ['500+ Happy Patrons', 'Pan-India Delivery', 'WhatsApp Concierge'];
    return (
        <motion.div
            variants={fadeUp}
            // V2: more top breathing room
            className="flex flex-wrap gap-x-6 gap-y-3 mt-12 md:mt-14"
        >
            {items.map((item, i) => (
                <span
                    key={i}
                    className="flex items-center gap-2"
                    style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.65rem',
                        letterSpacing: '0.12em',
                        color: 'rgba(201,197,204,0.4)',
                        textTransform: 'uppercase',
                    }}
                >
                    <span style={{ color: '#D4A853', fontSize: '0.5rem' }}>✦</span>
                    {item}
                </span>
            ))}
        </motion.div>
    );
}

function ScrollIndicator() {
    return (
        <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-auto"
            style={{ zIndex: 10 }}
            aria-hidden
        >
            <motion.div
                variants={scrollBounce}
                initial="initial"
                animate="animate"
                className="flex flex-col items-center gap-2"
            >
                <span
                    style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.55rem',
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        color: 'rgba(212,168,83,0.5)',
                    }}
                >
                    Scroll
                </span>
                <div
                    style={{
                        width: '1px',
                        height: '40px',
                        background: 'linear-gradient(to bottom, #D4A853, transparent)',
                        opacity: 0.6,
                    }}
                />
            </motion.div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// BACKGROUND CANVAS — V2: third warm glow added behind image column
// ─────────────────────────────────────────────────────────────────────────────

function BackgroundCanvas() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            {/* Base */}
            <div className="absolute inset-0" style={{ background: '#0f1035' }} />

            {/* Top-left warm cream glow — same as V1 */}
            <motion.div
                variants={glowBreath}
                initial="initial"
                animate="animate"
                className="absolute"
                style={{
                    top: '-10%',
                    left: '-5%',
                    width: '55%',
                    height: '70%',
                    background:
                        'radial-gradient(ellipse at center, rgba(212,168,83,0.06) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
            />

            {/* Bottom-right cool depth — same as V1 */}
            <motion.div
                variants={glowBreath}
                initial="initial"
                animate="animate"
                className="absolute"
                style={{
                    bottom: '-15%',
                    right: '0%',
                    width: '45%',
                    height: '60%',
                    background:
                        'radial-gradient(ellipse at center, rgba(30, 40, 100, 0.45) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
            />

            {/* V2 NEW: warm rim light behind image column — right side mid-height */}
            <motion.div
                variants={glowBreath}
                initial="initial"
                animate="animate"
                className="absolute"
                style={{
                    top: '15%',
                    right: '-8%',
                    width: '50%',
                    height: '70%',
                    background:
                        'radial-gradient(ellipse at 30% 50%, rgba(212,168,83,0.055) 0%, transparent 65%)',
                    filter: 'blur(70px)',
                }}
            />

            {/* Grain texture overlay */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '180px 180px',
                    opacity: 0.5,
                    mixBlendMode: 'overlay',
                }}
            />

            {/* Thin horizontal gold rule at top */}
            <div
                className="absolute top-0 left-0 right-0"
                style={{
                    height: '1px',
                    background:
                        'linear-gradient(to right, transparent, rgba(212,168,83,0.2), transparent)',
                }}
            />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO IMAGE — V2 EDITORIAL TREATMENT
// ─────────────────────────────────────────────────────────────────────────────

interface HeroImageProps {
    mouseX: ReturnType<typeof useMotionValue<number>>;
    mouseY: ReturnType<typeof useMotionValue<number>>;
}

function HeroImage({ mouseX, mouseY }: HeroImageProps) {
    // Parallax springs — same as V1
    const imgX = useTransform(mouseX, [-1, 1], [8, -8]);
    const imgY = useTransform(mouseY, [-1, 1], [6, -6]);
    const springX = useSpring(imgX, { stiffness: 40, damping: 18 });
    const springY = useSpring(imgY, { stiffness: 40, damping: 18 });

    return (
        <motion.div
            variants={imageVariants}
            // V2: relative wrapper is the clip boundary
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
            }}
        >
            {/*
             * V2: Outer depth shell — layered box-shadows replace the simple
             * borders. Creates the sense that the image has physical weight.
             * No visible border lines.
             */}
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    inset: 0,
                    // Layered shadows: near shadow (dark) + mid ambient + outer halo
                    boxShadow: `
                        inset 0 0 0 1px rgba(212,168,83,0.08),
                        0 8px 40px rgba(0,0,0,0.55),
                        0 24px 80px rgba(0,0,0,0.35),
                        0 0 120px rgba(212,168,83,0.04)
                    `,
                    zIndex: 5,
                    pointerEvents: 'none',
                }}
            />

            {/*
             * V2: Premium corner accents — L-shaped, not full-rectangle border.
             * Positioned further in from corners to avoid "frame" feel.
             * Opacity lowered to 35% so they read as editorial details, not UI chrome.
             */}
            {/* Top-left */}
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    top: '1.25rem',
                    left: '1.25rem',
                    width: '1.75rem',
                    height: '1.75rem',
                    borderTop: '1px solid rgba(212,168,83,0.35)',
                    borderLeft: '1px solid rgba(212,168,83,0.35)',
                    zIndex: 6,
                    pointerEvents: 'none',
                }}
            />
            {/* Bottom-right */}
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    bottom: '1.25rem',
                    right: '1.25rem',
                    width: '1.75rem',
                    height: '1.75rem',
                    borderBottom: '1px solid rgba(212,168,83,0.35)',
                    borderRight: '1px solid rgba(212,168,83,0.35)',
                    zIndex: 6,
                    pointerEvents: 'none',
                }}
            />

            {/* Float + parallax inner wrapper — clip overflow so image never bleeds */}
            <motion.div
                className="lp-hero-float"
                style={{
                    x: springX,
                    y: springY,
                    position: 'absolute',
                    // V2: extend slightly beyond container so zoom-crop doesn't show edges
                    inset: '-4%',
                    overflow: 'hidden',
                }}
            >
                {/*
                 * V2: objectPosition changed from 'top center' → '50% 12%'
                 * This frames the garment's collar and upper body as the focal point,
                 * giving the model 15-20% more visual presence within the viewport.
                 *
                 * objectFit: 'cover' on an inset:-4% container = effectively ~15% zoom.
                 */}
                <Image
                    src="/hero-kandora.png"
                    alt="Elegantly dressed man in a white Kandora — Fabloom"
                    fill
                    priority
                    quality={94}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    style={{
                        objectFit: 'cover',
                        objectPosition: '50% 12%',
                        // GPU-composited: no layout reflow on transform
                        willChange: 'transform',
                    }}
                />

                {/*
                 * V2: Vignette — softer, multi-stop version.
                 * Bottom fade is kept but shortened (20% → 28%) so more garment shows.
                 * Top fade is NEW: creates studio lighting illusion from above.
                 * Left and right edge fades create the editorial "bleed into page" feel
                 * WITHOUT the heavy white strip that was the left-gradient at 30%.
                 */}
                {/* Bottom fade — blends image into section bg */}
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '32%',
                        background:
                            'linear-gradient(to top, #0f1035 0%, rgba(15,16,53,0.7) 40%, transparent 100%)',
                        pointerEvents: 'none',
                        zIndex: 2,
                    }}
                />

                {/* Top fade — studio lighting from above */}
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '18%',
                        background:
                            'linear-gradient(to bottom, rgba(15,16,53,0.55) 0%, transparent 100%)',
                        pointerEvents: 'none',
                        zIndex: 2,
                    }}
                />

                {/*
                 * V2: Left edge — very subtle, only 12% wide (was 30%).
                 * Just enough to soften the hard cut into the text column on desktop.
                 * Not visible as a distinct strip.
                 */}
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        inset: '0 auto 0 0',
                        width: '12%',
                        background:
                            'linear-gradient(to right, rgba(15,16,53,0.6) 0%, transparent 100%)',
                        pointerEvents: 'none',
                        zIndex: 2,
                    }}
                />

                {/*
                 * V2: Right edge — slight darkening to create depth.
                 * Prevents the image from feeling cropped or floating.
                 */}
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        inset: '0 0 0 auto',
                        width: '8%',
                        background:
                            'linear-gradient(to left, rgba(15,16,53,0.4) 0%, transparent 100%)',
                        pointerEvents: 'none',
                        zIndex: 2,
                    }}
                />

                {/*
                 * V2 SIGNATURE MOMENT — Gold Thread
                 * ─────────────────────────────────
                 * A single 1px horizontal line of gold light draws across the top
                 * edge of the image every 9 seconds. Pure GPU transform (scaleX).
                 * No JavaScript, no requestAnimationFrame. Pure CSS keyframe.
                 *
                 * Reads as: ambient studio light catching the garment's shoulder line.
                 * Subtle enough to feel like it belongs. Distinctive enough to remember.
                 */}
                <div
                    aria-hidden
                    className="lp-gold-thread"
                    style={{
                        position: 'absolute',
                        top: '22%',           // sits at shoulder/collar height
                        left: 0,
                        right: 0,
                        height: '1px',
                        background:
                            'linear-gradient(to right, transparent 0%, rgba(212,168,83,0.0) 15%, rgba(212,168,83,0.55) 40%, rgba(245,224,160,0.8) 50%, rgba(212,168,83,0.55) 60%, rgba(212,168,83,0.0) 85%, transparent 100%)',
                        pointerEvents: 'none',
                        zIndex: 3,
                        transformOrigin: 'left center',
                    }}
                />
            </motion.div>

            {/* Floating editorial badge — same as V1, z-index raised above vignettes */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '1.5rem',
                    zIndex: 10,
                    background: 'rgba(15,16,53,0.8)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(212,168,83,0.18)',
                    padding: '1rem 1.35rem',
                    // V2: subtle shadow under the badge
                    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                }}
            >
                <p
                    style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '0.58rem',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: '#D4A853',
                        marginBottom: '0.3rem',
                    }}
                >
                    New Season
                </p>
                <p
                    style={{
                        fontFamily: 'var(--font-playfair)',
                        fontSize: '1rem',
                        color: '#f6e1a1',
                        fontStyle: 'italic',
                        lineHeight: 1.2,
                    }}
                >
                    Saudi Silhouette
                </p>
            </motion.div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HERO SECTION
// ─────────────────────────────────────────────────────────────────────────────

export default function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const rect = sectionRef.current?.getBoundingClientRect();
        if (!rect) return;
        mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
        mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <>
            <style>{`
                /* ── Float keyframe — GPU only (translateY = composite layer) ── */
                @keyframes lp-hero-float {
                    0%, 100% { transform: translateY(0px); }
                    50%       { transform: translateY(-8px); }
                }
                .lp-hero-float {
                    animation: lp-hero-float 8s ease-in-out infinite;
                    will-change: transform;
                }

                /*
                 * ── SIGNATURE: Gold Thread ──────────────────────────────────────
                 * Draws across the image at shoulder height every 9s.
                 * Uses scaleX (GPU composited, zero layout cost).
                 * Delay: 2.5s after page load so it doesn't compete with entrance.
                 * Duration: 1.8s draw + 7.2s pause = 9s total cycle.
                 */
                @keyframes lp-gold-thread {
                    0%          { transform: scaleX(0); opacity: 0; }
                    4%          { opacity: 1; }
                    20%         { transform: scaleX(1); opacity: 1; }
                    30%         { transform: scaleX(1); opacity: 0; }
                    100%        { transform: scaleX(1); opacity: 0; }
                }
                .lp-gold-thread {
                    transform: scaleX(0);
                    animation: lp-gold-thread 9s ease-in-out 2.5s infinite;
                    will-change: transform, opacity;
                }

                @media (prefers-reduced-motion: reduce) {
                    .lp-hero-float  { animation: none; }
                    .lp-gold-thread { animation: none; opacity: 0; }
                }
            `}</style>

            <section
                ref={sectionRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                aria-label="Hero — Fabloom Kandoras"
                style={{
                    position: 'relative',
                    width: '100%',
                    minHeight: '100dvh',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <BackgroundCanvas />

                {/* ── MAIN CONTENT GRID ── */}
                <div
                    style={{
                        position: 'relative',
                        zIndex: 2,
                        width: '100%',
                        maxWidth: '1440px',
                        margin: '0 auto',
                        // V2: more generous vertical padding on mobile for breathing room
                        padding:
                            'clamp(8rem, 13vw, 10rem) clamp(1.5rem, 5vw, 5rem) clamp(6rem, 9vw, 8rem)',
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: '4rem',
                        alignItems: 'center',
                    }}
                    className="lp-hero-grid"
                >
                    <style>{`
                        @media (min-width: 1024px) {
                            .lp-hero-grid {
                                grid-template-columns: 1fr 1fr !important;
                                gap: 4rem !important;
                            }
                        }
                        @media (min-width: 1280px) {
                            .lp-hero-grid {
                                grid-template-columns: 55fr 45fr !important;
                                gap: 5rem !important;
                            }
                        }
                    `}</style>

                    {/* ── LEFT COLUMN — Content ── */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ display: 'flex', flexDirection: 'column' }}
                    >
                        <HeroBadge />
                        <HeroHeading />
                        <HeroBody />
                        <HeroActions />
                        <HeroTrustBar />
                    </motion.div>

                    {/* ── RIGHT COLUMN — Image ── */}
                    <motion.div
                        variants={imageVariants}
                        initial="hidden"
                        animate="visible"
                        style={{
                            position: 'relative',
                            width: '100%',
                            /*
                             * V2: taller image container — was clamp(420px, 65vh, 780px).
                             * Extra height lets more of the garment show without cropping.
                             * On desktop the grid row alignment handles the rest.
                             */
                            height: 'clamp(520px, 75vh, 860px)',
                        }}
                    >
                        <HeroImage mouseX={mouseX} mouseY={mouseY} />
                    </motion.div>
                </div>

                {/* ── SCROLL INDICATOR ── */}
                <ScrollIndicator />
            </section>
        </>
    );
}
