'use client';

import { usePathname } from 'next/navigation';

const TITLES: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/admin/dashboard': 'Dashboard',
    '/orders': 'Orders',
    '/admin/orders': 'Orders',
    '/production': 'Production',
    '/admin/production': 'Production',
    '/inventory': 'Inventory',
    '/admin/inventory': 'Inventory',
};

function getPageTitle(pathname: string): string {
    if (TITLES[pathname]) return TITLES[pathname];
    if (pathname.includes('/orders/')) return 'Order Detail';
    return 'Admin';
}

export default function AdminHeader() {
    const pathname = usePathname();
    const title = getPageTitle(pathname);

    return (
        <header className="h-16 bg-white border-b border-gray-200 px-6 lg:px-8 flex items-center flex-shrink-0 z-10">
            <h1 className="text-xl font-extrabold text-gray-900">{title}</h1>
        </header>
    );
}
