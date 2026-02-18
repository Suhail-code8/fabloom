'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type FilterType = 'all' | 'stitching' | 'completed';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const url =
                filter === 'all'
                    ? '/api/admin/orders'
                    : `/api/admin/orders?filter=${filter}`;

            const res = await fetch(url, { cache: 'no-store' });
            const data = await res.json();

            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter((order) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            order.orderNumber.toLowerCase().includes(query) ||
            order.shippingAddress.fullName.toLowerCase().includes(query)
        );
    });

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            processing: 'bg-purple-100 text-purple-800',
            shipped: 'bg-indigo-100 text-indigo-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const hasStitchingItems = (order: any) => {
        return order.items.some((item: any) => item.stitchingDetails);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-serif font-bold text-navy-900">Orders</h1>
                <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-2">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                        className={filter === 'all' ? 'bg-emerald-600' : ''}
                    >
                        All Orders
                    </Button>
                    <Button
                        variant={filter === 'stitching' ? 'default' : 'outline'}
                        onClick={() => setFilter('stitching')}
                        className={filter === 'stitching' ? 'bg-emerald-600' : ''}
                    >
                        Stitching Orders
                    </Button>
                    <Button
                        variant={filter === 'completed' ? 'default' : 'outline'}
                        onClick={() => setFilter('completed')}
                        className={filter === 'completed' ? 'bg-emerald-600' : ''}
                    >
                        Completed
                    </Button>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg border">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No orders found
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order #</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.map((order) => (
                                <TableRow key={order._id} className="cursor-pointer hover:bg-gray-50">
                                    <TableCell className="font-medium">
                                        {order.orderNumber}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{order.shippingAddress.fullName}</p>
                                            <p className="text-sm text-gray-500">
                                                {order.shippingAddress.city}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span>{order.items.length} items</span>
                                            {hasStitchingItems(order) && (
                                                <Badge className="bg-gold-100 text-gold-700 text-xs">
                                                    Stitching
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        ${order.totalAmount.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/admin/orders/${order._id}`}>
                                            <Button variant="ghost" size="sm">
                                                View
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg border">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-navy-900 mt-2">{orders.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                    <p className="text-sm text-gray-600">Stitching Orders</p>
                    <p className="text-3xl font-bold text-gold-600 mt-2">
                        {orders.filter(hasStitchingItems).length}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">
                        ${orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
}
