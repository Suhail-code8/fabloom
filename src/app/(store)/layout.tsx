import type { ReactNode } from 'react';
import TopCategoryBar from '@/components/layout/TopCategoryBar';
import BottomNav from '@/components/layout/BottomNav';

// ============================================================================
// STORE ROOT LAYOUT — Server Component
// ============================================================================

export default function StoreLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* Brand CSS variables scoped to the storefront shell */}
            <style>{`
                :root {
                    --brand-primary: #0f1035;
                    --brand-gold: #D4A853;
                    --brand-gold-light: #f0d080;
                }
            `}</style>

            <div
                className="flex flex-col min-h-screen"
                style={{ backgroundColor: 'var(--brand-primary)' }}
            >
                {/* ── Sticky top category bar ── */}
                <header className="sticky top-0 z-40">
                    <TopCategoryBar />
                </header>

                {/* ── Scrollable content area ── */}
                {/* pb-20 leaves room for the fixed BottomNav (80px) */}
                <main className="flex-1 overflow-y-auto pb-20">
                    {children}
                </main>

                {/* ── Fixed bottom navigation ── */}
                <BottomNav />
            </div>
        </>
    );
}
