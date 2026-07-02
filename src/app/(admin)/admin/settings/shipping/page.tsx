'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ShippingSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        flatRate: 150,
        freeThreshold: 3000,
        intlShipping: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Mock save delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        toast.success('Shipping settings saved successfully');
        setIsSaving(false);
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="mb-6">
                <h2 className="text-lg font-extrabold text-gray-900">Shipping Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Configure delivery rates and options</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Flat Rate Shipping Cost (₹)</label>
                    <Input 
                        type="number"
                        min="0"
                        value={formData.flatRate} 
                        onChange={(e) => setFormData({ ...formData, flatRate: Number(e.target.value) })} 
                        required 
                    />
                    <p className="text-xs text-gray-400">Default shipping rate applied to all domestic orders</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Free Shipping Threshold (₹)</label>
                    <Input 
                        type="number"
                        min="0"
                        value={formData.freeThreshold} 
                        onChange={(e) => setFormData({ ...formData, freeThreshold: Number(e.target.value) })} 
                        required 
                    />
                    <p className="text-xs text-gray-400">Orders above this amount qualify for free shipping</p>
                </div>

                <div className="pt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-300">
                            <input 
                                type="checkbox" 
                                className="sr-only" 
                                checked={formData.intlShipping}
                                onChange={(e) => setFormData({ ...formData, intlShipping: e.target.checked })}
                            />
                            <span 
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                    formData.intlShipping ? 'translate-x-4 bg-emerald-500' : 'translate-x-1'
                                }`}
                            />
                        </div>
                        <span className="text-sm font-bold text-gray-700">Enable International Shipping</span>
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
