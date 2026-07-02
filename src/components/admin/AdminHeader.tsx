'use client';

import { usePathname } from 'next/navigation';

const TITLES: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/dashboard': 'Dashboard',
    '/admin/orders': 'Orders',
    '/admin/production': 'Production',
    '/admin/inventory': 'Inventory',
    '/admin/customers': 'Customers',
    '/admin/measurements': 'Measurements',
    '/admin/analytics': 'Analytics',
    '/admin/settings': 'Settings',
    '/admin/settings/shipping': 'Shipping Settings',
    '/admin/settings/notifications': 'Notification Settings',
    '/admin/products/new': 'Add Product',
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
