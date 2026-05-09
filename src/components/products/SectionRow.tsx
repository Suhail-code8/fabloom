import Link from 'next/link';
import type { IAccessoryProduct } from '@/types/product';
import AccessoryCard from '@/components/products/AccessoryCard';

// ============================================================================
// SECTION ROW — horizontal scrollable product strip
// Used on accessories page (and reusable on homepage-style layouts)
// ============================================================================

interface SectionRowProps {
    title: string;
    subtitle?: string;
    products: IAccessoryProduct[];
    viewAllHref?: string;
    cardWidth?: string;   // Tailwind/inline width for each card
    renderCard?: (product: IAccessoryProduct) => React.ReactNode;
}

export default function SectionRow({
    title,
    subtitle,
    products,
    viewAllHref,
    cardWidth = '140px',
    renderCard,
}: SectionRowProps) {
    if (products.length === 0) return null;

    return (
        <section aria-labelledby={`row-${title}`} className="pl-4">
            {/* Header */}
            <div className="flex items-end justify-between pr-4 mb-3">
                <div>
                    <h2
                        id={`row-${title}`}
                        className="text-base font-extrabold text-white leading-tight"
                    >
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                            {subtitle}
                        </p>
                    )}
                </div>
                {viewAllHref && (
                    <Link
                        href={viewAllHref}
                        className="text-xs font-semibold flex items-center gap-1 transition-opacity active:opacity-60"
                        style={{ color: '#D4A853' }}
                    >
                        View all
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </Link>
                )}
            </div>

            {/* Gold underline */}
            <div className="mb-3 h-0.5 w-8 rounded-full" style={{ backgroundColor: '#D4A853' }} />

            {/* Scroll row */}
            <div
                className="flex gap-3 overflow-x-auto pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((product) => (
                    <div key={product._id} className="flex-shrink-0" style={{ width: cardWidth }}>
                        {renderCard
                            ? renderCard(product)
                            : (
                                <AccessoryCard
                                    product={product}
                                    href={`/products/${product._id}`}
                                />
                            )}
                    </div>
                ))}
                <div className="flex-shrink-0 w-4" aria-hidden />
            </div>

            <style>{`div::-webkit-scrollbar{display:none}`}</style>
        </section>
    );
}
