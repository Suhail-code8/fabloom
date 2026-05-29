'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStitchingStore } from '@/store/useStitchingStore';
import type { IMeasurementProfile } from '@/types/cart';
import MeasurementFormDrawer from './MeasurementFormDrawer';

function MeasRow({ label, value }: { label: string; value?: number | string }) {
    if (!value || value === 0) return null;
    return (
        <span className="flex items-center gap-1 text-[10px]" style={{ color: 'rgba(0,0,0,0.55)' }}>
            <span className="font-semibold text-gray-700">{label}</span>
            <span className="capitalize">{typeof value === 'string' ? value.replace('_', ' ') : `${value}cm`}</span>
        </span>
    );
}

function ProfileCard({ 
    profile, 
    isSelected, 
    onSelect 
}: { 
    profile: IMeasurementProfile; 
    isSelected: boolean; 
    onSelect: (p: IMeasurementProfile) => void;
}) {
    const m = profile.measurements;

    return (
        <div
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(profile)}
            className="relative rounded-2xl p-4 cursor-pointer transition-all duration-200 active:scale-98 select-none"
            style={{
                backgroundColor: isSelected ? 'rgba(212,168,83,0.08)' : 'rgba(255,255,255,0.05)',
                border: isSelected ? '2px solid #D4A853' : '2px solid rgba(255,255,255,0.08)',
                boxShadow: isSelected ? '0 0 0 3px rgba(212,168,83,0.15)' : 'none',
            }}
        >
            <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                    <p className="text-sm font-extrabold leading-tight" style={{ color: isSelected ? '#D4A853' : 'rgba(255,255,255,0.9)' }}>
                        {profile.profileName}
                    </p>
                    <p className="text-[10px] mt-0.5 capitalize" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {(profile.garmentTypes || []).join(', ')}
                    </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    {profile.isDefault && (
                        <span className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(212,168,83,0.2)', color: '#D4A853' }}>
                            Default
                        </span>
                    )}
                    {isSelected && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D4A853' }}>
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#0f1035" strokeWidth={2.5} strokeLinecap="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <MeasRow label="Length"    value={m.length} />
                <MeasRow label="Shoulder"  value={m.shoulder} />
                <MeasRow label="Sleeve"    value={m.sleeveLength} />
                <MeasRow label="Loose 1"   value={m.loose1} />
                <MeasRow label="Loose 2"   value={m.loose2} />
                <MeasRow label="Chest"     value={m.chest} />
                <MeasRow label="Waist"     value={m.waist} />
                <MeasRow label="Bottom"    value={m.bottom} />
                <MeasRow label="Neck"      value={m.neck} />
            </div>
            {profile.preferences && (
                <div className="flex flex-wrap gap-x-3 gap-y-1 pt-2 mt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <MeasRow label="Neck:" value={profile.preferences.neckType} />
                    <MeasRow label="Fit:" value={profile.preferences.fitPreference} />
                    <MeasRow label="Cuff:" value={profile.preferences.cuffType} />
                </div>
            )}
        </div>
    );
}

interface MeasurementProfilePickerProps {
    profiles: IMeasurementProfile[];
    onSelect?: (profile: IMeasurementProfile) => void;
    selectedProfileId?: string;
}

export default function MeasurementProfilePicker({ 
    profiles, 
    onSelect, 
    selectedProfileId 
}: MeasurementProfilePickerProps) {
    const { selectedProfile, setProfile } = useStitchingStore();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const router = useRouter();

    // Determine which selection logic to use
    const activeId = selectedProfileId || selectedProfile?._id;
    const handleSelect = onSelect || setProfile;

    return (
        <section aria-label="Select measurement profile" className="flex flex-col gap-4 px-4">
            <div>
                <h2 className="text-lg font-extrabold text-white">Select Measurements</h2>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Our tailor will stitch to these exact dimensions.
                </p>
            </div>
            {profiles.length > 0 ? (
                <div className="flex flex-col gap-3" role="radiogroup">
                    {profiles.map((p) => (
                        <ProfileCard 
                            key={p._id} 
                            profile={p} 
                            isSelected={p._id === activeId}
                            onSelect={handleSelect}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl px-6 py-8 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1.5px dashed rgba(255,255,255,0.15)' }}>
                    <p className="text-sm text-white opacity-60">No profiles saved yet.</p>
                </div>
            )}
            <div className="flex items-center justify-between mt-2">
                <button
                    className="flex items-center justify-center gap-2 flex-1 py-4 rounded-2xl text-sm font-bold transition-all duration-200 active:scale-98"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1.5px dashed rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.65)' }}
                    onClick={() => setIsDrawerOpen(true)}
                    aria-label="Add a new measurement profile"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                    Add New Profile
                </button>
            </div>
            
            <a 
                href="/measure-guide" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-center font-bold uppercase tracking-wider text-[#D4A853] hover:underline mt-2"
            >
                Need help measuring?
            </a>

            <MeasurementFormDrawer 
                open={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)}
                onSuccess={(newProfile) => {
                    setIsDrawerOpen(false);
                    handleSelect(newProfile);
                    router.refresh();
                }}
            />
        </section>
    );
}
