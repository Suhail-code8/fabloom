import Link from 'next/link';
import HeroSection from '@/components/landing/HeroSection';
import BrandManifesto from '@/components/landing/BrandManifesto';
import EditorialQuote from '@/components/landing/EditorialQuote';
import { CollectionNavigator } from '@/components/collection';
import { CollectionService } from '@/lib/services/collection.service';
// import FeaturedCollections from '@/components/landing/FeaturedCollections';
// import OurCraft from '@/components/landing/OurCraft';

export default async function LandingPage() {
    // Fetch readymades collections
    const readymades = await CollectionService.resolvePath(['readymades']);
    let readymadesChildren: any[] = [];
    if (readymades) {
        readymadesChildren = await CollectionService.getChildCollections(readymades._id.toString());
    }

    return (
        <main className="min-h-screen bg-background">
            
            {/* ── TOP NAV (Minimalist Luxury) ─────────────────────────────────── */}
            <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference text-white">
                <div className="flex justify-between items-center px-6 md:px-12 py-6 max-w-[1440px] mx-auto">
                    {/* Left Navigation */}
                    <nav className="flex-1 hidden md:flex gap-8 items-center">
                        <Link href="/readymades" className="text-[10px] tracking-[0.2em] uppercase hover:opacity-70 transition-opacity">
                            Readymades
                        </Link>
                        <Link href="/stitching" className="text-[10px] tracking-[0.2em] uppercase hover:opacity-70 transition-opacity">
                            Bespoke
                        </Link>
                    </nav>

                    {/* Center Brand */}
                    <div className="flex-1 text-center">
                        <Link href="/" className="font-serif text-xl tracking-[0.15em] uppercase hover:opacity-80 transition-opacity">
                            Fabloom
                        </Link>
                    </div>

                    {/* Right Menu */}
                    <div className="flex-1 flex justify-end">
                        <button className="text-[10px] tracking-[0.2em] uppercase hover:opacity-70 transition-opacity flex items-center gap-3">
                            <span>Menu</span>
                            <div className="flex flex-col gap-[3px]">
                                <span className="w-4 h-[1px] bg-current" />
                                <span className="w-4 h-[1px] bg-current" />
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* ── SECTION 1: HERO ────────────────────────────────────────────── */}
            <HeroSection />

            {/* ── SECTION 2: BRAND MANIFESTO ─────────────────────────────────── */}
            <BrandManifesto />

            {/* ── SECTION 3: EDITORIAL QUOTE ─────────────────────────────────── */}
            <EditorialQuote />

            {/* ── SECTION 4: READYMADES COLLECTIONS CATALOGUE ────────────────── */}
            {readymadesChildren && readymadesChildren.length > 0 && (
                <div className="pb-32 bg-background">
                    <CollectionNavigator 
                        collections={readymadesChildren} 
                        currentPath="/readymades" 
                        title="The Readymades Collection" 
                    />
                </div>
            )}

            {/* 
                Legacy Sections (Temporarily commented for Phase 5 Milestone 2)
                <FeaturedCollections />
                <OurCraft />
                ...
            */}
        </main>
    );
}
