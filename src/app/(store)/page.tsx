import TopSearchBar from '@/components/homepage/TopSearchBar';
import HeroBannerCarousel from '@/components/homepage/HeroBannerCarousel';
import FeaturedCategories from '@/components/homepage/FeaturedCategories';
import ProductSectionRow from '@/components/homepage/ProductSectionRow';
import TailoringCTA from '@/components/homepage/TailoringCTA';
import TestimonialStrip from '@/components/homepage/TestimonialStrip';
import {
    TESTIMONIALS,
} from '@/lib/homepage';
import { getProductsAction } from '@/lib/dal';

// ============================================================================
// SERVER COMPONENT — app/(store)/page.tsx
// ============================================================================

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
    title: 'Fabloom Kandoras — Premium Islamic Fashion',
    description:
        'Shop premium kandoras, thobes, kurthas and quality fabrics online. Custom stitching available. Fast delivery across India. Based in Koduvally, Kerala.',
};

export default async function StorefrontPage() {
    // PRODUCTION HARDENING: Call DAL directly to avoid fetch-during-build errors
    const [trendingReadymade, premiumFabrics] = await Promise.all([
        getProductsAction({ type: 'readymade', limit: 8, sort: 'createdAt' }),
        getProductsAction({ type: 'fabric', limit: 8, sort: 'createdAt' }),
    ]);

    const testimonials = TESTIMONIALS;

    return (
        <div
            className="min-h-full brand-bg-pattern"
            style={{ backgroundColor: '#0f1035' }}
        >
            {/* 1 ── Sticky search bar */}
            <TopSearchBar />

            {/* Spacer / section spacing wrapper */}
            <div className="flex flex-col gap-6 pb-4">

                {/* 2 ── Hero banner carousel */}
                <section className="px-4" aria-label="Promotional banners">
                    <HeroBannerCarousel />
                </section>

                {/* 3 ── Featured categories 2×3 grid */}
                <FeaturedCategories />

                {/* Divider */}
                <div className="mx-4 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />

                {/* 4a ── Trending readymade products */}
                <ProductSectionRow
                    title="Trending Readymade"
                    subtitle="Fresh styles, ready to ship"
                    products={trendingReadymade}
                    viewAllHref="/readymade"
                />

                {/* 4b ── Premium fabrics */}
                <ProductSectionRow
                    title="Premium Fabrics"
                    subtitle="Priced per meter · Stitching available"
                    products={premiumFabrics}
                    viewAllHref="/fabrics"
                />

                {/* Divider */}
                <div className="mx-4 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />

                {/* 5 ── Tailoring CTA */}
                <TailoringCTA />

                {/* 6 ── Testimonials */}
                <TestimonialStrip testimonials={testimonials} />

                {/* Footer micro-note */}
                <p
                    className="text-center text-[10px] px-6 pb-4 pt-2"
                    style={{ color: 'rgba(255,255,255,0.25)' }}
                >
                    © 2025 Fabloom Kandoras · Crafted for premium fashion
                </p>

            </div>
        </div>
    );
}
