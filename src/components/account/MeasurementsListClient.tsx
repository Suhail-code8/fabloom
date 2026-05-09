'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import DeleteModal from '@/components/ui/DeleteModal';
import { toast } from 'sonner';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function MeasurementsListClient() {
    const { data, error, mutate, isLoading } = useSWR('/api/measurements', fetcher);
    
    // Modal state
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Loading state for setting default
    const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

    if (error) return <div className="p-8 text-center text-red-500">Failed to load measurement profiles.</div>;

    const confirmDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/measurements/${deleteId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            mutate();
            setDeleteId(null);
        } catch (err) {
            toast.error('Failed to delete profile');
        }
        setIsDeleting(false);
    };

    const handleSetDefault = async (id: string, currentVal: boolean) => {
        if (currentVal) return; // already default
        setSettingDefaultId(id);
        try {
            const res = await fetch(`/api/measurements/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isDefault: true })
            });
            if (!res.ok) throw new Error('Update failed');
            mutate();
        } catch (err) {
            toast.error('Failed to set default profile');
        }
        setSettingDefaultId(null);
    };

    const profiles = data?.profiles || [];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => window.history.back()} className="p-1 active:scale-90 transition-transform">
                        <svg className="w-5 h-5 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <h1 className="text-xl font-extrabold text-[#0f1035]">Measurements</h1>
                </div>
                <Link href="/account/measurements/new" className="text-sm font-bold text-[#D4A853] active:opacity-70 transition-opacity">
                    Add New
                </Link>
            </div>

            <div className="max-w-2xl mx-auto p-4 space-y-4 mt-2">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : profiles.length > 0 ? (
                    profiles.map((profile: any) => (
                        <div key={profile._id} className={`bg-white rounded-2xl border transition-colors shadow-sm overflow-hidden ${profile.isDefault ? 'border-[#D4A853]' : 'border-gray-100'}`}>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-extrabold text-gray-900">{profile.profileName}</h3>
                                        {profile.isDefault && <span className="bg-[#D4A853]/10 text-[#D4A853] text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">Default</span>}
                                    </div>
                                    <button 
                                        onClick={() => handleSetDefault(profile._id, profile.isDefault)} 
                                        disabled={settingDefaultId === profile._id || profile.isDefault}
                                        className="p-1 active:scale-90 transition-transform disabled:opacity-50"
                                    >
                                        {settingDefaultId === profile._id ? (
                                            <div className="w-5 h-5 border-2 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <svg className={`w-5 h-5 ${profile.isDefault ? 'text-[#D4A853] fill-[#D4A853]' : 'text-gray-300'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                        )}
                                    </button>
                                </div>
                                
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {(profile.garmentTypes || []).map((type: string) => (
                                        <span key={type} className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md capitalize">{type}</span>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 mb-4">
                                    {Object.entries(profile.measurements).slice(0, 6).map(([key, val]) => (
                                        <div key={key} className="flex justify-between border-b border-gray-50 pb-1">
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <span className="text-xs font-extrabold text-[#0f1035]">{val as number}"</span>
                                        </div>
                                    ))}
                                    {Object.keys(profile.measurements).length > 6 && (
                                        <div className="text-[10px] text-gray-400 font-bold col-span-full mt-1">
                                            +{Object.keys(profile.measurements).length - 6} more measurements
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex border-t border-gray-100 bg-gray-50/50">
                                <Link 
                                    href={`/account/measurements/new?edit=${profile._id}`}
                                    className="flex-1 py-3 flex items-center justify-center text-xs font-bold text-gray-600 border-r border-gray-100 active:bg-gray-100 transition-colors"
                                >
                                    Edit Profile
                                </Link>
                                <button onClick={() => setDeleteId(profile._id)} className="flex-1 py-3 text-xs font-bold text-red-500 active:bg-red-50 transition-colors">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-16 text-center bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M21 12H3M12 3v18"/></svg>
                        </div>
                        <h2 className="text-base font-extrabold text-gray-900 mb-2">No Profiles Found</h2>
                        <p className="text-xs text-gray-500 mb-6 max-w-xs mx-auto">Create a measurement profile to unlock custom stitching for your orders.</p>
                        <Link href="/account/measurements/new" className="inline-block w-full py-4 bg-[#0f1035] text-white font-bold text-sm rounded-xl active:scale-95 transition-transform">
                            Create New Profile
                        </Link>
                    </div>
                )}
            </div>

            <DeleteModal 
                isOpen={!!deleteId}
                title="Delete Profile?"
                message="This will permanently delete this measurement profile. You cannot undo this action."
                onCancel={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
}
