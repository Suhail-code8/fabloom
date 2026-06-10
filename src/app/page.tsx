import Link from 'next/link';
import LandingClient from '@/components/landing/LandingClient';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface StatItem { value: number; label: string; suffix: string }
interface RateRow { label: string; price: string }
interface Category { emoji: string; title: string; sub: string; tag: string; href: string; bg: string }

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const STATS: StatItem[] = [
    { value: 500, label: 'Happy Customers', suffix: '+' },
    { value: 8,   label: 'Garment Types',   suffix: '' },
    { value: 29,  label: 'Products Online', suffix: '' },
    { value: 365, label: 'Days Open',       suffix: '' },
];

const RATES: RateRow[] = [
    { label: 'Saudi Kandora',   price: '₹850' },
    { label: 'Emirati Kandora', price: '₹1,000' },
    { label: 'Chinese Kandora', price: '₹600' },
    { label: 'Jubba',           price: '₹350' },
    { label: 'Pleat Jubba',     price: '₹400' },
    { label: 'Kurta',           price: '₹350' },
    { label: 'Pleat Kandora',   price: '₹600' },
    { label: 'Shirt',           price: '₹350' },
];

const CATEGORIES: Category[] = [
    { emoji: '👘', title: 'Readymade', sub: 'Kandoras · Kurthas · Thobes', tag: 'Shop now', href: '/readymade', bg: 'linear-gradient(160deg,#0e1a33 0%,#0a1020 100%)' },
    { emoji: '🧵', title: 'Fabrics', sub: 'Cotton · Linen · Silk blends', tag: 'Per meter', href: '/fabrics', bg: 'linear-gradient(160deg,#1a0e0e 0%,#2a0a0a 100%)' },
    { emoji: '✂️', title: 'Stitching', sub: 'Custom tailoring · Measurements', tag: 'From ₹350', href: '/stitching', bg: 'linear-gradient(160deg,#0a1a0e 0%,#061308 100%)' },
    { emoji: '🌸', title: 'Perfumes', sub: 'Oud · Musk · Arabian blends', tag: 'Shop now', href: '/perfumes', bg: 'linear-gradient(160deg,#1a0a1a 0%,#120820 100%)' },
    { emoji: '🎩', title: 'Caps & More', sub: 'Prayer caps · Accessories', tag: 'Browse all', href: '/caps', bg: 'linear-gradient(160deg,#0a1a18 0%,#060e0d 100%)' },
];

