'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { SignOutButton } from '@clerk/nextjs';

// ============================================================================
// ICONS
// ============================================================================

const Icons = {
    dashboard: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>,
    analytics: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    orders: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
    kanban: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>,
    clock: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    products: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    plus: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    alert: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    users: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    measurements: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    settings: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    truck: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    bell: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
};

// ============================================================================
// NAVIGATION STRUCTURE
// ============================================================================

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

interface NavGroup {
    title: string;
    items: NavItem[];
}

const MENU: NavGroup[] = [
    {
        title: 'Overview',
        items: [
            { label: 'Dashboard', href: '/admin', icon: Icons.dashboard },
            { label: 'Analytics', href: '/admin/analytics', icon: Icons.analytics },
        ],
    },
    {
        title: 'Orders',
        items: [
            { label: 'All Orders', href: '/admin/orders', icon: Icons.orders },
            { label: 'Stitching Production', href: '/admin/stitching', icon: Icons.kanban },
            { label: 'Pending Stitching', href: '/admin/stitching/pending', icon: Icons.clock },
        ],
    },
    {
        title: 'Inventory',
        items: [
            { label: 'Products', href: '/admin/products', icon: Icons.products },
            { label: 'Add Product', href: '/admin/products/new', icon: Icons.plus },
            { label: 'Low Stock Alerts', href: '/admin/inventory/alerts', icon: Icons.alert },
        ],
    },
    {
        title: 'Customers',
        items: [
            { label: 'Customer List', href: '/admin/customers', icon: Icons.users },
            { label: 'Measurement Profiles', href: '/admin/measurements', icon: Icons.measurements },
        ],
    },
    {
        title: 'Settings',
        items: [
            { label: 'Store Settings', href: '/admin/settings', icon: Icons.settings },
            { label: 'Shipping', href: '/admin/settings/shipping', icon: Icons.truck },
            { label: 'Notifications', href: '/admin/settings/notifications', icon: Icons.bell },
        ],
    },
];

// ============================================================================
// COMPONENT
// ============================================================================

interface AdminSidebarProps {
    name: string;
    email: string;
    avatar: string;
}

function NavGroupSection({ group, pathname }: { group: NavGroup; pathname: string }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-6 py-2 group/btn outline-none"
            >
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover/btn:text-gray-300 transition-colors">
                    {group.title}
                </span>
                <svg
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="flex flex-col gap-1 mt-1 px-3">
                    {group.items.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                    active
                                        ? 'bg-[#D4A853]/10 text-[#D4A853]'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                                style={active ? { borderLeft: '3px solid #D4A853', paddingLeft: '9px' } : { borderLeft: '3px solid transparent' }}
                            >
                                <span className={active ? 'text-[#D4A853]' : 'text-gray-500'}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function AdminSidebar({ name, email, avatar }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="w-[240px] h-full flex flex-col flex-shrink-0" style={{ backgroundColor: '#0f1035' }}>
            {/* Logo / Brand */}
            <div className="h-16 px-6 flex items-center flex-shrink-0 border-b border-white/10">
                <Link href="/admin" className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#D4A853] flex items-center justify-center text-[#0f1035] text-sm">F</span>
                    Fabloom <span className="text-[#D4A853] text-[10px] uppercase tracking-widest mt-1 ml-1">Admin</span>
                </Link>
            </div>

            {/* Scrollable Nav */}
            <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
                {MENU.map((group) => (
                    <NavGroupSection key={group.title} group={group} pathname={pathname} />
                ))}
            </nav>

            {/* Admin Profile Footer */}
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
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Logout
                    </button>
                </SignOutButton>
            </div>

            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }`}</style>
        </aside>
    );
}
