import Link from 'next/link';
import { FEATURED_CATEGORIES } from '@/lib/homepage';

// ============================================================================
// SINGLE CARD — renders with a background image
// ============================================================================

function CategoryGridCard({ name, href, imageUrl }: { name: string; href: string; imageUrl: string }) {
    return (
        <Link
            href={href}
            className="relative block rounded-xl overflow-hidden aspect-[3/4] active:scale-95 transition-all duration-200 shadow-sm border border-white/10 group hover:border-[#D4A853]/50"
            aria-label={name}
        >
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${imageUrl})` }}
            />

            {/* Dark gradient overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)',
                }}
            />

            {/* Label */}
            <div className="absolute inset-0 flex items-end justify-start p-3">
                <span className="text-[14px] font-bold text-white leading-tight tracking-wide">
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
                        className="text-lg font-extrabold text-white leading-tight"
                    >
                        Shop by Category
                    </h2>
                    <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        Premium collections at your fingertips
                    </p>
                </div>
            </div>

            {/* 3×2 grid */}
            <div className="grid grid-cols-3 gap-3">
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
