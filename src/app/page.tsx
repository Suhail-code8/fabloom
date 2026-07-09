import Link from 'next/link';
import Image from 'next/image';
import LandingClient from '@/components/landing/LandingClient';
import HeroSection from '@/components/landing/HeroSection';
import FeaturedCollections from '@/components/landing/FeaturedCollections';
import OurCraft from '@/components/landing/OurCraft';

// ─── DATA ─────────────────────────────────────────────────────────────────────

const RATES = [
    { label: 'Saudi Kandora',   price: '₹850' },
    { label: 'Emirati Kandora', price: '₹1,000' },
    { label: 'Chinese Kandora', price: '₹600' },
    { label: 'Premium Omani',   price: '₹950' },
    { label: 'Premium Fabrics', price: 'From ₹350/m' },
    { label: 'Designer Caps',   price: '₹250' },
];

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
    return (
        <>
            {/* ── STYLES ─────────────────────────────────────────────────────── */}
            <style>{`
                /* Base */
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                html { scroll-behavior: smooth; }
                body { background: #0f1035; color: #c9c5cc; font-family: var(--font-dm-sans, 'DM Sans', sans-serif); overflow-x: hidden; cursor: none; }
                @media (hover: none) { body { cursor: auto; } }

                /* Scrollbar */
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: #0f1035; }
                ::-webkit-scrollbar-thumb { background: #2a1f00; border-radius: 3px; }
                ::-webkit-scrollbar-thumb:hover { background: #c9992a; }

                /* Custom cursor */
                #lp-cursor-dot  { position:fixed; top:0; left:0; width:8px; height:8px; background:#c9992a; border-radius:50%; pointer-events:none; z-index:9999; mix-blend-mode:difference; will-change:transform; }
                #lp-cursor-ring { position:fixed; top:0; left:0; width:36px; height:36px; border:1.5px solid rgba(201,153,42,0.5); border-radius:50%; pointer-events:none; z-index:9998; will-change:transform; transition:width .25s,height .25s,border-color .25s; }
                .lp-cursor-dot--hover  { width:14px!important; height:14px!important; }
                .lp-cursor-ring--hover { width:54px!important; height:54px!important; border-color:#c9992a!important; }
                @media (hover:none) { #lp-cursor-dot, #lp-cursor-ring { display:none; } }

                /* Fade animation */
                .lp-fade { opacity:0; transform:translateY(28px); transition:opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1); }
                .lp-fade.lp-visible { opacity:1; transform:translateY(0); }
                .lp-fade-d1 { transition-delay:.15s; }
                .lp-fade-d2 { transition-delay:.3s; }
                .lp-fade-d3 { transition-delay:.45s; }

                /* Glass */
                .lp-glass { background:rgba(15,16,53,0.55); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:1px solid rgba(212,168,83,0.18); }

                /* Nav */
                #lp-top-nav { position:fixed; top:0; width:100%; z-index:50; backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); transition:background .4s, border .4s; }

                /* Mobile nav */
                #lp-mobile-nav { position:fixed; inset:0; z-index:60; background:#0f1035; transform:translateX(-100%); transition:transform .55s cubic-bezier(.22,1,.36,1); display:flex; flex-direction:column; padding:3rem; gap:2rem; border-right:1px solid rgba(72,70,76,0.2); }

                /* Sections */
                .lp-section-gap { padding-top:8rem; padding-bottom:8rem; }
                @media (min-width:768px) { .lp-section-gap { padding-top:10rem; padding-bottom:10rem; } }

                /* Hover grayscale collections */
                .lp-collection-img { filter:grayscale(100%); transition:filter 1s ease, transform 2s cubic-bezier(.22,1,.36,1); }
                .lp-collection-card:hover .lp-collection-img { filter:grayscale(0%); transform:scale(1.05); }

                /* Gold line animated */
                .lp-gold-line { width:1px; height:6rem; background:linear-gradient(to bottom,#c9992a,transparent); }

                /* Keyframes */
                @keyframes lp-spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
                @keyframes lp-blink { 0%,100% { opacity:1; } 50% { opacity:.3; } }
                @keyframes lp-rise { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
                @keyframes lp-shimmer { from { background-position:200% center; } to { background-position:-200% center; } }

                /* CTA Buttons */
                .lp-btn-gold { display:inline-flex; align-items:center; gap:.75rem; border:1px solid #D4A853; color:#D4A853; font-family:var(--font-dm-sans,'DM Sans',sans-serif); font-size:.7rem; letter-spacing:.2em; text-transform:uppercase; padding:.9rem 2rem; transition:background .45s, color .45s; }
                .lp-btn-gold:hover { background:#D4A853; color:#0f1035; }
                .lp-btn-ghost { display:inline-flex; align-items:center; gap:.75rem; border:1px solid rgba(72,70,76,.4); color:rgba(201,197,204,.7); font-family:var(--font-dm-sans,'DM Sans',sans-serif); font-size:.7rem; letter-spacing:.2em; text-transform:uppercase; padding:.9rem 2rem; transition:border-color .45s, color .45s; }
                .lp-btn-ghost:hover { border-color:#D4A853; color:#D4A853; }

                /* Stats */
                .lp-stat-num { font-family:var(--font-playfair,'Playfair Display',serif); font-size:clamp(3.5rem,8vw,6rem); font-weight:700; color:#f3bf4d; line-height:1; }

                /* Footer */
                .lp-footer { border-top:1px solid rgba(72,70,76,.15); }
                .lp-footer-link { color:rgba(201,197,204,.5); font-size:.85rem; letter-spacing:.06em; transition:color .3s; }
                .lp-footer-link:hover { color:#f3bf4d; }
            `}</style>

            {/* Cursor */}
            <div id="lp-cursor-dot" aria-hidden />
            <div id="lp-cursor-ring" aria-hidden />

            {/* ── MOBILE SIDE NAV ──────────────────────────────────────────────── */}
            <nav id="lp-mobile-nav" aria-label="Mobile navigation">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.1rem', color: '#f3bf4d', letterSpacing: '.06em' }}>
                        Fabloom Kandoras
                    </span>
                    <button id="lp-close-menu" aria-label="Close menu" style={{ color: '#f3bf4d', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'none' }}>
                        ✕
                    </button>
                </div>
                <p style={{ fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(201,197,204,.5)' }}>Digital Flagship · Koduvally</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem', flexGrow: 1 }}>
                    {[
                        { label: 'Store Home', href: '/home' },
                        { label: 'Readymade', href: '/readymade' },
                        { label: 'Custom Stitching', href: '/stitching' },
                        { label: 'Fabrics', href: '/fabrics' },
                        { label: 'Perfumes', href: '/perfumes' },
                        { label: 'About Us', href: '/about' },
                    ].map(({ label, href }) => (
                        <Link key={label} href={href} style={{ color: 'rgba(201,197,204,.7)', fontSize: '1.1rem', textDecoration: 'none', letterSpacing: '.04em', transition: 'color .3s' }}>
                            {label}
                        </Link>
                    ))}
                </div>
                <div style={{ marginTop: 'auto' }}>
                    <Link href="/stitching" className="lp-btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
                        Commission a Piece
                    </Link>
                </div>
            </nav>

            {/* ── TOP NAV ──────────────────────────────────────────────────────── */}
            <header id="lp-top-nav">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', maxWidth: '1440px', margin: '0 auto' }}>
                    {/* Left — desktop links */}
                    <div style={{ flex: 1 }}>
                        <div className="lp-desktop-links" style={{ display: 'flex', gap: '2rem' }}>
                            {[
                                ['Collections', '/home'],
                                ['Readymade', '/readymade'],
                                ['Fabrics', '/fabrics'],
                                ['Stitching', '/stitching'],
                            ].map(([label, href]) => (
                                <Link key={label} href={href} style={{ fontSize: '.65rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(201,197,204,.6)', textDecoration: 'none', transition: 'color .3s' }}>
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Centre — brand */}
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <Link href="/" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1rem', color: '#f3bf4d', letterSpacing: '.1em', textDecoration: 'none', textTransform: 'uppercase' }}>
                            Fabloom Kandoras
                        </Link>
                    </div>

                    {/* Right — CTA + hamburger */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem' }}>
                        <Link href="/home" style={{ fontSize: '.65rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#f3bf4d', textDecoration: 'none', display: 'none' }} className="lp-nav-cta">
                            Enter Store
                        </Link>
                        <button id="lp-open-menu" aria-label="Open menu" style={{ background: 'none', border: 'none', color: '#f3bf4d', cursor: 'none', lineHeight: 1 }}>
                            <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                                <line x1="0" y1="1" x2="22" y2="1" stroke="#f3bf4d" strokeWidth="1.4"/>
                                <line x1="4" y1="8" x2="22" y2="8" stroke="#f3bf4d" strokeWidth="1.4"/>
                                <line x1="8" y1="15" x2="22" y2="15" stroke="#f3bf4d" strokeWidth="1.4"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* ── HERO ─────────────────────────────────────────────────────────── */}
            <HeroSection />

            {/* ── FEATURED COLLECTIONS ───────────────────────────────── */}
            <FeaturedCollections />

            {/* ── OUR CRAFT ─────────────────────────────────────────── */}
            <OurCraft />

            {/* ── MARQUEE ──────────────────────────────────────────────────────── */}
            <div style={{ overflow: 'hidden', borderTop: '1px solid rgba(201,153,42,.1)', borderBottom: '1px solid rgba(201,153,42,.1)', background: 'rgba(201,153,42,.03)', padding: '.7rem 0' }} aria-hidden>
                <div style={{ display: 'flex', width: 'max-content', animation: 'lp-marquee 30s linear infinite' }}>
                    {[...Array(3)].flatMap((_, arrayIndex) =>
                        ['Saudi Kandora','Emirati Kandora','Premium Fabrics','Custom Stitching','Arabian Perfumes','Prayer Caps','Pan-India Delivery','WhatsApp Support'].map((item, i) => (
                            <span key={`${item}-${i}-${arrayIndex}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '0 1.2rem', fontSize: '.62rem', letterSpacing: '.3em', textTransform: 'uppercase', color: '#f3bf4d', whiteSpace: 'nowrap' }}>
                                {item}
                                <span style={{ color: '#c9992a' }}>✦</span>
                            </span>
                        ))
                    )}
                </div>
                <style>{`@keyframes lp-marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }`}</style>
            </div>

            {/* ── THE HOUSE ─────────────────────────────────────────────────────── */}
            <section className="lp-section-gap" style={{ background: '#0f1035', padding: '8rem 1.5rem' }}>
                <style>{`
                    @media (min-width: 1024px) {
                        .lp-house-grid { grid-template-columns: 1fr 1fr !important; gap: 6rem !important; }
                    }
                `}</style>
                <div className="lp-house-grid" style={{ maxWidth: '1440px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', alignItems: 'center' }}>
                    <div className="lp-fade" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <span style={{ fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase', color: '#D4A853', display: 'block', marginBottom: '1rem' }}>Heritage &amp; Precision</span>
                        <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.2rem,5vw,3.5rem)', fontWeight: 700, lineHeight: 1.1, color: '#f6e1a1', marginBottom: '1.5rem' }}>
                            Crafted in Silence.<br/>
                            <span style={{ color: '#D4A853', fontStyle: 'italic' }}>Worn with Presence.</span>
                        </h2>
                        <p style={{ color: 'rgba(201,197,204,.65)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '540px', marginBottom: '2rem', fontWeight: 300 }}>
                            Rooted in the rich tapestry of Islamic fashion, Fabloom crafts garments that are more than mere attire — they are statements of identity and intent. Every stitch a testament to our dedication to the art of tailoring.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <Link href="/about" className="lp-btn-ghost">Our Story →</Link>
                            <Link href="/home" className="lp-btn-gold">View Collection →</Link>
                        </div>
                    </div>
                    <div className="lp-fade lp-fade-d1" style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
                        <Image src="/hero-tailor.png" alt="Master tailor atelier workspace" fill style={{ objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: '16px', border: '1px solid rgba(212,168,83,.25)', pointerEvents: 'none' }} />
                        {/* Decorative corner accents */}
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '2rem', height: '2rem', borderTop: '2px solid #D4A853', borderLeft: '2px solid #D4A853' }} />
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '2rem', height: '2rem', borderBottom: '2px solid #D4A853', borderRight: '2px solid #D4A853' }} />
                    </div>
                </div>
            </section>

            {/* ── COLLECTIONS ───────────────────────────────────────────────────── */}
            <section style={{ background: '#0a0820', padding: '8rem 0' }}>
                <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center', marginBottom: '5rem' }} className="lp-fade">
                    <span style={{ fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase', color: '#D4A853', display: 'block', marginBottom: '1rem' }}>Curated Portfolios</span>
                    <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, color: '#f6e1a1' }}>The Collections</h2>
                </div>

                {/* Saudi */}
                <div className="lp-collection-card lp-fade" style={{ display: 'flex', flexDirection: 'column', marginBottom: '6rem', cursor: 'none' }}>
                    <div style={{ position: 'relative', width: '100%', height: '70vh', overflow: 'hidden' }}>
                        <Image src="/hero-kandora.png" alt="Saudi Edition Kandora" fill className="lp-collection-img" style={{ objectFit: 'cover', objectPosition: 'top' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,16,53,.2)' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 2rem' }} className="lp-glass">
                            <span style={{ display: 'inline-block', border: '1px solid rgba(212,168,83,.4)', color: '#D4A853', fontSize: '.6rem', letterSpacing: '.15em', padding: '.25rem .75rem', marginBottom: '.75rem' }}>STRUCTURED</span>
                            <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.5rem', color: '#f6e1a1' }}>The Saudi Silhouette</h3>
                        </div>
                    </div>
                    <div style={{ padding: '2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <p style={{ color: 'rgba(201,197,204,.6)', fontSize: '.9rem', lineHeight: 1.7, maxWidth: '480px' }}>Defined by its sharp collar and commanding presence. An exercise in powerful minimalism.</p>
                        <Link href="/readymade" className="lp-btn-gold" style={{ flexShrink: 0 }}>Explore →</Link>
                    </div>
                </div>

                {/* Emirati */}
                <div className="lp-collection-card lp-fade lp-fade-d1" style={{ display: 'flex', flexDirection: 'column', cursor: 'none' }}>
                    <div style={{ position: 'relative', width: '100%', height: '70vh', overflow: 'hidden' }}>
                        <Image src="/hero-emirati.png" alt="Emirati Edition Kandora" fill className="lp-collection-img" style={{ objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,16,53,.2)' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 2rem' }} className="lp-glass">
                            <span style={{ display: 'inline-block', border: '1px solid rgba(212,168,83,.4)', color: '#D4A853', fontSize: '.6rem', letterSpacing: '.15em', padding: '.25rem .75rem', marginBottom: '.75rem' }}>FLUID</span>
                            <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.5rem', color: '#f6e1a1' }}>The Emirati Fluidity</h3>
                        </div>
                    </div>
                    <div style={{ padding: '2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <p style={{ color: 'rgba(201,197,204,.6)', fontSize: '.9rem', lineHeight: 1.7, maxWidth: '480px' }}>Collarless design and elegant tassel — relaxed yet profoundly sophisticated.</p>
                        <Link href="/readymade" className="lp-btn-gold" style={{ flexShrink: 0 }}>Explore →</Link>
                    </div>
                </div>
            </section>

            {/* ── FABRIC STORY ──────────────────────────────────────────────────── */}
            <section style={{ position: 'relative', width: '100%', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                    <Image src="/hero-fabric.png" alt="Premium woven fabric close-up" fill style={{ objectFit: 'cover', opacity: .65 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0f1035, rgba(15,16,53,.6), #0f1035)' }} />
                </div>
                <div className="lp-fade lp-glass" style={{ position: 'relative', zIndex: 1, maxWidth: '520px', margin: '1.5rem', padding: '3rem 2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1.25rem' }}>🧵</div>
                    <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: '#f6e1a1', marginBottom: '1rem' }}>The Weight of Quality</h2>
                    <p style={{ color: 'rgba(201,197,204,.6)', fontSize: '.9rem', lineHeight: 1.8, marginBottom: '2rem', fontWeight: 300 }}>
                        We source exclusively from mills that understand the balance between breathability and drape. Japanese cottons, Chinese silks — selected for how they behave in motion.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '.5rem' }}>
                        {['Silk', 'Linen', 'Cotton', 'Wool Blend'].map((f) => (
                            <span key={f} style={{ border: '1px solid rgba(212,168,83,.3)', color: 'rgba(201,197,204,.6)', fontSize: '.6rem', letterSpacing: '.15em', textTransform: 'uppercase', padding: '.35rem .85rem' }}>{f}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── BESPOKE STITCHING ──────────────────────────────────────────────── */}
            <section style={{ background: '#0f1035', padding: '8rem 1.5rem' }}>
                <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
                    {/* Section header */}
                    <div className="lp-fade" style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <span style={{ fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase', color: '#D4A853', display: 'block', marginBottom: '1rem' }}>Custom Commission</span>
                        <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem,5vw,3rem)', color: '#D4A853', marginBottom: '1rem' }}>Bespoke Stitching</h2>
                        <p style={{ color: 'rgba(201,197,204,.5)', fontSize: '.9rem', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto' }}>The ultimate expression of personal style. Commission a piece tailored perfectly to your measurements and fabric choice.</p>
                    </div>

                    {/* Desktop 3-column grid: image | rate table | description+CTA */}
                    <div className="lp-fade lp-fade-d1 lp-bespoke-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', alignItems: 'start' }}>
                        <style>{`
                            @media (min-width: 1024px) {
                                .lp-bespoke-grid { grid-template-columns: 1.1fr 1fr 0.9fr !important; gap: 3.5rem !important; align-items: center !important; }
                            }
                        `}</style>

                        {/* Column 1 — Tailor image */}
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden' }}>
                            <Image src="/hero-tailor.png" alt="Bespoke tailoring atelier" fill style={{ objectFit: 'cover', filter: 'grayscale(50%)' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,16,53,.65), transparent 60%)' }} />
                            <div style={{ position: 'absolute', top: '1rem', left: '1rem', width: '1.75rem', height: '1.75rem', borderTop: '2px solid #D4A853', borderLeft: '2px solid #D4A853' }} />
                            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', width: '1.75rem', height: '1.75rem', borderBottom: '2px solid #D4A853', borderRight: '2px solid #D4A853' }} />
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem 1.5rem' }}>
                                <span style={{ display: 'inline-block', border: '1px solid rgba(212,168,83,.4)', color: '#D4A853', fontSize: '.58rem', letterSpacing: '.15em', padding: '.25rem .7rem', marginBottom: '.5rem' }}>ATELIER CRAFTSMANSHIP</span>
                                <p style={{ color: 'rgba(201,197,204,.75)', fontSize: '.82rem', lineHeight: 1.6 }}>Measured. Fitted. Perfected.</p>
                            </div>
                        </div>

                        {/* Column 2 — Rate card table */}
                        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(212,168,83,.12)', padding: '2rem' }}>
                            <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.1rem', color: '#f6e1a1', marginBottom: '1.5rem', letterSpacing: '.04em' }}>Pricing Guide</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                {RATES.map((r, i) => (
                                    <div key={r.label} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '.95rem .25rem',
                                        borderBottom: i < RATES.length - 1 ? '1px solid rgba(212,168,83,.1)' : 'none',
                                    }}>
                                        <span style={{ color: 'rgba(201,197,204,.75)', fontSize: '.88rem' }}>{r.label}</span>
                                        <span style={{ fontFamily: 'var(--font-playfair)', color: '#D4A853', fontSize: '1rem', fontWeight: 600 }}>{r.price}</span>
                                    </div>
                                ))}
                            </div>
                            <p style={{ marginTop: '1.25rem', fontSize: '.72rem', color: 'rgba(201,197,204,.35)', letterSpacing: '.06em' }}>* Prices vary by fabric & complexity. WhatsApp for exact quote.</p>
                        </div>

                        {/* Column 3 — Description + CTA */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.4rem,2.5vw,1.9rem)', color: '#f6e1a1', lineHeight: 1.2, marginBottom: '1.25rem' }}>
                                    Your Vision,<br/>
                                    <span style={{ fontStyle: 'italic', color: '#D4A853' }}>Our Craft.</span>
                                </h3>
                                <p style={{ color: 'rgba(201,197,204,.55)', fontSize: '.9rem', lineHeight: 1.8, marginBottom: '1rem' }}>
                                    From the first measurement to the final fitting, every commission is a personal journey. Choose your fabric, silhouette, and embellishments.
                                </p>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                                    {['Made-to-measure precision', 'Fabric consultation included', 'WhatsApp progress updates', 'Pan-India delivery available'].map((pt) => (
                                        <li key={pt} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', color: 'rgba(201,197,204,.6)', fontSize: '.85rem' }}>
                                            <span style={{ color: '#D4A853', fontSize: '.6rem' }}>✦</span>
                                            {pt}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Link href="/stitching" className="lp-btn-gold" style={{ alignSelf: 'flex-start' }}>Book a Commission →</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PERFUMES ──────────────────────────────────────────────────────── */}
            <section style={{ background: '#0a0820', padding: '8rem 1.5rem' }}>
                <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
                    <div className="lp-fade" style={{ position: 'relative', width: '100%', height: '55vh', overflow: 'hidden', marginBottom: '3rem' }}>
                        <Image src="/hero-perfume.png" alt="Arabian Oud perfume bottle" fill style={{ objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a0820 0%, transparent 60%)' }} />
                    </div>
                    <div className="lp-fade lp-fade-d1" style={{ textAlign: 'center', marginTop: '-4rem', position: 'relative', zIndex: 2 }}>
                        <span style={{ fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase', color: '#D4A853', display: 'block', marginBottom: '1rem' }}>Olfactory Elegance</span>
                        <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem,5vw,3rem)', color: '#D4A853', marginBottom: '1.25rem' }}>Arabian Perfumes</h2>
                        <p style={{ color: 'rgba(201,197,204,.6)', fontSize: '.95rem', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto 2rem', fontWeight: 300 }}>
                            Complete the ensemble. Deep resonant Ouds and warm musks designed to linger — leaving an unforgettable impression.
                        </p>
                        <Link href="/perfumes" className="lp-btn-gold">Explore Perfumes →</Link>
                    </div>
                </div>
            </section>

            {/* ── CAPS & ACCESSORIES ─────────────────────────────────────────────── */}
            <section style={{ background: '#0f1035', padding: '8rem 1.5rem' }}>
                <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
                    {/* Full-width visual banner */}
                    <div className="lp-fade" style={{ position: 'relative', width: '100%', height: '50vh', overflow: 'hidden', marginBottom: '0' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0f1035 0%, #1a1060 50%, #0f1035 100%)' }} />
                        {/* Decorative geometric pattern */}
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4rem', opacity: .12 }}>
                            {[...Array(7)].map((_, i) => (
                                <div key={i} style={{ width: '180px', height: '180px', border: '1px solid #D4A853', borderRadius: '50%', transform: `scale(${0.5 + i * 0.18})`, position: 'absolute' }} />
                            ))}
                        </div>
                        {/* Central icon display */}
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 24px rgba(212,168,83,.4))' }}>🧢</div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ width: '40px', height: '1px', background: '#D4A853', opacity: .5 }} />
                                <span style={{ fontSize: '.58rem', letterSpacing: '.3em', textTransform: 'uppercase', color: '#D4A853' }}>Premium Hardware</span>
                                <div style={{ width: '40px', height: '1px', background: '#D4A853', opacity: .5 }} />
                            </div>
                        </div>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0f1035 0%, transparent 60%)' }} />
                    </div>

                    {/* Content: text + feature grid */}
                    <div className="lp-fade lp-fade-d1" style={{ marginTop: '-3rem', position: 'relative', zIndex: 2 }}>
                        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                            <span style={{ fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase', color: '#D4A853', display: 'block', marginBottom: '1rem' }}>Complete the Look</span>
                            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem,5vw,3rem)', color: '#D4A853', marginBottom: '1.25rem' }}>Caps &amp; Accessories</h2>
                            <p style={{ color: 'rgba(201,197,204,.6)', fontSize: '.95rem', lineHeight: 1.8, maxWidth: '520px', margin: '0 auto', fontWeight: 300 }}>
                                Elevate every ensemble. Our designer caps and curated hardware accessories are crafted to complement the Kandora aesthetic — precise, purposeful, premium.
                            </p>
                        </div>

                        {/* Feature cards grid */}
                        <div className="lp-caps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                            <style>{`
                                @media (min-width: 768px) { .lp-caps-grid { grid-template-columns: repeat(4, 1fr) !important; } }
                            `}</style>
                            {[
                                { icon: '🧢', label: 'Prayer Caps', desc: 'Embroidered cotton & lace', price: 'From ₹180' },
                                { icon: '✦',  label: 'Designer Caps', desc: 'Structured Kandora-matched', price: '₹250' },
                                { icon: '📿', label: 'Tasbeeh Beads', desc: 'Sandalwood & resin', price: 'From ₹150' },
                                { icon: '🪡', label: 'Fabric Buttons', desc: 'Pearlescent & metallic', price: 'From ₹40/set' },
                            ].map((item) => (
                                <div key={item.label} className="lp-glass" style={{ padding: '2rem 1.5rem', textAlign: 'center', transition: 'border-color .3s, transform .3s' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.icon}</div>
                                    <h4 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1rem', color: '#f6e1a1', marginBottom: '.4rem' }}>{item.label}</h4>
                                    <p style={{ color: 'rgba(201,197,204,.5)', fontSize: '.78rem', lineHeight: 1.5, marginBottom: '.75rem' }}>{item.desc}</p>
                                    <span style={{ fontFamily: 'var(--font-playfair)', color: '#D4A853', fontSize: '.9rem', fontWeight: 600 }}>{item.price}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <Link href="/home" className="lp-btn-gold">Browse Accessories →</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATS ─────────────────────────────────────────────────────────── */}
            <section style={{ background: '#0f1035', padding: '8rem 1.5rem', borderTop: '1px solid rgba(212,168,83,.08)', borderBottom: '1px solid rgba(212,168,83,.08)' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', textAlign: 'center' }} className="lp-fade">
                    <div>
                        <span className="lp-stat-num" data-count-target="500" data-count-suffix="+">500+</span>
                        <span style={{ display: 'block', fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(201,197,204,.5)', marginTop: '.75rem' }}>Happy Patrons</span>
                    </div>
                    <div>
                        <span className="lp-stat-num" data-count-target="29" data-count-suffix="">29</span>
                        <span style={{ display: 'block', fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(201,197,204,.5)', marginTop: '.75rem' }}>Exclusive Designs</span>
                    </div>
                    <div>
                        <span className="lp-stat-num" data-count-target="8" data-count-suffix="">8</span>
                        <span style={{ display: 'block', fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(201,197,204,.5)', marginTop: '.75rem' }}>Garment Types</span>
                    </div>
                    <div>
                        <span className="lp-stat-num" data-count-target="365" data-count-suffix="">365</span>
                        <span style={{ display: 'block', fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(201,197,204,.5)', marginTop: '.75rem' }}>Days Open</span>
                    </div>
                </div>
            </section>

            {/* ── VISIT / CONTACT ────────────────────────────────────────────────── */}
            <section style={{ background: '#0a0820', padding: '8rem 1.5rem' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }} className="lp-glass lp-fade">
                    <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#D4A853', marginBottom: '1rem' }}>Concierge &amp; Location</h2>
                    <p style={{ color: 'rgba(201,197,204,.55)', fontSize: '.9rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                        Visit our atelier in Koduvally, Kerala, or connect with our digital concierge for remote consultations and custom orders.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {[
                            { icon: '📍', label: 'Koduvally, Kerala 673572', href: '#' },
                            { icon: '📞', label: '+91 95440 73317', href: 'tel:+919544073317' },
                            { icon: '💬', label: 'WhatsApp Concierge', href: 'https://wa.me/919544073317' },
                        ].map(({ icon, label, href }) => (
                            <a key={label} href={href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.75rem', color: 'rgba(201,197,204,.7)', fontSize: '.9rem', textDecoration: 'none', transition: 'color .3s' }}>
                                <span>{icon}</span>
                                <span style={{ borderBottom: '1px solid rgba(72,70,76,.3)', paddingBottom: '.2rem' }}>{label}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
            <section style={{ height: '85vh', background: '#0f1035', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
                {/* Glow */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: '600px', height: '600px', marginTop: '-300px', marginLeft: '-300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,168,83,.12), transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: '350px', height: '350px', marginTop: '-175px', marginLeft: '-175px', borderRadius: '50%', border: '1px solid rgba(212,168,83,.12)', animation: 'lp-breathe 4s ease-in-out infinite', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: '500px', height: '500px', marginTop: '-250px', marginLeft: '-250px', borderRadius: '50%', border: '1px solid rgba(212,168,83,.07)', animation: 'lp-breathe 4s 1s ease-in-out infinite', pointerEvents: 'none' }} />
                <style>{`@keyframes lp-breathe { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.7;} 50%{transform:translate(-50%,-50%) scale(1.05);opacity:1;} }`}</style>
                <div className="lp-fade" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.5rem,8vw,5.5rem)', fontWeight: 900, lineHeight: .95, color: '#f6e1a1', marginBottom: '1.5rem' }}>
                        Dress With<br/>
                        <span style={{
                            fontStyle: 'italic',
                            background: 'linear-gradient(135deg,#c9992a,#f3bf4d,#f5e0a0,#c9992a)',
                            backgroundSize: '300% auto',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            animation: 'lp-shimmer 5s linear infinite',
                        }}>Intention.</span>
                    </h2>
                    <p style={{ color: 'rgba(201,197,204,.45)', fontSize: '.95rem', marginBottom: '3rem', fontWeight: 300 }}>Every stitch, every thread — crafted with purpose.</p>
                    <Link href="/home" className="lp-btn-gold" style={{ fontSize: '.8rem', padding: '1.1rem 3rem' }}>Enter the Store →</Link>
                    <div style={{ marginTop: '1.5rem' }}>
                        <Link href="/home" style={{ color: 'rgba(201,197,204,.3)', fontSize: '.75rem', letterSpacing: '.08em', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
                            Already a customer? Go to store →
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
            <footer className="lp-footer" style={{ background: '#0f1035', padding: '4rem 1.5rem 2rem' }}>
                <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
                    <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#f3bf4d', fontStyle: 'italic', textAlign: 'center', marginBottom: '3rem' }}>
                        Fabloom Kandoras
                    </h2>
                    <nav style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem 2.5rem', marginBottom: '3rem' }} aria-label="Footer navigation">
                        {[
                            ['Readymade', '/readymade'],
                            ['Fabrics', '/fabrics'],
                            ['Stitching', '/stitching'],
                            ['Perfumes', '/perfumes'],
                            ['About', '/about'],
                            ['Privacy', '/privacy'],
                            ['Terms', '/terms'],
                        ].map(([label, href]) => (
                            <Link key={label} href={href} className="lp-footer-link">{label}</Link>
                        ))}
                    </nav>
                    {/* Socials */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                        <a href="https://www.instagram.com/fabloomkandoras/" target="_blank" rel="noreferrer" aria-label="Instagram" style={{ width: '38px', height: '38px', border: '1px solid rgba(72,70,76,.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(201,197,204,.4)', textDecoration: 'none', fontSize: '.9rem', transition: 'border-color .3s, color .3s' }}>IG</a>
                        <a href="https://www.facebook.com/profile.php?id=61584037474921" target="_blank" rel="noreferrer" aria-label="Facebook" style={{ width: '38px', height: '38px', border: '1px solid rgba(72,70,76,.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(201,197,204,.4)', textDecoration: 'none', fontSize: '.9rem', transition: 'border-color .3s, color .3s' }}>FB</a>
                        <a href="https://wa.me/919544073317" target="_blank" rel="noreferrer" aria-label="WhatsApp" style={{ width: '38px', height: '38px', border: '1px solid rgba(72,70,76,.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(201,197,204,.4)', textDecoration: 'none', fontSize: '.9rem', transition: 'border-color .3s, color .3s' }}>WA</a>
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '.6rem', letterSpacing: '.1em', color: 'rgba(72,70,76,.8)', borderTop: '1px solid rgba(72,70,76,.1)', paddingTop: '1.5rem' }}>
                        © 2025 Fabloom Kandoras · All rights reserved · Koduvally, Kerala 673572
                    </p>
                </div>
            </footer>

            {/* Client-side interactivity */}
            <LandingClient />
        </>
    );
}
