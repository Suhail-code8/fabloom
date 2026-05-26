'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

// ============================================================================
// HELPER TO GENERATE TITLE FROM PATH
// ============================================================================
function getPageTitle(pathname: string): string {
    if (pathname === '/admin' || pathname === '/dashboard') return 'Dashboard';

    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] === 'admin') segments.shift();

    if (segments.length === 0) return 'Dashboard';

    // Last segment capitalized
    const last = segments[segments.length - 1];
    return last
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function AdminHeader() {
    const pathname = usePathname();
    const title = getPageTitle(pathname);

    return (
        <header className="h-16 bg-white border-b border-gray-200 px-6 lg:px-8 flex items-center justify-between flex-shrink-0 z-10">
            {/* Title */}
            <h1 className="text-xl font-extrabold text-gray-900">{title}</h1>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
                {/* Quick Action Buttons */}
                <div className="hidden md:flex items-center gap-3 mr-2">
                    <Link
                        href="/products/new"
                        className="px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                        style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
                    >
                        Add Product
                    </Link>
                    <Link
                        href="/orders"
                        className="px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
                        style={{ backgroundColor: '#0f1035', color: '#ffffff' }}
                    >
                        <svg className="w-3.5 h-3.5 text-[#D4A853]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        View Orders
                    </Link>
                </div>

                {/* Vertical Divider */}
                <div className="h-6 w-px bg-gray-200 hidden md:block" />

                {/* Notifications */}
                <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 outline-none">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    {/* Badge */}
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
                </button>
            </div>
        </header>
    );
}
