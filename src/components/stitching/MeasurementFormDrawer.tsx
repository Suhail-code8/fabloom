'use client';

import { useState } from 'react';
import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle, 
    SheetDescription,
    SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MeasurementVisualizer from './MeasurementVisualizer';
import { toast } from 'sonner';

interface MeasurementFormDrawerProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: (newProfile: any) => void;
    garmentType?: string;
}

export default function MeasurementFormDrawer({
    open,
    onClose,
    onSuccess,
    garmentType = 'Shirt'
}: MeasurementFormDrawerProps) {
    const [profileName, setProfileName] = useState('');
    const [measurements, setMeasurements] = useState<Record<string, number>>({
        neck: 0,
        shoulder: 0,
        chest: 0,
        waist: 0,
        sleeveLength: 0,
        shirtLength: 0
    });
    const [loading, setLoading] = useState(false);

    const handleMeasureChange = (field: string, value: string) => {
        setMeasurements(prev => ({
            ...prev,
            [field]: parseFloat(value) || 0
        }));
    };

    const handleSave = async () => {
        if (!profileName.trim()) {
            toast.error('Please enter a profile name');
            return;
        }

        // Validate that some measurements are entered
        const hasValues = Object.values(measurements).some(v => v > 0);
        if (!hasValues) {
            toast.error('Please enter at least one measurement');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/measurements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profileName: profileName.trim(),
                    garmentType: garmentType.toLowerCase(),
                    measurements,
                    isDefault: false
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                let errorMessage = 'Failed to save profile';
                try {
                    const errorData = JSON.parse(text);
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    // Not JSON, use status text or raw text
                    errorMessage = text || `Error ${res.status}: ${res.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const data = await res.json();
            toast.success('Measurement profile saved!');
            if (onSuccess) onSuccess(data.profile);
            onClose();
        } catch (error: any) {
            console.error('Save Measurement Error:', error);
            toast.error(error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="bottom" className="h-[90vh] sm:max-w-xl sm:mx-auto rounded-t-3xl border-none bg-[#0f1035] p-0 overflow-hidden">
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="px-6 pt-6 pb-2">
                        <SheetHeader className="text-left">
                            <SheetTitle className="text-2xl font-black text-white tracking-tight">
                                New Profile
                            </SheetTitle>
                            <SheetDescription className="text-white/50">
                                Enter your dimensions for a perfect {garmentType.toLowerCase()} fit.
                            </SheetDescription>
                        </SheetHeader>
                    </div>

                    {/* Scrollable body */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
                        {/* Profile Name Input */}
                        <div className="space-y-2">
                            <Label htmlFor="profile-name" className="text-[10px] font-bold uppercase tracking-widest text-[#D4A853]">
                                Profile Name
                            </Label>
                            <Input
                                id="profile-name"
                                placeholder="e.g. My Summer Fit"
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                                className="h-12 bg-white/5 border-white/10 text-white rounded-xl focus:ring-[#D4A853]/30"
                            />
                        </div>

                        {/* Interactive Visualizer */}
                        <div className="space-y-4">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#D4A853]">
                                Measurements (inches)
                            </Label>
                            <MeasurementVisualizer 
                                values={measurements} 
                                onChange={handleMeasureChange} 
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-white/5 border-t border-white/10">
                        <Button 
                            onClick={handleSave} 
                            disabled={loading}
                            className="w-full h-14 rounded-2xl bg-[#D4A853] hover:bg-[#c49843] text-[#0f1035] font-black text-lg transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Profile'}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
