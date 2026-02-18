'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Package, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import TailorJobCard from '@/components/admin/TailorJobCard';

export default function AdminOrderDetailPage() {
    const params = useParams();
    const orderId = Array.isArray(params.id) ? params.id[0] : params.id;
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            const fetchOrder = async () => {
                try {
                    const res = await fetch(`/api/admin/orders/${orderId}`, { cache: 'no-store' });
                    const data = await res.json();

                    if (data.success) {
                        setOrder(data.data);
                    }
                } catch (error) {
                    console.error('Error fetching order:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchOrder();
        }
    }, [orderId]);

    const updateOrderStatus = async (status: string) => {
        try {
            if (!orderId) {
                return;
            }

            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            const data = await res.json();

            if (data.success) {
                setOrder(data.data);
                alert('Order status updated!');
            } else {
                alert(`Failed to update status: ${data.error || data.message}`);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const updateStitchingStatus = async (itemId: string, stitchingStatus: string) => {
        try {
            if (!orderId) {
                return;
            }

            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId, stitchingStatus }),
            });

            const data = await res.json();

            if (data.success) {
                setOrder(data.data);
                alert('Stitching status updated!');
            } else {
                alert(`Failed to update stitching status: ${data.error || data.message}`);
            }
        } catch (error) {
            console.error('Error updating stitching status:', error);
            alert('Failed to update stitching status');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-navy-900">Order not found</h2>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/admin/orders"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-emerald-600 mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Orders
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-navy-900">
                            Order #{order.orderNumber}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Order Status Updater */}
                    <div className="flex items-center gap-4">
                        <div>
                            <label className="text-sm text-gray-600 block mb-2">Order Status</label>
                            <Select value={order.status} onValueChange={updateOrderStatus}>
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {order.items.map((item: any, index: number) => (
                                <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-semibold">{item.productName}</h3>
                                            <p className="text-sm text-gray-600">
                                                {item.itemType === 'fabric' && `${item.meters} meters`}
                                                {item.itemType === 'readymade' && `Size: ${item.size}`}
                                                {item.quantity && ` • Qty: ${item.quantity}`}
                                            </p>
                                        </div>
                                        <p className="font-semibold">${item.totalPrice?.toFixed(2)}</p>
                                    </div>

                                    {/* Stitching Status Updater */}
                                    {item.stitchingDetails && (
                                        <div className="mt-3 flex items-center gap-4 bg-emerald-50 p-3 rounded-lg">
                                            <Badge className="bg-gold-600 text-white">
                                                {item.stitchingDetails.style || 'Custom Stitching'}
                                            </Badge>
                                            <div className="flex-1">
                                                <label className="text-xs text-gray-600 block mb-1">
                                                    Stitching Status
                                                </label>
                                                <Select
                                                    value={item.stitchingDetails.status}
                                                    onValueChange={(value) =>
                                                        updateStitchingStatus(item._id, value)
                                                    }
                                                >
                                                    <SelectTrigger className="w-40 h-8 text-sm">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="in_progress">Cutting</SelectItem>
                                                        <SelectItem value="completed">Sewing</SelectItem>
                                                        <SelectItem value="delivered">Finished</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Tailor Job Cards */}
                    {order.items.some((item: any) => item.stitchingDetails) && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-serif font-bold text-navy-900">
                                Tailor Job Cards
                            </h2>
                            {order.items
                                .filter((item: any) => item.stitchingDetails)
                                .map((item: any, index: number) => (
                                    <TailorJobCard
                                        key={index}
                                        item={item}
                                        orderNumber={order.orderNumber}
                                        customerName={order.shippingAddress.fullName}
                                    />
                                ))}
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Customer
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p className="font-semibold">{order.shippingAddress.fullName}</p>
                                <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Shipping Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm space-y-1">
                                <p>{order.shippingAddress.addressLine1}</p>
                                {order.shippingAddress.addressLine2 && (
                                    <p>{order.shippingAddress.addressLine2}</p>
                                )}
                                <p>
                                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                </p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span>${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax</span>
                                <span>${order.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="text-emerald-600">FREE</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-semibold">
                                <span>Total</span>
                                <span className="text-emerald-600">
                                    ${order.totalAmount.toFixed(2)}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 pt-2 border-t">
                                <p>Payment Method: {order.paymentMethod.toUpperCase()}</p>
                                <p>Payment Status: {order.paymentStatus}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
