'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// ============================================================================
// TYPES
// ============================================================================

interface CategoryItem {
    id: string;
    label: string;
    href: string;
    icon: React.ReactNode;
}

// ============================================================================
// INLINE SVG ICONS
// ============================================================================

const ShirtIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
    </svg>
);

const ScissorsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" />
        <line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
);

const FabricRollIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
        <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </svg>
);

const BottleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M9 3h6" />
        <path d="M10 3v2.343a6 6 0 0 0-1.414 1L7 8H6a1 1 0 0 0-1 1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9a1 1 0 0 0-1-1h-1l-1.586-1.657A6 6 0 0 0 14 5.343V3" />
        <path d="M6 12h12" />
    </svg>
);

const CapIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 11h18" />
        <path d="M3 11c0-4.97 4.03-9 9-9s9 4.03 9 9" />
        <path d="M3 11c0 1.5.83 2.8 2 3.46V18H19v-3.54A4 4 0 0 0 21 11" />
    </svg>
);

const GridIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);

// ============================================================================
// CATEGORY DATA
// ============================================================================

const CATEGORIES: CategoryItem[] = [
    { id: 'readymade', label: 'Readymade', href: '/readymade', icon: <ShirtIcon /> },
    { id: 'stitching', label: 'Stitching', href: '/stitching', icon: <ScissorsIcon /> },
    { id: 'fabrics', label: 'Fabrics', href: '/fabrics', icon: <FabricRollIcon /> },
    { id: 'perfumes', label: 'Perfumes', href: '/perfumes', icon: <BottleIcon /> },
    { id: 'caps', label: 'Caps', href: '/caps', icon: <CapIcon /> },
    { id: 'accessories', label: 'More', href: '/accessories', icon: <GridIcon /> },
];

export default function TopCategoryBar() {
    const pathname = usePathname();

    return (
        <nav
            className="w-full px-4 py-3 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            style={{ backgroundColor: 'var(--brand-primary)' }}
            aria-label="Product categories"
        >
            <div className="flex items-center gap-2 flex-shrink-0">
                <Link href="/" className="flex items-center gap-2.5">
                    <Image
                        src="/logo.jpeg"
                        alt="FK"
                        width={36}
                        height={36}
                        className="rounded-full ring-1 ring-[#D4A853]/40"
                    />
                    <div className="flex flex-col leading-tight">
                        <span 
                            className="text-[15px] font-bold tracking-wide"
                            style={{ 
                                color: '#D4A853',
                                fontFamily: 'var(--font-playfair, serif)',
                                letterSpacing: '0.04em'
                            }}>
                            Fabloom
                        </span>
                        <span 
                            className="text-[10px] font-medium tracking-widest uppercase"
                            style={{ color: 'rgba(212,168,83,0.65)' }}>
                            Kandoras
                        </span>
                    </div>
                </Link>
            </div>

            {/* Horizontally scrollable row — hide scrollbar cross-browser */}
            <ul
                className="flex gap-1 overflow-x-auto no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {CATEGORIES.map((cat) => {
                    const isActive =
                        cat.href === '/'
                            ? pathname === '/'
                            : pathname.startsWith(cat.href);

                    return (
                        <li key={cat.id} className="flex-shrink-0">
                            <Link
                                href={cat.href}
                                className="flex flex-col items-center justify-center gap-1 min-w-[72px] min-h-[72px] px-2 py-2 rounded-xl transition-all duration-200 active:scale-95 select-none"
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {/* Icon circle */}
                                <span
                                    className={[
                                        'flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200',
                                        isActive
                                            ? 'ring-2 bg-white/5'
                                            : 'bg-white/5',
                                    ].join(' ')}
                                    style={
                                        isActive
                                            ? { boxShadow: '0 0 0 2px var(--brand-gold)' }
                                            : {}
                                    }
                                >
                                    <span
                                        style={{
                                            color: isActive ? 'var(--brand-gold)' : 'rgba(255,255,255,0.6)',
                                        }}
                                    >
                                        {cat.icon}
                                    </span>
                                </span>

                                {/* Label */}
                                <span
                                    className="text-[10px] font-medium leading-tight text-center max-w-[64px] truncate transition-colors duration-200"
                                    style={{
                                        color: isActive ? 'var(--brand-gold)' : 'rgba(255,255,255,0.55)',
                                    }}
                                >
                                    {cat.label}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {/* Hide WebKit scrollbar */}
            <style>{`
                nav ul::-webkit-scrollbar { display: none; }
            `}</style>
        </nav>
    );
}
