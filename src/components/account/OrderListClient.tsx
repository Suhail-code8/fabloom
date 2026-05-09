'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function OrderListClient() {
    const { data, error, isLoading } = useSWR('/api/user/orders', fetcher, { refreshInterval: 60000 });
    const [filter, setFilter] = useState<'All' | 'Active' | 'Completed' | 'Cancelled'>('All');

    if (error) return <div className="p-8 text-center text-red-500">Failed to load orders.</div>;
    
    const orders = data?.orders || [];

    const filteredOrders = orders.filter((o: any) => {
        if (filter === 'All') return true;
        if (filter === 'Completed') return o.status === 'delivered';
        if (filter === 'Cancelled') return o.status === 'cancelled';
        if (filter === 'Active') return o.status !== 'delivered' && o.status !== 'cancelled';
        return true;
    });

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'pending': return <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest">Processing</span>;
            case 'processing': return <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest">In Transit</span>;
            case 'delivered': return <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest">Delivered</span>;
            case 'cancelled': return <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest">Cancelled</span>;
            default: return <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest">{status}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-10 flex items-center gap-3 shadow-sm">
                <button onClick={() => window.history.back()} className="p-1 active:scale-90 transition-transform">
                    <svg className="w-5 h-5 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <h1 className="text-xl font-extrabold text-[#0f1035]">My Orders</h1>
            </div>

            <div className="max-w-2xl mx-auto p-4">
                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                    {['All', 'Active', 'Completed', 'Cancelled'].map(t => (
                        <button 
                            key={t}
                            onClick={() => setFilter(t as any)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${filter === t ? 'bg-[#0f1035] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* List */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredOrders.length > 0 ? (
                    <div className="space-y-4">
                        {filteredOrders.map((order: any) => (
                            <Link href={`/account/orders/${order._id}`} key={order._id} className="block bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Number</p>
                                        <p className="text-sm font-mono font-extrabold text-gray-900">{order.orderNumber}</p>
                                    </div>
                                    {getStatusBadge(order.status)}
                                </div>
                                <div className="flex justify-between items-end pt-4 border-t border-gray-50">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        <p className="text-xs text-gray-500 font-medium mt-0.5">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                                    </div>
                                    <p className="text-base font-extrabold text-[#D4A853]">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        </div>
                        <h2 className="text-lg font-extrabold text-gray-900 mb-2">No {filter !== 'All' ? filter.toLowerCase() : ''} orders found</h2>
                        <p className="text-sm text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
                        <Link href="/" className="inline-block px-6 py-3 bg-[#D4A853] text-[#0f1035] font-bold text-sm rounded-xl active:scale-95 transition-transform">Start Shopping</Link>
                    </div>
                )}
            </div>
            
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
