'use client';

import type { Testimonial } from '@/lib/homepage';

// ============================================================================
// STAR RATING
// ============================================================================

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <svg
                    key={i}
                    className="w-3.5 h-3.5 transition-transform duration-200"
                    viewBox="0 0 24 24"
                    fill={i < rating ? '#D4A853' : 'rgba(255,255,255,0.15)'}
                    aria-hidden
                >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}
        </div>
    );
}

// ============================================================================
// TESTIMONIAL CARD
// ============================================================================

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    return (
        <div
            className="flex-shrink-0 rounded-2xl p-4 flex flex-col gap-3 group transition-all duration-300"
            style={{
                width: '260px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,168,83,0.3)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(212,168,83,0.1)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
        >
            {/* Quote mark */}
            <div
                className="text-3xl font-serif leading-none select-none"
                style={{
                    background: 'linear-gradient(135deg, #D4A853, #f3bf4d)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    opacity: 0.7,
                }}
                aria-hidden
            >
                &ldquo;
            </div>

            {/* Quote text */}
            <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.78)' }}>
                {testimonial.quote}
            </p>

            {/* Stars */}
            <StarRating rating={testimonial.rating} />

            {/* Customer info */}
            <div
                className="flex items-center gap-3 pt-1"
                style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
            >
                {/* Avatar */}
                <div
                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                        background: 'linear-gradient(135deg, rgba(212,168,83,0.25), rgba(212,168,83,0.1))',
                        border: '1px solid rgba(212,168,83,0.3)',
                        color: '#D4A853',
                    }}
                >
                    {testimonial.avatarInitials}
                </div>
                <div>
                    <p className="text-xs font-bold leading-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>{testimonial.customerName}</p>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {testimonial.garmentType}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// STRIP
// ============================================================================

interface TestimonialStripProps {
    testimonials: Testimonial[];
}

export default function TestimonialStrip({ testimonials }: TestimonialStripProps) {
    return (
        <section className="pl-4" aria-labelledby="testimonials-heading">
            <div className="flex items-end justify-between pr-4 mb-4">
                <div>
                    <h2
                        id="testimonials-heading"
                        className="text-lg font-extrabold leading-tight"
                        style={{ color: 'rgba(255,255,255,0.95)' }}
                    >
                        What Customers Say
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        Real stories. Real fits.
                    </p>
                </div>
            </div>

            {/* Horizontal scroll */}
            <div
                className="flex gap-3 overflow-x-auto pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {testimonials.map((t) => (
                    <TestimonialCard key={t.id} testimonial={t} />
                ))}
                <div className="flex-shrink-0 w-4" aria-hidden />
            </div>

            <style>{`
                section div::-webkit-scrollbar { display: none; }
            `}</style>
        </section>
    );
}
