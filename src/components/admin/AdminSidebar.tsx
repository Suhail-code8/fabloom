'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { SignOutButton } from '@clerk/nextjs';

const NAV = [
    {
        label: 'Dashboard',
        href: '/admin/dashboard',
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="7" height="9" />
                <rect x="14" y="3" width="7" height="5" />
                <rect x="14" y="12" width="7" height="9" />
                <rect x="3" y="16" width="7" height="5" />
            </svg>
        ),
    },
    {
        label: 'Orders',
        href: '/admin/orders',
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
        ),
    },
    {
        label: 'Production',
        href: '/admin/production',
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
            </svg>
        ),
    },
    {
        label: 'Inventory',
        href: '/admin/inventory',
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
        ),
    },
];

function isActive(pathname: string, href: string): boolean {
    const canonical = href.replace('/admin', '') || '/dashboard';
    if (canonical === '/dashboard') {
        return pathname === '/dashboard' || pathname === '/admin' || pathname === '/admin/dashboard';
    }
    return pathname === canonical || pathname.startsWith(`${canonical}/`) || pathname.startsWith(`${href}/`);
}

interface AdminSidebarProps {
    name: string;
    email: string;
    avatar: string;
}

export default function AdminSidebar({ name, email, avatar }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className="w-[240px] h-full flex flex-col flex-shrink-0"
            style={{ backgroundColor: '#0f1035' }}
        >
            <div className="h-16 px-6 flex items-center flex-shrink-0 border-b border-white/10">
                <Link
                    href="/admin/dashboard"
                    className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2"
                >
                    <span className="w-6 h-6 rounded bg-[#D4A853] flex items-center justify-center text-[#0f1035] text-sm">
                        F
                    </span>
                    Fabloom{' '}
                    <span className="text-[#D4A853] text-[10px] uppercase tracking-widest mt-1 ml-1">
                        Admin
                    </span>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3">
                <div className="flex flex-col gap-1">
                    {NAV.map((item) => {
                        const active = isActive(pathname, item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                    active
                                        ? 'bg-[#D4A853]/10 text-[#D4A853]'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                                style={
                                    active
                                        ? { borderLeft: '3px solid #D4A853', paddingLeft: '9px' }
                                        : { borderLeft: '3px solid transparent' }
                                }
                            >
                                <span className={active ? 'text-[#D4A853]' : 'text-gray-500'}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="p-4 border-t border-white/10 flex-shrink-0">
                <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-white/5">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                        {avatar ? (
                            <Image src={avatar} alt={name} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white bg-[#D4A853]/20">
                                {name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{email}</p>
                    </div>
                </div>
                <SignOutButton redirectUrl="/">
                    <button className="w-full py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                        Logout
                    </button>
                </SignOutButton>
            </div>
        </aside>
    );
}
