'use client';

import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function NotificationsClient() {
    const { data, error, mutate, isLoading } = useSWR('/api/user/notifications', fetcher);
    const [saving, setSaving] = useState(false);

    if (error) return <div className="p-8 text-center text-red-500">Failed to load preferences.</div>;

    const handleToggle = async (key: string, currentValue: boolean) => {
        setSaving(true);
        // Optimistic update
        const newPrefs = { ...data.preferences, [key]: !currentValue };
        mutate({ ...data, preferences: newPrefs }, false);

        await fetch('/api/user/notifications', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [key]: !currentValue })
        });

        mutate();
        setSaving(false);
    };

    const prefs = data?.preferences || { whatsapp: true, email: true, promotional: false };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
                <button onClick={() => window.history.back()} className="p-1 active:scale-90 transition-transform">
                    <svg className="w-5 h-5 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <h1 className="text-xl font-extrabold text-[#0f1035]">Notification Settings</h1>
            </div>

            <div className="max-w-2xl mx-auto p-4 mt-2">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                            
                            {/* WhatsApp */}
                            <div className="p-5 flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-extrabold text-gray-900 mb-1 flex items-center gap-2">
                                        WhatsApp Updates
                                        <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                                    </h3>
                                    <p className="text-xs text-gray-500 leading-snug">Receive order tracking, tailor notes, and delivery updates directly on WhatsApp.</p>
                                </div>
                                <button 
                                    onClick={() => handleToggle('whatsapp', prefs.whatsapp)}
                                    disabled={saving}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${prefs.whatsapp ? 'bg-green-500' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${prefs.whatsapp ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            {/* Email */}
                            <div className="p-5 flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-extrabold text-gray-900 mb-1">Email Receipts</h3>
                                    <p className="text-xs text-gray-500 leading-snug">Get payment receipts and official invoices sent to your registered email.</p>
                                </div>
                                <button 
                                    onClick={() => handleToggle('email', prefs.email)}
                                    disabled={saving}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${prefs.email ? 'bg-[#0f1035]' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${prefs.email ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                            {/* Promotional */}
                            <div className="p-5 flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-extrabold text-gray-900 mb-1">Offers & Promotions</h3>
                                    <p className="text-xs text-gray-500 leading-snug">Be the first to know about seasonal fabric drops and special tailoring discounts.</p>
                                </div>
                                <button 
                                    onClick={() => handleToggle('promotional', prefs.promotional)}
                                    disabled={saving}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${prefs.promotional ? 'bg-[#D4A853]' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${prefs.promotional ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
