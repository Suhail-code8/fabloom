'use client';

import { useState } from 'react';
import useSWR from 'swr';
import DeleteModal from '@/components/ui/DeleteModal';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AddressesListClient() {
    const { data, error, mutate, isLoading } = useSWR('/api/user/addresses', fetcher);
    
    // Modal state
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const addresses = data?.addresses || [];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
                <button onClick={() => window.history.back()} className="p-1 active:scale-90 transition-transform">
                    <svg className="w-5 h-5 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <h1 className="text-xl font-extrabold text-[#0f1035]">Saved Addresses</h1>
            </div>

            <div className="max-w-2xl mx-auto p-4 space-y-4 mt-2">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : addresses.length > 0 ? (
                    addresses.map((addr: any) => (
                        <div key={addr._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
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
                                <button onClick={() => setDeleteId(addr._id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
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
                        <p className="text-xs text-gray-500 mb-6">Add an address during checkout to save it here for future purchases.</p>
                    </div>
                )}
            </div>
            
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
