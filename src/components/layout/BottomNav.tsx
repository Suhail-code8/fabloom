'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useUser } from '@clerk/nextjs';

// ============================================================================
// TYPES
// ============================================================================

interface NavTab {
    label: string;
    href: string;
    icon: (active: boolean) => React.ReactNode;
}

// ============================================================================
// INLINE SVG ICONS
// ============================================================================

const HomeIcon = (active: boolean) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" />
        <path d="M9 21V12h6v9" fill={active ? 'rgba(255,255,255,0.25)' : 'none'} />
    </svg>
);

const HeartIcon = (active: boolean) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const BagIcon = (active: boolean) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" fill="none" />
    </svg>
);

const PersonIcon = (active: boolean) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const InfoIcon = (active: boolean) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);

// ============================================================================
// NAV TAB DATA
// ============================================================================

const NAV_TABS: NavTab[] = [
    { label: 'Home',     href: '/',        icon: HomeIcon },
    { label: 'Wishlist', href: '/wishlist', icon: HeartIcon },
    { label: 'Cart',     href: '/cart',     icon: BagIcon },
    { label: 'Account',  href: '/account',  icon: PersonIcon },
    { label: 'About',    href: '/about',    icon: InfoIcon },
];

// ============================================================================
// COMPONENT
// ============================================================================

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { isSignedIn } = useUser();
    
    const totalItems = useCartStore((state) => 
        state.items.reduce((total, item: any) => {
            if (item.itemType === 'stitching') return total + 1;
            return total + (item.quantity || 0);
        }, 0)
    );

    // HIDE BOTTOM NAV ON SPECIFIC ROUTES
    const hideOnRoutes = ['/checkout', '/stitching', '/account/measurements/new'];
    if (hideOnRoutes.some(route => pathname.startsWith(route))) {
        return null;
    }

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl md:w-full lg:max-w-6xl"
            style={{
                backgroundColor: 'var(--brand-primary)',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
            aria-label="Main navigation"
        >
            <ul className="flex items-stretch">
                {NAV_TABS.map((tab) => {
                    const isActive =
                        tab.href === '/'
                            ? pathname === '/'
                            : pathname.startsWith(tab.href);

                    const isCart = tab.href === '/cart';

                    return (
                        <li key={tab.href} className="flex-1">
                            <Link
                                href={tab.href}
                                onClick={(e) => {
                                    if (tab.href === '/cart' && !isSignedIn) {
                                        e.preventDefault();
                                        router.push('/sign-in');
                                    }
                                }}
                                className="relative flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] w-full transition-all duration-200 active:scale-95 select-none"
                                aria-current={isActive ? 'page' : undefined}
                                aria-label={tab.label}
                            >
                                {/* Icon + badge wrapper */}
                                <span className="relative flex items-center justify-center">
                                    <span
                                        style={{
                                            color: isActive
                                                ? 'var(--brand-gold)'
                                                : 'rgba(255,255,255,0.45)',
                                            transition: 'color 0.2s',
                                        }}
                                    >
                                        {tab.icon(isActive)}
                                    </span>

                                    {/* Cart badge */}
                                    {isCart && totalItems > 0 && (
                                        <span
                                            className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1 leading-none"
                                            aria-label={`${totalItems} items in cart`}
                                        >
                                            {totalItems > 99 ? '99+' : totalItems}
                                        </span>
                                    )}
                                </span>

                                {/* Label */}
                                <span
                                    className="text-[10px] font-medium leading-tight transition-colors duration-200"
                                    style={{
                                        color: isActive
                                            ? 'var(--brand-gold)'
                                            : 'rgba(255,255,255,0.45)',
                                    }}
                                >
                                    {tab.label}
                                </span>

                                {/* Active indicator dot */}
                                {isActive && (
                                    <span
                                        className="absolute bottom-1 w-1 h-1 rounded-full"
                                        style={{ backgroundColor: 'var(--brand-gold)' }}
                                    />
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
