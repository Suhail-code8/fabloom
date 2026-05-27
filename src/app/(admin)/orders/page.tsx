'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type FilterType = 'all' | 'pending' | 'processing' | 'delivered';

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const PAYMENT_COLORS: Record<string, string> = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
};

export default function AdminOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function fetchOrders() {
            setLoading(true);
            try {
                const url =
                    filter === 'all'
                        ? '/api/admin/orders'
                        : `/api/admin/orders?filter=${filter}`;
                const res = await fetch(url, { cache: 'no-store' });
                const data = await res.json();
                if (data.success) setOrders(data.data || []);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, [filter]);

    const filteredOrders = orders.filter((order) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            order.orderNumber?.toLowerCase().includes(q) ||
            order.shippingAddress?.fullName?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-gray-900">Orders</h1>
                <p className="text-sm text-gray-500 mt-1">All customer orders, newest first</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                    {(
                        [
                            ['all', 'All'],
                            ['pending', 'Pending'],
                            ['processing', 'Processing'],
                            ['delivered', 'Delivered'],
                        ] as const
                    ).map(([id, label]) => (
                        <button
                            key={id}
                            onClick={() => setFilter(id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                                filter === id
                                    ? 'bg-[#0f1035] text-white'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by order #..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <div className="w-8 h-8 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <p className="p-12 text-center text-sm text-gray-500">No orders found</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                    <th className="text-left p-4">Order #</th>
                                    <th className="text-left p-4">Customer</th>
                                    <th className="text-left p-4">Items</th>
                                    <th className="text-left p-4">Total</th>
                                    <th className="text-left p-4">Payment</th>
                                    <th className="text-left p-4">Status</th>
                                    <th className="text-left p-4">Date</th>
                                    <th className="text-left p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => router.push(`/admin/orders/${order._id}`)}
                                    >
                                        <td className="p-4 font-bold text-gray-900">{order.orderNumber}</td>
                                        <td className="p-4">
                                            <p className="font-medium">{order.shippingAddress?.fullName}</p>
                                            <p className="text-xs text-gray-500">{order.shippingAddress?.city}</p>
                                        </td>
                                        <td className="p-4">{order.items?.length ?? 0}</td>
                                        <td className="p-4 font-semibold">
                                            ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                                        </td>
                                        <td className="p-4">
                                            <Badge className={PAYMENT_COLORS[order.paymentStatus] || 'bg-gray-100'}>
                                                {order.paymentStatus}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <Badge className={STATUS_COLORS[order.status] || 'bg-gray-100'}>
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                            <Link
                                                href={`/admin/orders/${order._id}`}
                                                className="text-xs font-bold text-[#D4A853] hover:underline"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
