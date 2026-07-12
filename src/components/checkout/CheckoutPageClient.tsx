'use client';

import { useState, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import Image from 'next/image';
import { z } from 'zod';
import { toast } from 'sonner';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function CheckoutPageClient() {
    const { items, getTotal, clearCart } = useCartStore();
    
    // Core state
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [isLoading, setIsLoading] = useState(false);
    
    // Step 1: Address
    const { data: addressData, mutate: mutateAddresses } = useSWR('/api/user/addresses', fetcher);
    const [selectedAddressIdx, setSelectedAddressIdx] = useState<number>(0);
    const [showNewAddress, setShowNewAddress] = useState(false);
    const [newAddr, setNewAddr] = useState({ fullName: '', phone: '', addressLine1: '', addressLine2: '', pincode: '', city: '', state: '', isDefault: false });
    const [pincodeLoading, setPincodeLoading] = useState(false);

    // Step 3: Payment & Order
    const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
    const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
    const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string | null>(null);

    const subtotal = getTotal();
    const shippingCost = subtotal >= 999 ? 0 : 99;
    const totalAmount = subtotal + shippingCost;
    
    const addresses = addressData?.addresses || [];

    // Redirect if cart is empty
    useEffect(() => {
        if (items.length === 0 && step !== 4) {
            window.location.href = '/cart';
        }
    }, [items, step]);

    // ============================================================================
    // ADDRESS HANDLERS
    // ============================================================================
    const AddressSchema = z.object({
        fullName: z.string().min(1, "Full Name is required"),
        phone: z.string().length(10, "Phone number must be exactly 10 digits"),
        addressLine1: z.string().min(1, "Address Line 1 is required"),
        addressLine2: z.string().optional(),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        postalCode: z.string().length(6, "Pincode must be exactly 6 digits")
    });

    const handlePincodeChange = async (val: string) => {
        setNewAddr(prev => ({ ...prev, pincode: val }));
        if (val.length === 6) {
            setPincodeLoading(true);
            try {
                const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
                const data = await res.json();
                if (data[0].Status === 'Success') {
                    const postOffice = data[0].PostOffice[0];
                    setNewAddr(prev => ({ ...prev, city: postOffice.District, state: postOffice.State }));
                }
            } catch (err: any) {
                console.warn('Failed to fetch pincode data:', err.message);
            }
            setPincodeLoading(false);
        }
    };

    const handleSaveAddress = async () => {
        const payload = {
            fullName: newAddr.fullName,
            phone: newAddr.phone,
            addressLine1: newAddr.addressLine1,
            addressLine2: newAddr.addressLine2,
            city: newAddr.city,
            state: newAddr.state,
            postalCode: newAddr.pincode,
            isDefault: newAddr.isDefault
        };

        const parsed = AddressSchema.safeParse(payload);
        if (!parsed.success) {
            toast.error(parsed.error.errors[0].message);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/user/addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                await mutateAddresses();
                setShowNewAddress(false);
                setSelectedAddressIdx(data.addresses.length - 1);
            }
        } catch (err) {
            console.error(err);
        }
        setIsLoading(false);
    };

    // ============================================================================
    // RAZORPAY / ORDER HANDLERS
    // ============================================================================

    const handlePlaceOrder = async () => {
        if (!addresses[selectedAddressIdx]) return toast.error('Please select an address');
        setIsLoading(true);

        const basePayload = {
            items,
            shippingAddress: addresses[selectedAddressIdx],
            paymentMethod,
            subtotal,
            shippingCost,
            totalAmount
        };

        try {
            // 1. Create order on server (this also handles atomic stock reduction)
            const orderRes = await fetch('/api/checkout/place-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(basePayload)
            });
            const orderData = await orderRes.json();

            if (!orderData.success) {
                throw new Error(orderData.error || 'Failed to place order');
            }

            if (paymentMethod === 'cod') {
                setConfirmedOrderId(orderData.orderId);
                setConfirmedOrderNumber(orderData.orderNumber);
                clearCart();
                setStep(4);
            } else {
                // Online Payment via Razorpay
                const options = {
                    key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock1234567890',
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: 'Fabloom',
                    description: 'Premium Fabrics & Stitching',
                    order_id: orderData.razorpayOrderId,
                    handler: async function (response: any) {
                        // 2. Verify payment on server
                        const verifyRes = await fetch('/api/checkout/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                orderId: orderData.orderId,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpaySignature: response.razorpay_signature
                            })
                        });
                        const verifyData = await verifyRes.json();
                        
                        if (verifyData.success) {
                            setConfirmedOrderId(orderData.orderId);
                            setConfirmedOrderNumber(orderData.orderNumber);
                            clearCart();
                            setStep(4);
                        } else {
                            toast.error('Payment verification failed: ' + verifyData.error);
                            // Redirect to orders page so user can retry payment later
                            window.location.href = `/account/orders/${orderData.orderId}`;
                        }
                    },
                    prefill: {
                        name: addresses[selectedAddressIdx].fullName,
                        contact: addresses[selectedAddressIdx].phone,
                    },
                    theme: {
                        color: '#0f1035'
                    }
                };

                const rzp = new (window as any).Razorpay(options);
                rzp.on('payment.failed', function (response: any) {
                    toast.error('Payment Failed. Please try again from your orders page.');
                    window.location.href = `/account/orders/${orderData.orderId}`;
                });
                rzp.open();
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'An error occurred while placing your order.');
        }
        setIsLoading(false);
    };

    // ============================================================================
    // RENDER HELPERS
    // ============================================================================
    
    // Group items for Review
    const stitchingItems = useMemo(() => items.filter(i => i.itemType === 'stitching'), [items]);
    const readymadeItems = useMemo(() => items.filter(i => i.itemType === 'readymade'), [items]);
    const accessoryItems = useMemo(() => items.filter(i => i.itemType === 'accessory'), [items]);

    return (
        <div className="min-h-screen bg-[rgba(255,255,255,0.02)] store-pb-no-nav pb-28">
            {/* Header */}
            <div className="bg-[rgba(255,255,255,0.02)] px-4 py-4 border-b border-[rgba(255,255,255,0.08)] flex items-center gap-3 sticky top-0 z-10">
                {step < 4 && (
                    <button onClick={() => step === 1 ? window.history.back() : setStep(s => (s - 1) as any)} className="p-1 active:scale-90 transition-transform">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                )}
                <h1 className="text-lg font-extrabold text-white flex-1">
                    {step === 1 ? 'Delivery Address' : step === 2 ? 'Order Review' : step === 3 ? 'Payment' : 'Order Confirmed'}
                </h1>
                {step < 4 && <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step {step}/3</span>}
            </div>

            {/* Stepper Progress */}
            {step < 4 && (
                <div className="h-1 bg-gray-200 w-full">
                    <div className="h-full bg-[#D4A853] transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
                </div>
            )}

            <div className="p-4 max-w-xl mx-auto">
                {/* STEP 1: ADDRESS */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        {!showNewAddress ? (
                            <>
                                {addresses.length > 0 ? (
                                    <div className="space-y-3 mb-6">
                                        {addresses.map((addr: any, idx: number) => (
                                            <div 
                                                key={idx} 
                                                onClick={() => setSelectedAddressIdx(idx)}
                                                className={`p-4 rounded-sm border-2 cursor-pointer transition-colors ${selectedAddressIdx === idx ? 'border-[#0f1035] bg-[#0f1035]/5' : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.1)]'}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedAddressIdx === idx ? 'border-[#0f1035]' : 'border-[rgba(255,255,255,0.15)]'}`}>
                                                        {selectedAddressIdx === idx && <div className="w-2.5 h-2.5 bg-[#D4A853] rounded-full" />}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="text-sm font-extrabold text-white">{addr.fullName}</h3>
                                                            {addr.isDefault && <span className="text-[9px] font-bold uppercase tracking-widest bg-[rgba(255,255,255,0.05)] px-1.5 py-0.5 rounded text-gray-400">Default</span>}
                                                        </div>
                                                        <p className="text-xs text-gray-400 leading-relaxed">
                                                            {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br/>
                                                            {addr.city}, {addr.state} {addr.postalCode}<br/>
                                                            <span className="font-medium text-gray-700 mt-1 block">Phone: {addr.phone}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center bg-[rgba(255,255,255,0.02)] rounded-sm border border-[rgba(255,255,255,0.08)] mb-6">
                                        <p className="text-sm text-gray-400 font-medium">No saved addresses found.</p>
                                    </div>
                                )}
                                
                                <button onClick={() => setShowNewAddress(true)} className="w-full py-4 rounded-sm border-2 border-dashed border-[rgba(255,255,255,0.15)] text-sm font-bold text-gray-600 flex items-center justify-center gap-2 active:bg-[rgba(255,255,255,0.02)]">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                    Add New Address
                                </button>
                            </>
                        ) : (
                            <div className="bg-[rgba(255,255,255,0.02)] p-5 rounded-sm border border-[rgba(255,255,255,0.08)] shadow-sm">
                                <h3 className="text-sm font-extrabold text-white mb-4">Contact Details</h3>
                                <div className="space-y-4 mb-6">
                                    <input placeholder="Full Name" value={newAddr.fullName} onChange={e => setNewAddr({...newAddr, fullName: e.target.value})} className="w-full p-3 rounded-sm border border-[rgba(255,255,255,0.1)] text-sm focus:border-[#D4A853] outline-none" />
                                    <input placeholder="Phone Number (10 digits)" type="tel" value={newAddr.phone} onChange={e => setNewAddr({...newAddr, phone: e.target.value})} className="w-full p-3 rounded-sm border border-[rgba(255,255,255,0.1)] text-sm focus:border-[#D4A853] outline-none" />
                                </div>

                                <h3 className="text-sm font-extrabold text-white mb-4">Address Details</h3>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <input placeholder="Pincode" maxLength={6} value={newAddr.pincode} onChange={e => handlePincodeChange(e.target.value)} className="w-full p-3 rounded-sm border border-[rgba(255,255,255,0.1)] text-sm focus:border-[#D4A853] outline-none" />
                                        {pincodeLoading && <div className="absolute right-3 top-3.5 w-4 h-4 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin" />}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input placeholder="City" value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} className="w-full p-3 rounded-sm border border-[rgba(255,255,255,0.1)] text-sm focus:border-[#D4A853] outline-none" />
                                        <input placeholder="State" value={newAddr.state} onChange={e => setNewAddr({...newAddr, state: e.target.value})} className="w-full p-3 rounded-sm border border-[rgba(255,255,255,0.1)] text-sm focus:border-[#D4A853] outline-none" />
                                    </div>
                                    <input placeholder="House No, Building, Street" value={newAddr.addressLine1} onChange={e => setNewAddr({...newAddr, addressLine1: e.target.value})} className="w-full p-3 rounded-sm border border-[rgba(255,255,255,0.1)] text-sm focus:border-[#D4A853] outline-none" />
                                    <input placeholder="Landmark (Optional)" value={newAddr.addressLine2} onChange={e => setNewAddr({...newAddr, addressLine2: e.target.value})} className="w-full p-3 rounded-sm border border-[rgba(255,255,255,0.1)] text-sm focus:border-[#D4A853] outline-none" />
                                    
                                    <label className="flex items-center gap-2 cursor-pointer mt-2">
                                        <input type="checkbox" checked={newAddr.isDefault} onChange={e => setNewAddr({...newAddr, isDefault: e.target.checked})} className="w-4 h-4 text-[#D4A853] focus:ring-[#D4A853] rounded" />
                                        <span className="text-xs font-bold text-gray-600">Save as default address</span>
                                    </label>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button onClick={() => setShowNewAddress(false)} className="flex-1 py-3.5 rounded-sm text-sm font-bold text-gray-600 bg-[rgba(255,255,255,0.05)] hover:bg-gray-200 active:scale-95 transition-all">Cancel</button>
                                    <button onClick={handleSaveAddress} disabled={isLoading || !newAddr.fullName || !newAddr.addressLine1 || newAddr.pincode.length !== 6} className="flex-1 py-3.5 rounded-sm text-sm font-bold text-white bg-[#0f1035] active:scale-95 transition-all disabled:opacity-50">Save Address</button>
                                </div>
                            </div>
                        )}

                        {!showNewAddress && addresses.length > 0 && (
                            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[rgba(255,255,255,0.02)] border-t border-[rgba(255,255,255,0.08)] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
                                <div className="max-w-xl mx-auto">
                                    <button onClick={() => setStep(2)} className="w-full py-4 rounded-sm text-sm font-bold bg-[#D4A853] text-white active:scale-95 transition-all flex items-center justify-center gap-2">
                                        Continue to Review
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 2: REVIEW */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-[rgba(255,255,255,0.02)] rounded-sm border border-[rgba(255,255,255,0.08)] shadow-sm overflow-hidden mb-6">
                            {/* Stitching Section */}
                            {stitchingItems.length > 0 && (
                                <div className="p-4 border-b border-[rgba(255,255,255,0.08)]">
                                    <h3 className="text-xs font-extrabold text-white uppercase tracking-widest mb-3 flex items-center justify-between">
                                        Custom Stitching
                                        <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Est. 7-10 Days</span>
                                    </h3>
                                    <div className="space-y-3">
                                        {stitchingItems.map((item: any) => (
                                            <div key={item.id} className="flex gap-3">
                                                <div className="w-12 h-12 bg-[rgba(255,255,255,0.05)] rounded-lg overflow-hidden relative flex-shrink-0">
                                                    <Image src={item.fabricImage} alt="fabric" fill className="object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white">{item.garmentType} - {item.fabricName}</p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">Profile: {item.measurementProfileName}</p>
                                                </div>
                                                <div className="ml-auto text-xs font-extrabold text-white">₹{item.totalPrice.toLocaleString('en-IN')}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Readymade Section */}
                            {(readymadeItems.length > 0 || accessoryItems.length > 0) && (
                                <div className="p-4">
                                    <h3 className="text-xs font-extrabold text-white uppercase tracking-widest mb-3 flex items-center justify-between">
                                        Regular Items
                                        <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded">Est. 3-5 Days</span>
                                    </h3>
                                    <div className="space-y-3">
                                        {[...readymadeItems, ...accessoryItems].map((item: any) => (
                                            <div key={item.id} className="flex gap-3">
                                                <div className="w-12 h-12 bg-[rgba(255,255,255,0.05)] rounded-lg overflow-hidden relative flex-shrink-0">
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white">{item.name}</p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''}</p>
                                                </div>
                                                <div className="ml-auto text-xs font-extrabold text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[rgba(255,255,255,0.02)] border-t border-[rgba(255,255,255,0.08)] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
                            <div className="max-w-xl mx-auto">
                                <button onClick={() => setStep(3)} className="w-full py-4 rounded-sm text-sm font-bold bg-[#D4A853] text-white active:scale-95 transition-all flex items-center justify-center gap-2">
                                    Continue to Payment
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: PAYMENT */}
                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">Payment Method</h2>
                        
                        <div className="space-y-3 mb-8">
                            {/* Online Payment */}
                            <div 
                                onClick={() => setPaymentMethod('online')}
                                className={`p-4 rounded-sm border-2 cursor-pointer transition-colors ${paymentMethod === 'online' ? 'border-[#D4A853] bg-[#D4A853]/5' : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.1)]'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'online' ? 'border-[#D4A853]' : 'border-[rgba(255,255,255,0.15)]'}`}>
                                        {paymentMethod === 'online' && <div className="w-2.5 h-2.5 bg-[#D4A853] rounded-full" />}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white">Pay Online (Razorpay)</h3>
                                        <p className="text-[10px] text-gray-400 mt-0.5">UPI, Credit/Debit Cards, NetBanking</p>
                                    </div>
                                </div>
                            </div>

                            {/* COD (Only if < 5000) */}
                            {totalAmount <= 5000 ? (
                                <div 
                                    onClick={() => setPaymentMethod('cod')}
                                    className={`p-4 rounded-sm border-2 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-[#0f1035] bg-[#0f1035]/5' : 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.1)]'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#0f1035]' : 'border-[rgba(255,255,255,0.15)]'}`}>
                                            {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-[#D4A853] rounded-full" />}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white">Cash on Delivery</h3>
                                            <p className="text-[10px] text-gray-400 mt-0.5">Pay at your doorstep</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 rounded-sm border-2 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] opacity-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full border-2 border-[rgba(255,255,255,0.15)]" />
                                        <div>
                                            <h3 className="text-sm font-bold text-white">Cash on Delivery</h3>
                                            <p className="text-[10px] text-gray-400 mt-0.5">Not available for orders above ₹5,000</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Summary */}
                        <div className="bg-[rgba(255,255,255,0.02)] p-4 rounded-sm border border-[rgba(255,255,255,0.08)] shadow-sm mb-6">
                            <div className="space-y-2.5 text-sm text-gray-600 border-b border-[rgba(255,255,255,0.08)] pb-3 mb-3">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="font-bold text-white">{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-base font-extrabold text-white">Total to Pay</span>
                                <span className="text-xl font-extrabold text-[#D4A853]">₹{totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[rgba(255,255,255,0.02)] border-t border-[rgba(255,255,255,0.08)] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
                            <div className="max-w-xl mx-auto">
                                <button onClick={handlePlaceOrder} disabled={isLoading} className="ecom-btn w-full h-14 text-sm font-extrabold shadow-xl disabled:opacity-50">
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-[#0f1035] border-t-transparent rounded-full animate-spin" />
                                    ) : paymentMethod === 'online' ? (
                                        `Pay ₹${totalAmount.toLocaleString('en-IN')}`
                                    ) : (
                                        'Place Order'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: CONFIRMATION */}
                {step === 4 && (
                    <div className="animate-in zoom-in-95 fade-in duration-500 flex flex-col items-center justify-center pt-12 pb-8 text-center">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                            <svg className="w-12 h-12 text-green-500 animate-[draw_0.6s_ease-out_forwards]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={50} strokeDashoffset={50}>
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Order Confirmed!</h1>
                        <p className="text-sm text-gray-400 mb-8 max-w-sm">Thank you for shopping with Fabloom. Your premium garments are being prepared.</p>

                        <div className="bg-[rgba(255,255,255,0.02)] w-full p-6 rounded-sm shadow-sm border border-[rgba(255,255,255,0.08)] mb-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#D4A853]" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Number</p>
                            <p className="text-xl font-mono font-extrabold text-white tracking-widest">{confirmedOrderNumber}</p>
                        </div>

                        <div className="w-full space-y-3">
                            <Link href={`/account/orders/${confirmedOrderId}`} className="w-full flex items-center justify-center py-4 rounded-sm bg-[#0f1035] text-white text-sm font-bold active:scale-95 transition-transform">
                                Track Order Status
                            </Link>
                            <Link href="/" className="w-full flex items-center justify-center py-4 rounded-sm bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)] text-white text-sm font-bold active:bg-[rgba(255,255,255,0.02)] transition-colors">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Animations */}
            <style>{`
                @keyframes draw {
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
        </div>
    );
}

