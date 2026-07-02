import Link from 'next/link';

export default function TailoringCTA() {
    return (
        <section className="px-4" aria-label="Custom stitching promotion">
            <div
                className="relative overflow-hidden rounded-2xl px-6 py-7"
                style={{
                    background: 'linear-gradient(130deg, #1a0a40 0%, #2d1b69 50%, #0f1035 100%)',
                    border: '1px solid rgba(212,168,83,0.3)',
                    boxShadow: '0 4px 32px rgba(212,168,83,0.07)',
                }}
            >
                {/* Decorative background circles */}
                <div
                    className="absolute -top-8 -right-8 w-32 h-32 rounded-full"
                    style={{ backgroundColor: '#D4A853', opacity: 0.12, filter: 'blur(24px)' }}
                    aria-hidden
                />
                <div
                    className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full"
                    style={{ backgroundColor: '#D4A853', opacity: 0.1, filter: 'blur(20px)' }}
                    aria-hidden
                />
                {/* Ambient radial glow */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 80% 0%, rgba(212,168,83,0.08) 0%, transparent 70%)' }}
                    aria-hidden
                />

                {/* Scissors icon */}
                <div className="relative z-10 mb-4">
                    <div
                        className="inline-flex items-center justify-center w-12 h-12 rounded-full"
                        style={{
                            backgroundColor: 'rgba(212,168,83,0.12)',
                            border: '1px solid rgba(212,168,83,0.25)',
                            boxShadow: '0 0 16px rgba(212,168,83,0.15)',
                        }}
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="6" cy="6" r="3" />
                            <circle cx="6" cy="18" r="3" />
                            <line x1="20" y1="4" x2="8.12" y2="15.88" />
                            <line x1="14.47" y1="14.48" x2="20" y2="20" />
                            <line x1="8.12" y1="8.12" x2="12" y2="12" />
                        </svg>
                    </div>
                </div>

                {/* Text */}
                <div className="relative z-10 mb-5">
                    <h2 className="text-xl font-extrabold text-white leading-tight mb-1.5">
                        Add Expert Stitching to Your Order
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                        Browse our premium fabric collection and add custom stitching — tailored to your exact measurements by our expert team.
                    </p>
                </div>

                {/* Features row */}
                <div className="relative z-10 flex flex-wrap gap-2 mb-5">
                    {['Custom Fit', 'Master Tailors', 'Fast Turnaround'].map((feat) => (
                        <span
                            key={feat}
                            className="text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full"
                            style={{
                                backgroundColor: 'rgba(212,168,83,0.15)',
                                color: '#D4A853',
                                border: '1px solid rgba(212,168,83,0.3)',
                            }}
                        >
                            {feat}
                        </span>
                    ))}
                </div>

                {/* CTA button */}
                <Link
                    href="/fabrics"
                    className="relative z-10 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 active:scale-95 hover:brightness-110"
                    style={{
                        backgroundColor: '#D4A853',
                        color: '#0f1035',
                        boxShadow: '0 4px 20px rgba(212,168,83,0.35)',
                        transition: 'box-shadow 0.3s, filter 0.2s, transform 0.2s',
                    }}
                >
                    Browse Fabrics
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                </Link>
            </div>
        </section>
    );
}
