'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function NotificationSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        emailOnNewOrder: true,
        emailOnStitchingCompletion: true,
        dailySummary: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Mock save delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        toast.success('Notification preferences saved');
        setIsSaving(false);
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="mb-6">
                <h2 className="text-lg font-extrabold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-500 mt-1">Manage admin email and alert preferences</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                
                <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-gray-300 mt-0.5">
                            <input 
                                type="checkbox" 
                                className="sr-only" 
                                checked={formData.emailOnNewOrder}
                                onChange={(e) => setFormData({ ...formData, emailOnNewOrder: e.target.checked })}
                            />
                            <span 
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                    formData.emailOnNewOrder ? 'translate-x-4 bg-emerald-500' : 'translate-x-1'
                                }`}
                            />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-gray-900 block">Email on New Order</span>
                            <span className="text-xs text-gray-500 mt-1 block">Receive an email notification whenever a customer places a new order</span>
                        </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-gray-300 mt-0.5">
                            <input 
                                type="checkbox" 
                                className="sr-only" 
                                checked={formData.emailOnStitchingCompletion}
                                onChange={(e) => setFormData({ ...formData, emailOnStitchingCompletion: e.target.checked })}
                            />
                            <span 
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                    formData.emailOnStitchingCompletion ? 'translate-x-4 bg-emerald-500' : 'translate-x-1'
                                }`}
                            />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-gray-900 block">Email on Stitching Completion</span>
                            <span className="text-xs text-gray-500 mt-1 block">Get notified when a tailor marks a custom stitching job as ready</span>
                        </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-gray-300 mt-0.5">
                            <input 
                                type="checkbox" 
                                className="sr-only" 
                                checked={formData.dailySummary}
                                onChange={(e) => setFormData({ ...formData, dailySummary: e.target.checked })}
                            />
                            <span 
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                    formData.dailySummary ? 'translate-x-4 bg-emerald-500' : 'translate-x-1'
                                }`}
                            />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-gray-900 block">Daily Summary Report</span>
                            <span className="text-xs text-gray-500 mt-1 block">Receive a daily digest of revenue and active orders at 8:00 AM</span>
                        </div>
                    </label>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <Button 
                        type="submit" 
                        disabled={isSaving} 
                        className="bg-[#0f1035] hover:bg-[#0f1035]/90 text-white"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
