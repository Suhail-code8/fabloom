'use client';

import { useState } from 'react';
import useSWR from 'swr';
import DeleteModal from '@/components/ui/DeleteModal';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Address {
    _id?: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

export default function AddressesListClient() {
    const { data, error, mutate, isLoading } = useSWR('/api/user/addresses', fetcher);
    
    // Modal states
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Form drawer states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    
    // Form fields
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('India');
    const [isDefault, setIsDefault] = useState(false);

    if (error) return <div className="p-8 text-center text-red-500">Failed to load addresses.</div>;

    const confirmDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await fetch(`/api/user/addresses?id=${deleteId}`, { method: 'DELETE' });
            mutate();
            setDeleteId(null);
        } catch (err) {
            alert('Failed to delete address');
        }
        setIsDeleting(false);
    };

    const openAddDrawer = () => {
        setEditingAddress(null);
        setFullName('');
        setPhone('');
        setAddressLine1('');
        setAddressLine2('');
        setCity('');
        setState('');
        setPostalCode('');
        setCountry('India');
        setIsDefault(false);
        setFormError(null);
        setIsFormOpen(true);
    };

    const openEditDrawer = (addr: Address) => {
        setEditingAddress(addr);
        setFullName(addr.fullName);
        setPhone(addr.phone);
        setAddressLine1(addr.addressLine1);
        setAddressLine2(addr.addressLine2 || '');
        setCity(addr.city);
        setState(addr.state);
        setPostalCode(addr.postalCode);
        setCountry(addr.country || 'India');
        setIsDefault(addr.isDefault || false);
        setFormError(null);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validations
        if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
            setFormError('Please fill in all required fields.');
            return;
        }
        if (phone.length < 10) {
            setFormError('Please enter a valid phone number (at least 10 digits).');
            return;
        }
        if (postalCode.length < 5) {
            setFormError('Please enter a valid postal code.');
            return;
        }

        setIsSubmitting(true);
        setFormError(null);

        const payload = {
            fullName,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country,
            isDefault
        };

        try {
            let res;
            if (editingAddress?._id) {
                // PATCH request for edit
                res = await fetch('/api/user/addresses', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...payload, addressId: editingAddress._id })
                });
            } else {
                // POST request for add
                res = await fetch('/api/user/addresses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            mutate();
            setIsFormOpen(false);
        } catch (err: any) {
            setFormError(err.message || 'Failed to save address. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addresses = data?.addresses || [];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => window.history.back()} className="p-1 active:scale-90 transition-transform">
                        <svg className="w-5 h-5 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <h1 className="text-xl font-extrabold text-[#0f1035]">Saved Addresses</h1>
                </div>
                <button 
                    onClick={openAddDrawer}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#0f1035] hover:bg-[#0f1035]/90 transition-all duration-200 shadow-sm active:scale-95"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Address
                </button>
            </div>

            <div className="max-w-2xl mx-auto p-4 space-y-4 mt-2">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : addresses.length > 0 ? (
                    addresses.map((addr: any) => (
                        <div key={addr._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-extrabold text-gray-900">{addr.fullName}</h3>
                                    {addr.isDefault && (
                                        <span className="flex items-center gap-1 bg-[#D4A853]/10 text-[#D4A853] text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">
                                            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                            Default
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => openEditDrawer(addr)}
                                        className="text-gray-400 hover:text-[#D4A853] transition-colors p-1"
                                        title="Edit Address"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    </button>
                                    <button 
                                        onClick={() => setDeleteId(addr._id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        title="Delete Address"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed mb-3">
                                {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br/>
                                {addr.city}, {addr.state} {addr.postalCode}<br/>
                                <span className="font-medium text-gray-700 mt-1 block">Phone: {addr.phone}</span>
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="py-16 text-center bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        </div>
                        <h2 className="text-base font-extrabold text-gray-900 mb-2">No Addresses Saved</h2>
                        <p className="text-xs text-gray-500 mb-6">Create a delivery address to save it here for future purchases.</p>
                        <button 
                            onClick={openAddDrawer}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0f1035] hover:bg-[#0f1035]/90 transition-all duration-200 shadow-sm"
                        >
                            Create First Address
                        </button>
                    </div>
                )}
            </div>
            
            {/* Create/Edit Drawer Modal */}
            {isFormOpen && (
                <>
                    <div className="fixed inset-0 bg-gray-950/40 z-40 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsFormOpen(false)} />
                    <div className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-white rounded-t-3xl z-50 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
                        {/* Drawer Header */}
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="text-lg font-extrabold text-[#0f1035]">{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
                                <p className="text-xs text-gray-500 mt-0.5">Please provide delivery address details below.</p>
                            </div>
                            <button onClick={() => setIsFormOpen(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-900 transition-colors">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>

                        {/* Drawer Form */}
                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                            {formError && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-600">
                                    {formError}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Full Name */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#0f1035]">Full Name *</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="e.g. John Doe"
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] outline-none transition-all duration-200 bg-gray-50/50"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#0f1035]">Phone Number *</label>
                                    <input 
                                        type="tel" 
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="e.g. +91 9876543210"
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] outline-none transition-all duration-200 bg-gray-50/50"
                                    />
                                </div>
                            </div>

                            {/* Address Line 1 */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#0f1035]">Address Line 1 *</label>
                                <input 
                                    type="text" 
                                    required
                                    value={addressLine1}
                                    onChange={(e) => setAddressLine1(e.target.value)}
                                    placeholder="Flat, House no., Building, Company, Apartment"
                                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] outline-none transition-all duration-200 bg-gray-50/50"
                                />
                            </div>

                            {/* Address Line 2 */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#0f1035]">Address Line 2 (Optional)</label>
                                <input 
                                    type="text" 
                                    value={addressLine2}
                                    onChange={(e) => setAddressLine2(e.target.value)}
                                    placeholder="Area, Street, Sector, Village"
                                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] outline-none transition-all duration-200 bg-gray-50/50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* City */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#0f1035]">City *</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="City"
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] outline-none transition-all duration-200 bg-gray-50/50"
                                    />
                                </div>

                                {/* State */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#0f1035]">State *</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        placeholder="State"
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] outline-none transition-all duration-200 bg-gray-50/50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Postal Code */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#0f1035]">Postal / PIN Code *</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        placeholder="e.g. 600001"
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] outline-none transition-all duration-200 bg-gray-50/50"
                                    />
                                </div>

                                {/* Country */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#0f1035]">Country *</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        placeholder="India"
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] outline-none transition-all duration-200 bg-gray-50/50"
                                    />
                                </div>
                            </div>

                            {/* Set as Default Checkbox */}
                            <label className="flex items-center gap-2.5 cursor-pointer py-1.5 select-none">
                                <input 
                                    type="checkbox" 
                                    checked={isDefault}
                                    onChange={(e) => setIsDefault(e.target.checked)}
                                    className="w-4 h-4 rounded text-[#D4A853] border-gray-300 focus:ring-[#D4A853]" 
                                />
                                <span className="text-xs font-bold text-gray-700">Set as default delivery address</span>
                            </label>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-100 sticky bottom-0 bg-white">
                                <button 
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors active:scale-[0.98]"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-grow flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-[#0f1035] hover:bg-[#0f1035]/90 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 shadow-md"
                                >
                                    {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                    {editingAddress ? 'Save Changes' : 'Add Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}

            <DeleteModal 
                isOpen={!!deleteId}
                title="Delete Address?"
                message="Are you sure you want to delete this address? You can add it back later if needed."
                onCancel={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
}
