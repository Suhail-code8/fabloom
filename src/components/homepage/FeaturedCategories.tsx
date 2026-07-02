import Link from 'next/link';
import { FEATURED_CATEGORIES } from '@/lib/homepage';

// ============================================================================
// SINGLE CARD — renders with a background image
// ============================================================================

function CategoryGridCard({ name, href, imageUrl }: { name: string; href: string; imageUrl: string }) {
    return (
        <Link
            href={href}
            className="relative block rounded-xl overflow-hidden aspect-[3/4] active:scale-95 transition-all duration-300 group"
            style={{
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}
            aria-label={name}
        >
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${imageUrl})` }}
            />

            {/* Dark gradient overlay — lightens on hover */}
            <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.75) 100%)',
                }}
            />

            {/* Gold shimmer overlay on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, rgba(212,168,83,0.12) 0%, transparent 60%)',
                }}
            />

            {/* Gold border glow on hover */}
            <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 0 1.5px rgba(212,168,83,0.45)' }}
            />

            {/* Label */}
            <div className="absolute inset-0 flex items-end justify-start p-3">
                <span
                    className="text-[14px] font-bold text-white leading-tight tracking-wide transition-colors duration-300 group-hover:text-[#f3bf4d]"
                    style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
                >
                    {name}
                </span>
            </div>
        </Link>
    );
}

// ============================================================================
// GRID COMPONENT
// ============================================================================

export default function FeaturedCategories() {
    return (
        <section className="px-4" aria-labelledby="featured-categories-heading">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2
                        id="featured-categories-heading"
                        className="text-lg font-extrabold leading-tight"
                        style={{ color: 'rgba(255,255,255,0.95)' }}
                    >
                        Shop by Category
                    </h2>
                    <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        Premium collections at your fingertips
                    </p>
                </div>
            </div>

            {/* 3×2 grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-stretch">
                {FEATURED_CATEGORIES.map((cat) => (
                    <CategoryGridCard
                        key={cat.id}
                        name={cat.name}
                        href={cat.href}
                        imageUrl={cat.imageUrl}
                    />
                ))}
            </div>
        </section>
    );
}