const MARQUEE_ITEMS = [
    'Saudi Kandora', 'Emirati Kandora', 'Premium Fabrics', 'Custom Stitching',
    'Arabian Perfumes', 'Prayer Caps', 'Pan-India Delivery', 'WhatsApp Support',
];

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function LandingPage() {
    return (
        <>
            <style>{`
                /* ─── CSS VARS ─── */
                :root {
                    --ink: #05040f;
                    --navy: #0a0820;
                    --gold: #c9992a;
                    --gold2: #e8c060;
                    --gold3: #f5e0a0;
                    --muted: rgba(255,255,255,0.45);
                    --smoke: rgba(255,255,255,0.04);
                }

                /* ─── RESET / BASE ─── */
                .lp-wrap { background: var(--navy); color: #fff; font-family: var(--font-dm-sans, var(--font-inter, sans-serif)); overflow-x: hidden; cursor: none; }
                @media (hover: none) { .lp-wrap { cursor: auto; } }

                /* ─── NOISE ─── */
                .lp-noise { position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: 0.025; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 200px; }

                /* ─── CURSOR ─── */
                .lp-cursor-dot { position: fixed; top: 0; left: 0; width: 8px; height: 8px; background: var(--gold); border-radius: 50%; pointer-events: none; z-index: 9999; mix-blend-mode: difference; transition: width .2s, height .2s; }
                .lp-cursor-ring { position: fixed; top: 0; left: 0; width: 36px; height: 36px; border: 1.5px solid rgba(201,153,42,0.6); border-radius: 50%; pointer-events: none; z-index: 9998; transition: width .2s, height .2s, border-color .2s; }
                .lp-cursor-dot--hover { width: 12px; height: 12px; }
                .lp-cursor-ring--hover { width: 48px; height: 48px; border-color: var(--gold); }
                @media (hover: none) { .lp-cursor-dot, .lp-cursor-ring { display: none; } }

                /* ─── HERO ─── */
                .lp-hero { position: relative; min-height: 100svh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; overflow: hidden; }
                .lp-canvas { position: absolute; inset: 0; z-index: 0; }
                .lp-hero-grad { position: absolute; inset: 0; z-index: 1; background: radial-gradient(ellipse 100% 80% at 50% -10%, rgba(201,153,42,0.18) 0%, transparent 55%), linear-gradient(175deg, #05040f, #0a0820, #05040f); }
                .lp-hero-content { position: relative; z-index: 2; padding: 2rem 1.5rem; max-width: 900px; }

                /* FK logo */
                .lp-logo { width: 72px; height: 72px; border-radius: 50%; border: 1.5px solid rgba(201,153,42,0.4); display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; background: rgba(201,153,42,0.06); font-family: var(--font-playfair, serif); font-size: 1.5rem; font-weight: 700; color: var(--gold); letter-spacing: .06em; }

                /* badge */
                .lp-badge { display: inline-flex; align-items: center; gap: .55rem; border: 1px solid rgba(201,153,42,0.3); background: rgba(201,153,42,0.05); border-radius: 999px; padding: .35rem 1rem; font-size: .7rem; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,0.7); margin-bottom: 2rem; opacity: 0; animation: riseIn .7s .1s ease forwards; }
                .lp-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); animation: blink 2s ease-in-out infinite; }

                /* hero title */
                .lp-h1 { font-family: var(--font-playfair, serif); font-size: clamp(3.5rem,9vw,8rem); font-weight: 900; line-height: 0.95; margin: 0 0 1.8rem; }
                
                /* hero sub */
                .lp-hero-sub { color: rgba(255,255,255,0.5); font-weight: 300; font-size: clamp(.95rem,2vw,1.15rem); line-height: 1.7; max-width: 540px; margin: 0 auto 2.5rem; opacity: 0; animation: riseIn .7s .7s ease forwards; }

                /* CTA buttons */
                .lp-cta-row { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; opacity: 0; animation: riseIn .7s .9s ease forwards; }
                .lp-btn-primary { padding: .85rem 2rem; border-radius: 999px; font-weight: 600; font-size: .9rem; letter-spacing: .04em; background: linear-gradient(135deg,var(--gold),var(--gold2)); color: #08071a; border: none; cursor: none; transition: transform .25s, box-shadow .25s, background .25s; }
                .lp-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(201,153,42,0.4); background: linear-gradient(135deg,var(--gold2),var(--gold3)); }
                .lp-btn-ghost { padding: .85rem 2rem; border-radius: 999px; font-weight: 600; font-size: .9rem; letter-spacing: .04em; background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.15); cursor: none; backdrop-filter: blur(12px); transition: border-color .25s, color .25s, transform .25s; }
                .lp-btn-ghost:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-3px); }
                @media (hover: none) { .lp-btn-primary, .lp-btn-ghost { cursor: auto; } }

                /* scroll indicator */
                .lp-scroll { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: .6rem; z-index: 2; opacity: 0; animation: riseIn .7s 1.2s ease forwards; }
                .lp-scroll-mouse { width: 22px; height: 34px; border: 1.5px solid rgba(255,255,255,0.25); border-radius: 11px; display: flex; justify-content: center; padding-top: 5px; }
                .lp-scroll-wheel { width: 3px; height: 6px; background: rgba(201,153,42,0.7); border-radius: 3px; animation: scrollWheel 1.6s ease-in-out infinite; }
                .lp-scroll-text { font-size: .6rem; letter-spacing: .35em; text-transform: uppercase; color: rgba(255,255,255,0.25); }

                /* ─── MARQUEE ─── */
                .lp-marquee-wrap { width: 100%; overflow: hidden; border-top: 1px solid rgba(201,153,42,0.12); border-bottom: 1px solid rgba(201,153,42,0.12); background: rgba(201,153,42,0.03); padding: .75rem 0; position: relative; z-index: 3; }
                .lp-marquee-track-inner { display: flex; width: max-content; }
                .lp-marquee-item { display: flex; align-items: center; gap: 1.4rem; padding: 0 1.4rem; font-size: .65rem; letter-spacing: .35em; text-transform: uppercase; color: var(--gold2); white-space: nowrap; }
                .lp-marquee-sep { color: var(--gold); font-size: .75rem; }

                /* ─── STATS ─── */
                .lp-stats { padding: 5rem 1.5rem; display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; max-width: 900px; margin: 0 auto; }
                @media (max-width: 640px) { .lp-stats { grid-template-columns: repeat(2,1fr); } }
                .lp-stat { text-align: center; padding: 2rem 1rem; }
                .lp-stat-num { display: block; font-family: var(--font-playfair, serif); font-size: clamp(2.2rem,4vw,3.5rem); font-weight: 900; background: linear-gradient(135deg,var(--gold),var(--gold2),var(--gold3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1; margin-bottom: .4rem; }
                .lp-stat-label { font-size: .65rem; letter-spacing: .2em; text-transform: uppercase; color: var(--muted); font-weight: 400; }

                /* ─── CATEGORIES ─── */
                .lp-cats-section { padding: 0 1.5rem 5rem; max-width: 1200px; margin: 0 auto; }
                .lp-cats-header { text-align: center; margin-bottom: 3rem; }
                .lp-eyebrow { font-size: .65rem; letter-spacing: .3em; text-transform: uppercase; color: var(--gold); margin-bottom: .8rem; display: block; }
                .lp-section-h2 { font-family: var(--font-playfair, serif); font-size: clamp(2rem,4vw,3rem); font-weight: 700; line-height: 1.15; }
                .lp-cats-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr; grid-template-rows: 260px 260px; gap: 12px; }
                .lp-cat-card:first-child { grid-row: 1 / 3; }
                @media (max-width: 768px) { .lp-cats-grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto; } .lp-cat-card:first-child { grid-column: 1 / 3; grid-row: auto; height: 240px; } .lp-cat-card { height: 180px !important; } }
                .lp-cat-card { position: relative; border-radius: 16px; overflow: hidden; cursor: none; }
                @media (hover: none) { .lp-cat-card { cursor: pointer; } }
                .lp-cat-bg { position: absolute; inset: 0; transition: transform .7s cubic-bezier(.16,1,.3,1); }
                .lp-cat-card:hover .lp-cat-bg { transform: scale(1.08); }
                .lp-cat-diamond { position: absolute; inset: 0; opacity: 0.05; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20Z' fill='none' stroke='%23c9992a' stroke-width='0.8'/%3E%3C/svg%3E"); background-size: 40px; }
                .lp-cat-vignette { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%); }
                .lp-cat-emoji { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); font-size: 3rem; opacity: 0.35; transition: transform .4s ease, opacity .4s ease; user-select: none; line-height: 1; }
                .lp-cat-card:hover .lp-cat-emoji { transform: translate(-50%,-50%) scale(1.1) rotate(-5deg); opacity: 0.55; }
                .lp-cat-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.2rem 1.4rem; }
                .lp-cat-title { font-family: var(--font-playfair, serif); font-size: 1.3rem; font-weight: 700; color: #fff; display: block; }
                .lp-cat-sub { font-size: .7rem; color: rgba(255,255,255,0.5); display: block; margin-top: .2rem; letter-spacing: .04em; }
                .lp-cat-tag { position: absolute; top: 1rem; left: 1.2rem; background: rgba(201,153,42,0.15); border: 1px solid rgba(201,153,42,0.3); color: var(--gold2); font-size: .65rem; letter-spacing: .1em; padding: .3rem .75rem; border-radius: 999px; opacity: 0; transform: translateY(-6px); transition: opacity .3s, transform .3s; }
                .lp-cat-card:hover .lp-cat-tag { opacity: 1; transform: translateY(0); }
                .lp-cat-arrow { position: absolute; top: 1rem; right: 1.2rem; width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid rgba(201,153,42,0.5); display: flex; align-items: center; justify-content: center; color: var(--gold); font-size: .8rem; opacity: 0; transition: opacity .3s; background: rgba(0,0,0,0.2); }
                .lp-cat-card:hover .lp-cat-arrow { opacity: 1; }

                /* ─── STITCHING SPLIT ─── */
                .lp-stitch { display: grid; grid-template-columns: 1fr 1fr; min-height: 600px; }
                @media (max-width: 768px) { .lp-stitch { grid-template-columns: 1fr; } }
                .lp-stitch-left { background: linear-gradient(160deg,#0a1a10,#040d07); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; padding: 4rem 2rem; position: relative; overflow: hidden; }
                .lp-stitch-gridlines { position: absolute; inset: 0; background-image: linear-gradient(rgba(201,153,42,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,153,42,0.04) 1px,transparent 1px); background-size: 40px 40px; }
                .lp-stitch-ring-outer { width: 180px; height: 180px; position: relative; display: flex; align-items: center; justify-content: center; }
                .lp-stitch-ring1 { position: absolute; inset: 0; border-radius: 50%; border: 1.5px solid rgba(201,153,42,0.3); animation: spin 20s linear infinite; }
                .lp-stitch-ring2 { position: absolute; inset: -20px; border-radius: 50%; border: 1px dashed rgba(201,153,42,0.15); animation: spin 35s linear infinite reverse; }
                .lp-stitch-circle { width: 120px; height: 120px; border-radius: 50%; background: rgba(201,153,42,0.08); border: 1.5px solid rgba(201,153,42,0.25); display: flex; align-items: center; justify-content: center; font-size: 2.8rem; animation: spin 20s linear infinite reverse; }
                .lp-stitch-pill { background: rgba(201,153,42,0.08); border: 1px solid rgba(201,153,42,0.2); color: var(--gold2); font-size: .65rem; letter-spacing: .2em; text-transform: uppercase; padding: .4rem 1.1rem; border-radius: 999px; }
                .lp-stitch-right { background: #08071a; padding: 4rem 3rem; display: flex; flex-direction: column; justify-content: center; }
                @media (max-width: 768px) { .lp-stitch-right { padding: 3rem 1.5rem; } }
                .lp-stitch-eyebrow { font-size: .65rem; letter-spacing: .3em; text-transform: uppercase; color: var(--gold); margin-bottom: .8rem; display: block; }
                .lp-stitch-h2 { font-family: var(--font-playfair, serif); font-size: clamp(1.6rem,3vw,2.4rem); font-weight: 700; line-height: 1.2; margin-bottom: 1rem; }
                .lp-stitch-p { color: rgba(255,255,255,0.5); font-size: .9rem; line-height: 1.7; margin-bottom: 2rem; font-weight: 300; }
                .lp-rates { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 2rem; }
                .lp-rate-row { display: flex; justify-content: space-between; align-items: center; padding: .7rem .9rem; border-radius: 8px; border: 1px solid transparent; transition: background .2s, border-color .2s; }
                .lp-rate-row:hover { background: rgba(201,153,42,0.05); border-color: rgba(201,153,42,0.15); }
                .lp-rate-label { font-size: .8rem; color: rgba(255,255,255,0.6); }
                .lp-rate-price { font-family: var(--font-playfair, serif); font-size: .95rem; color: var(--gold2); font-weight: 600; }

                /* ─── ABOUT BAND ─── */
                .lp-about { border-top: 1px solid rgba(201,153,42,0.1); border-bottom: 1px solid rgba(201,153,42,0.1); padding: 5rem 1.5rem; text-align: center; background: linear-gradient(to bottom,rgba(201,153,42,0.02),transparent); }
                .lp-about-inner { max-width: 700px; margin: 0 auto; }
                .lp-about-quote { font-family: var(--font-playfair, serif); font-size: clamp(1.5rem,3vw,2.2rem); font-style: italic; line-height: 1.4; margin-bottom: 1.5rem; color: #fff; font-weight: 400; }
                .lp-about-p { color: rgba(255,255,255,0.45); font-size: .9rem; line-height: 1.7; font-weight: 300; margin-bottom: 2rem; }
                .lp-about-pills { display: flex; flex-wrap: wrap; gap: .7rem; justify-content: center; margin-bottom: 2.5rem; }
                .lp-about-pill { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 999px; padding: .5rem 1.2rem; font-size: .75rem; color: rgba(255,255,255,0.55); }

                /* ─── FINAL CTA ─── */
                .lp-cta-section { padding: 8rem 1.5rem; text-align: center; position: relative; overflow: hidden; }
                .lp-cta-glow { position: absolute; top: 50%; left: 50%; width: 500px; height: 500px; margin: -250px; border-radius: 50%; background: radial-gradient(circle,rgba(201,153,42,0.12),transparent 70%); pointer-events: none; }
                .lp-cta-ring1 { position: absolute; top: 50%; left: 50%; width: 320px; height: 320px; margin: -160px; border-radius: 50%; border: 1px solid rgba(201,153,42,0.1); animation: breathe 4s ease-in-out infinite; pointer-events: none; }
                .lp-cta-ring2 { position: absolute; top: 50%; left: 50%; width: 480px; height: 480px; margin: -240px; border-radius: 50%; border: 1px solid rgba(201,153,42,0.06); animation: breathe 4s 1s ease-in-out infinite; pointer-events: none; }
                .lp-cta-inner { position: relative; z-index: 2; }
                .lp-cta-h2 { font-family: var(--font-playfair, serif); font-size: clamp(2.5rem,6vw,5rem); font-weight: 900; line-height: 1; margin-bottom: 1.2rem; }
                .lp-cta-sub { color: rgba(255,255,255,0.4); font-size: .95rem; font-weight: 300; margin-bottom: 3rem; }

                /* ─── FOOTER ─── */
                .lp-footer { border-top: 1px solid rgba(255,255,255,0.05); padding: 2.5rem 2rem; }
                .lp-footer-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem; }
                .lp-footer-brand { font-family: var(--font-playfair, serif); font-style: italic; font-size: 1.2rem; color: var(--gold); }
                .lp-footer-nav { display: flex; flex-wrap: wrap; gap: 1.5rem; }
                .lp-footer-link { font-size: .8rem; color: rgba(255,255,255,0.4); transition: color .2s; letter-spacing: .04em; }
                .lp-footer-link:hover { color: var(--gold); }
                .lp-footer-socials { display: flex; gap: .6rem; }
                .lp-footer-icon { width: 34px; height: 34px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.4); font-size: .85rem; transition: border-color .2s, color .2s; }
                .lp-footer-icon:hover { border-color: var(--gold); color: var(--gold); }
                .lp-footer-copy { text-align: center; padding: 1.2rem; font-size: .65rem; color: rgba(255,255,255,0.2); letter-spacing: .06em; border-top: 1px solid rgba(255,255,255,0.04); }

                /* ─── KEYFRAMES ─── */
                @keyframes riseIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
                @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
                @keyframes breathe { 0%,100%{transform:translate(-50%,-50%) scale(1); opacity:.7;} 50%{transform:translate(-50%,-50%) scale(1.05); opacity:1;} }
                @keyframes scrollWheel { 0%{transform:translateY(0);opacity:1;} 80%{transform:translateY(12px);opacity:0;} 100%{transform:translateY(0);opacity:0;} }
                @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
                @keyframes pulse { 0%,100%{transform:scale(1);opacity:.7;} 50%{transform:scale(1.08);opacity:1;} }
            `}</style>

            {/* Noise overlay */}
            <div className="lp-noise" aria-hidden />

            <div className="lp-wrap">
                {/* ─── HERO ─── */}
                <section className="lp-hero">
                    <canvas className="lp-canvas"></canvas>
                    <div className="lp-hero-grad" />
                    <div className="lp-hero-content">
                        {/* Logo */}
                        <div className="lp-logo">FK</div>

                        {/* Badge */}
                        <div className="lp-badge">
                            <span className="lp-badge-dot" />
                            Koduvally, Kerala · Premium Islamic Fashion
                        </div>

                        {/* H1 */}
                        <h1 className="lp-h1">
                            <span style={{ display: 'block' }}>Wear</span>
                            <span style={{
                                background: 'linear-gradient(135deg,#c9992a,#e8c060,#f5e0a0,#c9992a)',
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                animation: 'shimmer 4s linear infinite',
                                fontStyle: 'italic',
                                display: 'block'
                            }}>
                                Excellence
                            </span>
                            <span style={{ display: 'block' }}>Daily</span>
                        </h1>

                        {/* Sub */}
                        <p className="lp-hero-sub">
                            Handcrafted kandoras, quality fabrics and expert custom stitching —<br />
                            from Koduvally to your door, anywhere in India.
                        </p>

                        {/* CTAs */}
                        <div className="lp-cta-row">
                            <Link href="/home" className="lp-btn-primary">Shop Collection →</Link>
                            <Link href="/stitching" className="lp-btn-ghost">Custom Stitching</Link>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="lp-scroll" aria-hidden>
                        <div className="lp-scroll-mouse">
                            <div className="lp-scroll-wheel" />
                        </div>
                        <span className="lp-scroll-text">Scroll</span>
                    </div>
                </section>

                {/* ─── MARQUEE ─── */}
                <div className="lp-marquee-wrap" aria-hidden>
                    <div className="marquee-track lp-marquee-track-inner">
                        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                            <span key={i} className="lp-marquee-item">
                                {item}
                                <span className="lp-marquee-sep">✦</span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* ─── STATS ─── */}
                <section aria-label="Brand stats">
                    <div className="lp-stats">
                        {STATS.map(s => (
                            <div key={s.label} className="lp-stat">
                                <span className="lp-stat-num" data-target={s.value} data-suffix={s.suffix}>0{s.suffix}</span>
                                <span className="lp-stat-label">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ─── CATEGORIES ─── */}
                <section className="lp-cats-section">
                    <div className="lp-cats-header">
                        <span className="lp-eyebrow">Our Collections</span>
                        <h2 className="lp-section-h2">Everything you need,<br />all in one place</h2>
                    </div>
                    <div className="lp-cats-grid">
                        {CATEGORIES.map((cat) => (
                            <Link href={cat.href} key={cat.title} className="lp-cat-card" style={{ minHeight: 260 }}>
                                <div className="lp-cat-bg" style={{ background: cat.bg }} />
                                <div className="lp-cat-diamond" />
                                <div className="lp-cat-vignette" />
                                <span className="lp-cat-emoji" aria-hidden>{cat.emoji}</span>
                                <span className="lp-cat-tag">{cat.tag}</span>
                                <div className="lp-cat-arrow">↗</div>
                                <div className="lp-cat-info">
                                    <span className="lp-cat-title">{cat.title}</span>
                                    <span className="lp-cat-sub">{cat.sub}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ─── STITCHING SPLIT ─── */}
                <section className="lp-stitch" aria-label="Custom stitching">
                    {/* Left visual */}
                    <div className="lp-stitch-left">
                        <div className="lp-stitch-gridlines" aria-hidden />
                        <div className="lp-stitch-ring-outer" aria-hidden>
                            <div className="lp-stitch-ring1" />
                            <div className="lp-stitch-ring2" />
                            <div className="lp-stitch-circle">✂️</div>
                        </div>
                        <span className="lp-stitch-pill">Expert Tailoring</span>
                    </div>

                    {/* Right content */}
                    <div className="lp-stitch-right">
                        <span className="lp-stitch-eyebrow">Custom Stitching</span>
                        <h2 className="lp-stitch-h2">
                            Tailored to your<br />
                            <span style={{
                                background: 'linear-gradient(135deg,#c9992a,#e8c060,#f5e0a0,#c9992a)',
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                animation: 'shimmer 4s linear infinite',
                                fontStyle: 'italic'
                            }}>
                                exact measurements
                            </span>
                        </h2>
                        <p className="lp-stitch-p">
                            Send us your fabric or choose from our range. Our master tailors craft each garment to your measurements with decades of experience in Islamic fashion.
                        </p>
                        <div className="lp-rates">
                            {RATES.map(r => (
                                <div key={r.label} className="lp-rate-row">
                                    <span className="lp-rate-label">{r.label}</span>
                                    <span className="lp-rate-price">{r.price}</span>
                                </div>
                            ))}
                        </div>
                        <Link href="/fabrics" className="lp-btn-primary" style={{ alignSelf: 'flex-start', display: 'inline-block' }}>Browse Fabrics →</Link>
                    </div>
                </section>

                {/* ─── ABOUT BAND ─── */}
                <section className="lp-about" aria-label="About Fabloom">
                    <div className="lp-about-inner">
                        <p className="lp-about-quote">
                            "From our centre in Koduvally<br />to your door — anywhere in India"
                        </p>
                        <p className="lp-about-p">
                            Fabloom Kandoras is a trusted name in Islamic fashion, proudly based in Koduvally, Kerala. We combine traditional craftsmanship with modern style to deliver garments that reflect your faith and personality.
                        </p>
                        <div className="lp-about-pills">
                            <span className="lp-about-pill">📍 Koduvally, Kerala 673572</span>
                            <span className="lp-about-pill">🕘 Open daily · 9 AM – 9 PM</span>
                            <span className="lp-about-pill">📞 +91 95440 73317</span>
                        </div>
                        <Link href="/about" className="lp-btn-ghost">Visit Our Centre →</Link>
                    </div>
                </section>

                {/* ─── FINAL CTA ─── */}
                <section className="lp-cta-section" aria-label="Enter the store">
                    <div className="lp-cta-glow" aria-hidden />
                    <div className="lp-cta-ring1" aria-hidden />
                    <div className="lp-cta-ring2" aria-hidden />
                    <div className="lp-cta-inner">
                        <h2 className="lp-cta-h2">
                            Dress with<br />
                            <span style={{
                                background: 'linear-gradient(135deg,#c9992a,#e8c060,#f5e0a0,#c9992a)',
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                animation: 'shimmer 4s linear infinite',
                                fontStyle: 'italic'
                            }}>
                                intention
                            </span>
                        </h2>
                        <p className="lp-cta-sub">
                            Every stitch, every thread — crafted with purpose.
                        </p>
                        <Link href="/home" className="lp-btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.5rem', marginBottom: '1.5rem', display: 'inline-block' }}>
                            Enter the Store →
                        </Link>
                        <div style={{ marginTop: '1rem' }}>
                            <Link href="/home" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textDecoration: 'underline', letterSpacing: '0.04em' }}>
                                Already a customer? Go to store →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ─── FOOTER ─── */}
                <footer>
                    <div className="lp-footer">
                        <div className="lp-footer-inner">
                            <span className="lp-footer-brand">Fabloom Kandoras</span>
                            <nav className="lp-footer-nav" aria-label="Footer navigation">
                                {[['Readymade','/readymade'],['Fabrics','/fabrics'],['Stitching','/stitching'],['Perfumes','/perfumes'],['About','/about']].map(([label, href]) => (
                                    <Link key={label} href={href} className="lp-footer-link">{label}</Link>
                                ))}
                            </nav>
                            <div className="lp-footer-socials">
                                <a href="https://www.instagram.com/fabloomkandoras/" target="_blank" rel="noreferrer" className="lp-footer-icon" aria-label="Instagram">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                </a>
                                <a href="https://www.facebook.com/profile.php?id=61584037474921" target="_blank" rel="noreferrer" className="lp-footer-icon" aria-label="Facebook">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                </a>
                                <a href="https://wa.me/919544073317" target="_blank" rel="noreferrer" className="lp-footer-icon" aria-label="WhatsApp">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.243 8.477 3.513 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.557-5.342 11.897-11.958 11.897-.002 0-.003 0-.005 0-2.099-.001-4.14-.547-5.945-1.588L0 24zm6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654z"/></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <p className="lp-footer-copy">© 2025 Fabloom Kandoras · All rights reserved · Koduvally, Kerala</p>
                </footer>
            </div>
            
            {/* Inject interactive elements logic */}
            <LandingClient />
        </>
    );
}
