'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// ============================================================================
// STITCHING ITEM COMPONENT
// ============================================================================
function StitchingTrackingCard({ item }: { item: any }) {
    const [expanded, setExpanded] = useState(false);
    const details = item.stitchingDetails;

    // Mini timeline mapping
    const stages = ['pending', 'cutting', 'stitching', 'quality_check', 'ready', 'delivered'];
    const labels = ['Received', 'Cutting', 'Stitching', 'QC', 'Ready', 'Delivered'];
    
    // Find current stage index. If not found (e.g. cancelled), defaults to -1.
    const currentIdx = stages.indexOf(details.status);

    return (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-4">
            <div className="flex gap-4">
                <div className="w-[60px] h-[60px] bg-gray-100 rounded-xl overflow-hidden relative flex-shrink-0">
                    <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-[#92650a] bg-[#D4A853]/10">
                        Custom Stitching
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 mt-1">{item.productName}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{item.meters}m · ₹{item.totalPrice.toLocaleString('en-IN')}</p>
                </div>
            </div>

            {/* Mini Stitching Stepper */}
            {currentIdx !== -1 && (
                <div className="mt-5 mb-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Garment Production Progress</p>
                    <div className="flex justify-between relative px-2">
                        {/* Connecting Line */}
                        <div className="absolute top-2.5 left-6 right-6 h-0.5 bg-gray-100 -z-10" />
                        <div 
                            className="absolute top-2.5 left-6 h-0.5 bg-[#D4A853] -z-10 transition-all duration-500" 
                            style={{ width: `calc(${(Math.min(currentIdx, 4) / 4) * 100}% - 48px)` }}
                        />

                        {labels.slice(0, 5).map((label, idx) => {
                            const isCompleted = idx < currentIdx;
                            const isActive = idx === currentIdx;
                            return (
                                <div key={label} className="flex flex-col items-center">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-500 ${isCompleted ? 'bg-[#D4A853]' : isActive ? 'bg-white border-2 border-[#D4A853]' : 'bg-white border-2 border-gray-200'}`}>
                                        {isCompleted && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12"/></svg>}
                                        {isActive && <div className="w-1.5 h-1.5 bg-[#D4A853] rounded-full animate-pulse" />}
                                    </div>
                                    <span className={`text-[9px] font-bold mt-1.5 ${isActive ? 'text-[#0f1035]' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>{label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Admin Note Bubble */}
            {details.adminNotes && (
                <div className="mt-4 bg-[#0f1035]/5 border border-[#0f1035]/10 p-3 rounded-xl rounded-tl-none relative">
                    <p className="text-xs text-[#0f1035] font-medium leading-relaxed">
                        <span className="font-bold opacity-70">Tailor Note:</span> "{details.adminNotes}"
                    </p>
                </div>
            )}

            {/* Measurement Snapshot Accordion */}
            <div className="mt-4 pt-3 border-t border-gray-100">
                <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between text-xs font-bold text-[#D4A853]">
                    View saved measurements
                    <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {expanded && (
                    <div className="mt-3 grid grid-cols-2 gap-y-2 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
                        {Object.entries(details.measurements || {}).map(([key, val]) => (
                            <div key={key} className="flex justify-between pr-4">
                                <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span className="font-bold text-gray-900">{val as number}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function OrderTrackingClient({ orderId }: { orderId: string }) {
    const { data, error, isLoading } = useSWR(`/api/user/orders/${orderId}`, fetcher, { refreshInterval: 60000 });

    if (error) return <div className="p-8 text-center text-red-500">Failed to load order tracking.</div>;
    if (isLoading) return (
        <div className="flex justify-center py-20 min-h-screen bg-gray-50">
            <div className="w-8 h-8 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const order = data?.order;
    if (!order) return <div className="p-8 text-center">Order not found.</div>;

    const hasStitching = order.items.some((i: any) => i.stitchingDetails);

    // Global Vertical Timeline Logic
    const timelineSteps = [
        { key: 'placed', label: 'Order Placed', desc: 'We have received your order.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0" /></svg> },
        { key: 'payment', label: 'Payment Confirmed', desc: 'Secure payment processed.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
        ...(hasStitching ? [{ key: 'processing', label: 'Stitching in Progress', desc: 'Check individual garment cards for detailed progress.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg> }] : []),
        { key: 'dispatched', label: 'Dispatched', desc: 'Your package is on its way.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
        { key: 'delivered', label: 'Delivered', desc: 'Delivered to your address.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> }
    ];

    // Determine Global Step Index
    let currentGlobalIdx = 0;
    if (order.status === 'cancelled') {
        currentGlobalIdx = -1; // Cancelled completely
    } else if (order.status === 'delivered') {
        currentGlobalIdx = 4;
    } else if (order.status === 'dispatched') {
        currentGlobalIdx = 3;
    } else if (order.status === 'processing') {
        currentGlobalIdx = 2; // Stitching or general processing
    } else if (order.paymentStatus === 'paid') {
        currentGlobalIdx = 1;
    }

    const getStatusColor = (status: string) => {
        if (status === 'delivered') return 'text-green-600 bg-green-100';
        if (status === 'cancelled') return 'text-red-600 bg-red-100';
        return 'text-amber-700 bg-amber-100';
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-[#0f1035] text-white pt-12 pb-24 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-[0.02] rounded-full translate-x-20 -translate-y-20 blur-3xl pointer-events-none" />
                <button onClick={() => window.history.back()} className="absolute top-4 left-4 p-2 active:scale-90 transition-transform">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <div className="max-w-2xl mx-auto mt-4">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest mb-3 ${getStatusColor(order.status)}`}>
                        {order.status === 'pending' ? 'Processing' : order.status}
                    </span>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Number</p>
                    <h1 className="text-3xl font-mono font-extrabold tracking-widest">{order.orderNumber}</h1>
                    <p className="text-xs text-gray-400 mt-2 font-medium">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 -mt-16 relative z-10 space-y-6">
                
                {/* HERO: Vertical Timeline */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-sm font-extrabold text-gray-900 mb-6 uppercase tracking-wider">Delivery Tracking</h2>
                    <div className="relative">
                        {order.status === 'cancelled' ? (
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-red-600">Order Cancelled</h3>
                                    <p className="text-xs text-gray-500 mt-1">This order has been cancelled and will not be delivered.</p>
                                </div>
                            </div>
                        ) : (
                            timelineSteps.map((step, idx) => {
                                const isCompleted = idx < currentGlobalIdx;
                                const isActive = idx === currentGlobalIdx;
                                const isLast = idx === timelineSteps.length - 1;

                                return (
                                    <div key={step.key} className="flex gap-4 relative pb-8 last:pb-0">
                                        {/* Vertical Connecting Line */}
                                        {!isLast && (
                                            <div className="absolute top-8 left-[15px] bottom-0 w-0.5 -ml-px bg-gray-100">
                                                {isCompleted && <div className="w-full h-full bg-[#D4A853]" />}
                                            </div>
                                        )}

                                        {/* Icon Node */}
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 bg-white transition-colors duration-500 ${isCompleted ? 'border-[#D4A853] text-[#D4A853]' : isActive ? 'border-[#0f1035] text-[#0f1035] shadow-[0_0_0_4px_rgba(15,16,53,0.1)]' : 'border-gray-200 text-gray-300'}`}>
                                            {isCompleted ? (
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12"/></svg>
                                            ) : (
                                                step.icon
                                            )}
                                        </div>

                                        {/* Text Content */}
                                        <div className="pt-1.5 flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className={`text-sm font-bold ${isActive ? 'text-[#0f1035]' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {step.label}
                                                </h3>
                                                {isActive && <span className="text-[10px] font-bold text-[#D4A853] bg-[#D4A853]/10 px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1.5 animate-pulse"><div className="w-1.5 h-1.5 bg-[#D4A853] rounded-full"/>In Progress</span>}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* ITEMS SECTION */}
                <div>
                    <h2 className="text-sm font-extrabold text-gray-900 mb-4 ml-1 uppercase tracking-wider">Order Items</h2>
                    {order.items.map((item: any, idx: number) => {
                        if (item.stitchingDetails) {
                            return <StitchingTrackingCard key={idx} item={item} />;
                        } else {
                            // Regular readymade/accessory item
                            return (
                                <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-4 flex gap-4 items-center">
                                    <div className="w-[60px] h-[60px] bg-gray-100 rounded-xl overflow-hidden relative flex-shrink-0">
                                        <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-gray-900 truncate">{item.productName}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''}</p>
                                    </div>
                                    <div className="text-sm font-extrabold text-[#0f1035]">
                                        ₹{item.totalPrice.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>

                {/* SUMMARY */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-8">
                    <h2 className="text-sm font-extrabold text-gray-900 mb-4 uppercase tracking-wider">Payment Details</h2>
                    <div className="space-y-2.5 text-sm text-gray-600 border-b border-gray-100 pb-3 mb-3">
                        <div className="flex justify-between">
                            <span>Payment Method</span>
                            <span className="font-bold text-gray-900 uppercase">{order.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-bold text-gray-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="font-bold text-gray-900">{order.shippingCost === 0 ? 'Free' : `₹${order.shippingCost}`}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-base font-extrabold text-gray-900">Total Paid</span>
                        <span className="text-xl font-extrabold text-[#D4A853]">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
