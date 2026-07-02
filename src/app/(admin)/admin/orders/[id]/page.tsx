'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type StitchingStatus = 'pending' | 'cutting' | 'stitching' | 'quality_check' | 'ready';

const STITCHING_STAGES: { key: StitchingStatus; label: string }[] = [
    { key: 'pending', label: 'Pending' },
    { key: 'cutting', label: 'Cutting' },
    { key: 'stitching', label: 'Stitching' },
    { key: 'quality_check', label: 'QC' },
    { key: 'ready', label: 'Ready' },
];

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

function whatsAppHref(phone: string) {
    const digits = phone.replace(/\D/g, '');
    return `https://wa.me/${digits}`;
}

export default function AdminOrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openMeasurements, setOpenMeasurements] = useState<number | null>(0);

    useEffect(() => {
        async function fetchOrder() {
            try {
                const res = await fetch(`/api/admin/orders/${id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to load order');
                setOrder(data.data);
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : 'Failed to load order');
            } finally {
                setLoading(false);
            }
        }
        fetchOrder();
    }, [id]);

    async function updateStitchingStatus(itemId: string, newStatus: StitchingStatus) {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/orders/${id}/stitching-status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId, status: newStatus }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Update failed');

            const orderRes = await fetch(`/api/admin/orders/${id}`);
            const orderData = await orderRes.json();
            setOrder(orderData.data);
            toast.success('Stitching status updated');
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : 'Failed to update stitching');
        } finally {
            setSaving(false);
        }
    }

    async function updateOrderStatus(newStatus: string) {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/orders/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update status');
            setOrder(data.data);
            toast.success('Order status updated');
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : 'Failed to update status');
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="text-center py-16">
                <p className="text-red-500 font-medium mb-4">{error || 'Order not found'}</p>
                <Button variant="outline" onClick={() => router.push('/admin/orders')}>
                    Back to Orders
                </Button>
            </div>
        );
    }

    const phone = order.shippingAddress?.phone || '';

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <button
                        onClick={() => router.push('/admin/orders')}
                        className="text-sm text-gray-500 hover:text-gray-900 mb-2"
                    >
                        ← Back to Orders
                    </button>
                    <h1 className="text-2xl font-extrabold text-gray-900">Order {order.orderNumber}</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={order.status}
                        disabled={saving}
                        onChange={(e) => updateOrderStatus(e.target.value)}
                        className="text-sm border border-gray-200 rounded-xl px-3 py-2 font-semibold bg-white"
                    >
                        {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                    {phone && (
                        <a
                            href={whatsAppHref(phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-green-600 text-white hover:bg-green-700"
                        >
                            Contact on WhatsApp
                        </a>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border rounded-xl p-5">
                    <h2 className="text-xs font-bold text-gray-500 uppercase mb-3">Customer</h2>
                    <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                    <p className="text-sm text-gray-600 mt-1">{order.customerEmail || '—'}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
                </div>
                <div className="bg-white border rounded-xl p-5">
                    <h2 className="text-xs font-bold text-gray-500 uppercase mb-3">Shipping Address</h2>
                    <p className="text-sm text-gray-700">{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && (
                        <p className="text-sm text-gray-700">{order.shippingAddress.addressLine2}</p>
                    )}
                    <p className="text-sm text-gray-700">
                        {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                        {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-sm text-gray-700">{order.shippingAddress.country}</p>
                </div>
            </div>

            <div className="bg-white border rounded-xl p-5">
                <h2 className="text-xs font-bold text-gray-500 uppercase mb-3">Payment</h2>
                <div className="flex flex-wrap gap-4 text-sm">
                    <span>
                        Total: <strong>₹{order.totalAmount?.toLocaleString('en-IN')}</strong>
                    </span>
                    <Badge className={STATUS_COLORS[order.paymentStatus] || 'bg-gray-100'}>
                        {order.paymentStatus}
                    </Badge>
                    <span className="uppercase text-gray-500">{order.paymentMethod}</span>
                </div>
            </div>

            <div className="bg-white border rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b">
                    <h2 className="text-xs font-bold text-gray-500 uppercase">Items ({order.items.length})</h2>
                </div>
                <div className="divide-y">
                    {order.items.map((item: any, idx: number) => (
                        <div key={item._id || idx} className="p-5">
                            <div className="flex gap-4">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                    {item.productImage && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{item.productName}</p>
                                    <p className="text-xs text-gray-500 capitalize">{item.itemType}</p>
                                    <p className="text-sm font-bold mt-1">
                                        ₹{item.totalPrice?.toLocaleString('en-IN')}
                                    </p>
                                </div>
                            </div>

                            {item.stitchingDetails && (
                                <div className="mt-4 border border-amber-200 rounded-xl overflow-hidden">
                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 text-left"
                                        onClick={() =>
                                            setOpenMeasurements(openMeasurements === idx ? null : idx)
                                        }
                                    >
                                        <span className="text-xs font-bold text-amber-900 uppercase">
                                            Measurement snapshot
                                        </span>
                                        <span className="text-xs text-amber-700">
                                            {item.stitchingDetails.status}
                                        </span>
                                    </button>
                                    {openMeasurements === idx && (
                                        <div className="p-4 bg-white">
                                            <div className="grid grid-cols-3 gap-2 mb-4">
                                                {Object.entries(item.stitchingDetails.measurements || {}).map(
                                                    ([key, val]) => (
                                                        <div key={key} className="text-center bg-gray-50 rounded-lg py-2">
                                                            <p className="text-[10px] text-gray-500 capitalize">
                                                                {key.replace(/([A-Z])/g, ' $1')}
                                                            </p>
                                                            <p className="text-sm font-bold">{String(val)}</p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                            {item.stitchingDetails.specialInstructions && (
                                                <p className="text-xs text-gray-600 italic mb-4">
                                                    {item.stitchingDetails.specialInstructions}
                                                </p>
                                            )}
                                            <p className="text-xs font-bold text-gray-700 mb-2">Production stage</p>
                                            <div className="flex flex-wrap gap-2">
                                                {STITCHING_STAGES.map(({ key, label }) => (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        disabled={saving || item.stitchingDetails.status === key}
                                                        onClick={() => updateStitchingStatus(item._id, key)}
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                            item.stitchingDetails.status === key
                                                                ? 'bg-[#D4A853] text-white'
                                                                : 'bg-amber-100 text-amber-900'
                                                        }`}
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
