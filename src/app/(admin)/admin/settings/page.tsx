'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function GeneralSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        storeName: 'Fabloom Store',
        supportEmail: 'support@fabloom.com',
        phone: '+91 98765 43210',
        address: '123 Textile Street, Mumbai, India',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Mock save delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        toast.success('Settings saved successfully');
        setIsSaving(false);
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="mb-6">
                <h2 className="text-lg font-extrabold text-gray-900">General Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your basic store information</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Store Name</label>
                    <Input 
                        value={formData.storeName} 
                        onChange={(e) => setFormData({ ...formData, storeName: e.target.value })} 
                        required 
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Support Email</label>
                    <Input 
                        type="email" 
                        value={formData.supportEmail} 
                        onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })} 
                        required 
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Phone Number</label>
                    <Input 
                        type="tel" 
                        value={formData.phone} 
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                        required 
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Store Address</label>
                    <Textarea 
                        rows={3} 
                        value={formData.address} 
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                        required 
                    />
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
