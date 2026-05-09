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
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill={i < rating ? '#D4A853' : 'rgba(255,255,255,0.2)'}
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
            className="flex-shrink-0 rounded-2xl p-4 flex flex-col gap-3"
            style={{
                width: '260px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
            }}
        >
            {/* Quote mark */}
            <div
                className="text-3xl font-serif leading-none"
                style={{ color: '#D4A853', opacity: 0.6 }}
                aria-hidden
            >
                &ldquo;
            </div>

            {/* Quote text */}
            <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {testimonial.quote}
            </p>

            {/* Stars */}
            <StarRating rating={testimonial.rating} />

            {/* Customer info */}
            <div className="flex items-center gap-3 pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                {/* Avatar */}
                <div
                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: 'rgba(212,168,83,0.2)', color: '#D4A853' }}
                >
                    {testimonial.avatarInitials}
                </div>
                <div>
                    <p className="text-xs font-bold text-white leading-tight">{testimonial.customerName}</p>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
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
            <div className="flex items-end justify-between pr-4 mb-3">
                <div>
                    <h2
                        id="testimonials-heading"
                        className="text-lg font-extrabold text-white leading-tight"
                    >
                        What Customers Say
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
        </section>
    );
}
