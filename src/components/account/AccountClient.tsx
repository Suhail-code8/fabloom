'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';
import { useClerk } from '@clerk/nextjs';
import { useCartStore } from '@/store/useCartStore';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const MenuRow = ({ icon, label, href, isExternal = false }: { icon: React.ReactNode, label: string, href: string, isExternal?: boolean }) => {
    const Component = isExternal ? 'a' : Link;
    return (
        <Component href={href} {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="flex items-center gap-4 p-4 active:bg-gray-50 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 group-active:text-[#0f1035] group-active:border-[#0f1035] transition-colors">
                {icon}
            </div>
            <span className="flex-1 text-sm font-bold text-gray-900">{label}</span>
            <svg className="w-4 h-4 text-gray-400 group-active:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="9 18 15 12 9 6"/></svg>
        </Component>
    );
};

export default function AccountClient() {
    const { signOut } = useClerk();
    const { data, error, isLoading: swrLoading } = useSWR('/api/user/profile', fetcher, {
        shouldRetryOnError: false,
        errorRetryCount: 0
    });
    const [timedOut, setTimedOut] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => {
            if (swrLoading) setTimedOut(true);
        }, 8000); // 8s timeout for profile fetch
        return () => clearTimeout(t);
    }, [swrLoading]);

    if (error || timedOut || (data && data.error)) {
        return (
            <div className="p-8 text-center min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Unable to load profile</h2>
                <p className="text-sm text-gray-500 mb-6 max-w-xs">{timedOut ? "The request timed out. Please check your connection." : "Please sign in to view your account details."}</p>
                <Link href="/" className="px-6 py-2 bg-[#0f1035] text-white rounded-xl text-sm font-bold">Return Home</Link>
            </div>
        );
    }
    
    if (swrLoading) return (
        <div className="flex justify-center py-20 min-h-screen bg-gray-50">
            <div className="w-8 h-8 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const user = data?.user;
    const stats = data?.stats;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Profile */}
            <div className="bg-[#0f1035] text-white pt-10 pb-8 px-4 flex flex-col items-center text-center relative overflow-hidden">
                {/* Backdrop effect removed as noise.png is missing */}
                <div className="w-24 h-24 rounded-full border-4 border-[#D4A853] overflow-hidden relative mb-4 bg-gray-800 shadow-[0_0_20px_rgba(212,168,83,0.3)]">
                    {user?.avatar ? (
                        <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-extrabold uppercase">
                            {user?.name?.charAt(0)}
                        </div>
                    )}
                </div>
                <h1 className="text-xl font-extrabold tracking-tight mb-0.5">{user?.name}</h1>
                <p className="text-xs font-medium text-gray-400 mb-2">{user?.email}</p>
                <p className="text-[10px] font-bold text-[#D4A853] uppercase tracking-widest bg-[#D4A853]/10 px-2 py-0.5 rounded-full">
                    Member since {new Date(user?.createdAt).getFullYear()}
                </p>
            </div>

            <div className="max-w-2xl mx-auto px-4 -mt-4 relative z-10">
                {/* Stats Row */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex divide-x divide-gray-100 mb-6">
                    <div className="flex-1 text-center px-2">
                        <p className="text-2xl font-extrabold text-[#0f1035]">{stats?.ordersCount || 0}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Orders</p>
                    </div>
                    <div className="flex-1 text-center px-2">
                        <p className="text-2xl font-extrabold text-[#0f1035]">{stats?.profilesCount || 0}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Profiles</p>
                    </div>
                    <div className="flex-1 text-center px-2">
                        <p className="text-2xl font-extrabold text-[#0f1035]">{stats?.wishlistCount || 0}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Wishlist</p>
                    </div>
                </div>

                {/* Menu Sections */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                        <MenuRow 
                            icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>}
                            label="My Orders" href="/account/orders" 
                        />
                        <MenuRow 
                            icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                            label="Track an Order" href="/account/orders" 
                        />
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                        <MenuRow 
                            icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M21 12H3M12 3v18"/></svg>}
                            label="My Measurements" href="/account/measurements" 
                        />
                        <MenuRow 
                            icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
                            label="Saved Addresses" href="/account/addresses" 
                        />
                        <MenuRow 
                            icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}
                            label="Wishlist" href="/wishlist" 
                        />
                        <MenuRow 
                            icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
                            label="Notification Settings" href="/account/notifications" 
                        />
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                        <MenuRow 
                            icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>}
                            label="WhatsApp Support" href="https://wa.me/918086071591" isExternal 
                        />
                        <MenuRow 
                            icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
                            label="Returns & FAQs" href="#" 
                        />
                    </div>

                    {user?.role === 'admin' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-[#D4A853] overflow-hidden">
                            <MenuRow 
                                icon={<svg className="w-5 h-5 text-[#D4A853]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>}
                                label="Admin Dashboard" href="/dashboard" 
                            />
                        </div>
                    )}

                    <button 
                        onClick={() => {
                            useCartStore.getState().clearCart();
                            signOut({ redirectUrl: '/' });
                        }} 
                        className="w-full py-4 rounded-xl border-2 border-red-100 text-sm font-bold text-red-600 active:bg-red-50 transition-colors"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}
