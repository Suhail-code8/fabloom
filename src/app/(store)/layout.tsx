import type { ReactNode } from 'react';
import TopCategoryBar from '@/components/layout/TopCategoryBar';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';

// ============================================================================
// STORE ROOT LAYOUT — Server Component
// ============================================================================

export default function StoreLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <style>{`
                :root {
                    --brand-primary: #0f1035;
                    --brand-gold: #D4A853;
                    --brand-gold-light: #f0d080;
                    --store-header-h: 110px;
                    --store-subnav-h: 50px;
                    --store-bottom-nav-h: 80px;
                    --store-subnav-stack-h: 100px;
                    --store-scroll-with-subnav: calc(var(--store-header-h) + var(--store-subnav-stack-h));
                }
            `}</style>

            <div
                className="flex flex-col min-h-screen w-full overflow-x-hidden"
                style={{ backgroundColor: 'var(--brand-primary)' }}
            >
                <header id="store-header" className="sticky top-0 z-40 shrink-0">
                    <TopCategoryBar />
                </header>

                <main className="flex-1 store-pb-nav w-full md:max-w-2xl md:mx-auto lg:max-w-6xl">
                    {children}
                </main>

                <Footer />

                <BottomNav />
            </div>
        </>
    );
}
