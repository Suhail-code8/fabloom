'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const tabs = [
        { name: 'General', href: '/admin/settings' },
        { name: 'Shipping', href: '/admin/settings/shipping' },
        { name: 'Notifications', href: '/admin/settings/notifications' },
    ];

    return (
        <div className="flex flex-col h-full bg-gray-50 min-h-screen">
            <AdminHeader />
            
            <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* Left Sidebar Navigation */}
                    <aside className="w-full md:w-1/4">
                        <nav className="flex flex-col space-y-1">
                            {tabs.map((tab) => {
                                const isActive = pathname === tab.href;
                                return (
                                    <Link
                                        key={tab.href}
                                        href={tab.href}
                                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                                            isActive
                                                ? 'bg-[#0f1035] text-white'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                    >
                                        {tab.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Right Content Area */}
                    <main className="w-full md:w-3/4">
                        {children}
                    </main>
                    
                </div>
            </div>
        </div>
    );
}
