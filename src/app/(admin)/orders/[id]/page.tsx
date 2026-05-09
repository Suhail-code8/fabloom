'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ============================================================================
// TYPES
// ============================================================================

type StitchingStatus = 'pending' | 'cutting' | 'stitching' | 'quality_check' | 'ready' | 'delivered';

const STITCHING_STAGES: { key: StitchingStatus; label: string }[] = [
    { key: 'pending',       label: 'Pending' },
    { key: 'cutting',       label: 'Cutting' },
    { key: 'stitching',     label: 'Stitching' },
    { key: 'quality_check', label: 'Quality Check' },
    { key: 'ready',         label: 'Ready' },
    { key: 'delivered',     label: 'Delivered' },
];

const ORDER_STATUS_COLORS: Record<string, string> = {
    pending:    'bg-yellow-100 text-yellow-800',
    confirmed:  'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped:    'bg-indigo-100 text-indigo-800',
    delivered:  'bg-green-100 text-green-800',
    cancelled:  'bg-red-100 text-red-800',
};

// ============================================================================
// COMPONENT
// ============================================================================

export default function AdminOrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router  = useRouter();

    const [order,   setOrder]   = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving,  setSaving]  = useState(false);
    const [error,   setError]   = useState<string | null>(null);

    // Load order
    useEffect(() => {
        async function fetchOrder() {
            try {
                const res  = await fetch(`/api/admin/orders/${id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to load order');
                setOrder(data.data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchOrder();
    }, [id]);

    // Update a single item's stitching status
    async function updateStitchingStatus(itemIndex: number, newStatus: StitchingStatus) {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/orders/${id}/stitching-status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemIndex, status: newStatus }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Update failed');
            setOrder(data.data);
        } catch (e: any) {
            alert(`Error: ${e.message}`);
        } finally {
            setSaving(false);
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────

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
                <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-3 transition-colors"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
                        Back to Orders
                    </button>
                    <h1 className="text-2xl font-extrabold text-gray-900">
                        Order {order.orderNumber}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Placed {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <Badge className={ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}>
                    {order.status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Customer Info */}
                <div className="md:col-span-1 bg-white border rounded-xl p-5">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Customer</h2>
                    <div className="space-y-2 text-sm">
                        <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                        <p className="text-gray-600">{order.shippingAddress.phone}</p>
                        <div className="pt-2 border-t">
                            <p className="text-gray-700">{order.shippingAddress.addressLine1}</p>
                            {order.shippingAddress.addressLine2 && (
                                <p className="text-gray-700">{order.shippingAddress.addressLine2}</p>
                            )}
                            <p className="text-gray-700">
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                            </p>
                            <p className="text-gray-700">{order.shippingAddress.country}</p>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="md:col-span-2 bg-white border rounded-xl p-5">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Payment Summary</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>₹{order.subtotal?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span>{order.shippingCost === 0 ? 'Free' : `₹${order.shippingCost}`}</span>
                        </div>
                        {order.tax > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax</span>
                                <span>₹{order.tax?.toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-base border-t pt-2">
                            <span>Total</span>
                            <span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 pt-1">
                            <span>Payment method</span>
                            <span className="uppercase">{order.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Payment status</span>
                            <span className={order.paymentStatus === 'paid' ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}>
                                {order.paymentStatus}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-white border rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                        Items ({order.items.length})
                    </h2>
                </div>

                <div className="divide-y">
                    {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="p-5">
                            <div className="flex gap-4">
                                {/* Product image */}
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                    {item.productImage && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">{item.productName}</p>
                                    <p className="text-xs text-gray-500 mt-0.5 capitalize">{item.itemType}</p>

                                    {/* Readymade / Accessory details */}
                                    {(item.itemType === 'readymade' || item.itemType === 'accessory') && (
                                        <div className="flex gap-3 mt-1 text-xs text-gray-600">
                                            {item.size     && <span>Size: <strong>{item.size}</strong></span>}
                                            {item.color    && <span>Color: <strong>{item.color}</strong></span>}
                                            {item.quantity && <span>Qty: <strong>{item.quantity}</strong></span>}
                                            {item.price    && <span>₹{item.price?.toLocaleString('en-IN')} each</span>}
                                        </div>
                                    )}

                                    {/* Fabric details */}
                                    {item.itemType === 'fabric' && !item.stitchingDetails && (
                                        <div className="flex gap-3 mt-1 text-xs text-gray-600">
                                            <span>Meters: <strong>{item.meters}</strong></span>
                                            <span>₹{item.pricePerMeter}/m</span>
                                        </div>
                                    )}
                                </div>

                                {/* Total price */}
                                <div className="text-right shrink-0">
                                    <p className="font-bold text-gray-900">
                                        ₹{item.totalPrice?.toLocaleString('en-IN')}
                                    </p>
                                </div>
                            </div>

                            {/* Stitching details block */}
                            {item.stitchingDetails && (
                                <div
                                    className="mt-4 rounded-xl p-4"
                                    style={{ backgroundColor: '#fefce8', border: '1px solid #fde68a' }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-xs font-bold text-yellow-800 uppercase tracking-wider">
                                            ✂ Stitching Order
                                        </p>
                                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                            {item.stitchingDetails.status || 'pending'}
                                        </Badge>
                                    </div>

                                    {/* Measurements */}
                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                        {Object.entries(item.stitchingDetails.measurements || {}).map(([key, val]) => (
                                            <div key={key} className="text-center bg-white rounded-lg py-1.5 px-2">
                                                <p className="text-[10px] text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                                <p className="text-sm font-bold text-gray-900">{String(val)}&quot;</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Special instructions */}
                                    {item.stitchingDetails.specialInstructions && (
                                        <p className="text-xs text-gray-600 italic mb-3">
                                            &ldquo;{item.stitchingDetails.specialInstructions}&rdquo;
                                        </p>
                                    )}

                                    {/* Status update */}
                                    <div>
                                        <p className="text-xs font-semibold text-gray-700 mb-2">Update Production Stage:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {STITCHING_STAGES.map(({ key, label }) => (
                                                <button
                                                    key={key}
                                                    disabled={saving || item.stitchingDetails.status === key}
                                                    onClick={() => updateStitchingStatus(idx, key)}
                                                    className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 disabled:opacity-50"
                                                    style={{
                                                        backgroundColor: item.stitchingDetails.status === key
                                                            ? '#D4A853'
                                                            : 'rgba(212,168,83,0.12)',
                                                        color: item.stitchingDetails.status === key ? '#fff' : '#92650a',
                                                        cursor: saving ? 'wait' : item.stitchingDetails.status === key ? 'default' : 'pointer',
                                                    }}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
