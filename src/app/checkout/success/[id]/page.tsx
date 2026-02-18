'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/store/useCartStore';

async function getOrder(id: string) {
    try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.success ? data.data : null;
    } catch (error) {
        console.error('Error fetching order:', error);
        return null;
    }
}

export default function OrderSuccessPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const clearCart = useCartStore((state) => state.clearCart);

    useEffect(() => {
        // Clear cart when success page mounts
        clearCart();

        // Fetch order details (optional)
        getOrder(id).then((data) => {
            setOrder(data);
            setLoading(false);
        });
    }, [id, clearCart]);

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle className="h-12 w-12 text-emerald-600" />
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-navy-900 mb-4">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-lg text-gray-600">
                        Thank you for your order. We'll send you a confirmation email shortly.
                    </p>
                </div>

                {/* Order Details Card */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        {loading ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ) : order ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600">Order Number</p>
                                    <p className="text-2xl font-bold text-navy-900">
                                        #{order.orderNumber}
                                    </p>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-sm text-gray-600 mb-2">Shipping To</p>
                                    <div className="text-sm">
                                        <p className="font-semibold">{order.shippingAddress.fullName}</p>
                                        <p className="text-gray-600">{order.shippingAddress.addressLine1}</p>
                                        <p className="text-gray-600">
                                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                        </p>
                                        <p className="text-gray-600">{order.shippingAddress.country}</p>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Total Amount</span>
                                        <span className="text-2xl font-bold text-emerald-600">
                                            ${order.totalAmount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Package className="h-4 w-4 text-emerald-600" />
                                        <span className="text-gray-600">
                                            Payment Method: <span className="font-medium">Cash on Delivery</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-600">Order ID: {id}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* What's Next */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8">
                    <h2 className="font-semibold text-navy-900 mb-3">What happens next?</h2>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-600 mt-0.5">✓</span>
                            <span>You'll receive an order confirmation email</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-600 mt-0.5">✓</span>
                            <span>We'll process your order within 1-2 business days</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-600 mt-0.5">✓</span>
                            <span>Custom stitching orders will be completed in 5-7 days</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-600 mt-0.5">✓</span>
                            <span>You'll receive tracking information once shipped</span>
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/products" className="flex-1">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                            Continue Shopping
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/" className="flex-1">
                        <Button variant="outline" className="w-full">
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
