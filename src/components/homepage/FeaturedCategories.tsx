import Link from 'next/link';

// ============================================================================
// DATA — Static Navigation Links
// ============================================================================

const NAV_LINKS = [
    { name: 'Kurtas',   href: '/readymade?sub=kurta',    bg: '#1a237e' },
    { name: 'Thobes',   href: '/readymade?sub=thobe',    bg: '#0a001a' },
    { name: 'Fabrics',  href: '/fabrics',               bg: '#7a5c0f' },
    { name: 'Perfumes', href: '/perfumes',              bg: '#1a0030' },
    { name: 'Caps',     href: '/caps',                  bg: '#1b5e20' },
    { name: 'Bespoke',  href: '/stitching',             bg: '#D4A853' },
];

// ============================================================================
// SINGLE CARD — renders with a clean solid background
// ============================================================================

function CategoryGridCard({ name, href, bg }: { name: string; href: string; bg: string }) {
    return (
        <Link
            href={href}
            className="relative block rounded-2xl overflow-hidden aspect-square active:opacity-80 transition-all duration-150 shadow-sm border border-white/5"
            aria-label={name}
        >
            <div
                className="absolute inset-0"
                style={{ backgroundColor: bg }}
            />

            {/* Decorative pattern */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)',
                }}
            />

            {/* Label */}
            <div className="absolute inset-0 flex items-center justify-center p-3 text-center">
                <span className="text-sm font-extrabold text-white leading-tight tracking-wide drop-shadow-md">
                    {name}
                </span>
            </div>

            {/* Shimmer accent */}
            <div
                className="absolute -top-4 -right-4 w-12 h-12 rounded-full opacity-20 blur-xl"
                style={{ backgroundColor: '#fff' }}
            />
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
                {NAV_LINKS.map((link) => (
                    <CategoryGridCard 
                        key={link.name} 
                        name={link.name} 
                        href={link.href} 
                        bg={link.bg} 
                    />
                ))}
            </div>
        </section>
    );
}
