'use client';

import { useState } from 'react';
import useSWR from 'swr';
import AdminHeader from '@/components/admin/AdminHeader';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';

// ============================================================================
// TYPES
// ============================================================================

interface Measurements {
    length?: number;
    shoulder?: number;
    sleeveLength?: number;
    loose1?: number;
    loose2?: number;
    chest?: number;
    waist?: number;
    bottom?: number;
    neck?: number;
}

interface Preferences {
    neckType?: string;
    fitPreference?: string;
    cuffType?: string;
    chestFinish?: number;
    waistFinish?: number;
}

interface MeasurementProfile {
    _id: string;
    userId: string;
    profileName: string;
    garmentTypes: string[];
    isDefault: boolean;
    createdAt: string;
    user?: {
        name: string;
        email: string;
        phone: string;
    };
    measurements: Measurements;
    preferences?: Preferences;
}

// ============================================================================
// HELPERS
// ============================================================================

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function SkeletonRow() {
    return (
        <tr className="border-b border-gray-100">
            {[1, 2, 3, 4].map((i) => (
                <td key={i} className="p-4">
                    <div
                        className="h-4 rounded bg-gray-100 animate-pulse"
                        style={{ width: `${50 + i * 10}%` }}
                    />
                </td>
            ))}
        </tr>
    );
}

function GridItem({ label, value }: { label: string; value?: string | number }) {
    if (value === undefined || value === null) return null;
    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
            <span className="text-xs font-bold text-gray-500 uppercase">{label}</span>
            <span className="text-sm font-semibold text-gray-900 capitalize">{value}</span>
        </div>
    );
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function MeasurementsClient() {
    const { data, error } = useSWR<{ success: boolean; count: number; data: MeasurementProfile[] }>(
        '/api/admin/measurements',
        fetcher
    );

    const isLoading = !data && !error;
    const profiles = data?.data ?? [];

    const [selectedProfile, setSelectedProfile] = useState<MeasurementProfile | null>(null);

    return (
        <div className="flex flex-col gap-6">
            <AdminHeader />

            <div className="px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6 pb-12">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
                            Measurement Profiles
                        </h2>
                        <p className="text-sm font-medium text-gray-500 mt-0.5">
                            {isLoading ? 'Loading…' : `${data?.count ?? 0} saved tailoring profiles`}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 font-medium">
                        Failed to load measurement profiles. Please refresh.
                    </div>
                )}

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Profile Name</th>
                                    <th className="p-4">Garment Types</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading &&
                                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

                                {!isLoading &&
                                    profiles.map((profile) => (
                                        <tr key={profile._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <p className="font-semibold text-gray-900">
                                                    {profile.user?.name || 'Unknown User'}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {profile.user?.email || profile.userId}
                                                </p>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-gray-800">
                                                        {profile.profileName}
                                                    </span>
                                                    {profile.isDefault && (
                                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-[#D4A853]/15 text-[#9a7320]">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {profile.garmentTypes?.length > 0 ? (
                                                        profile.garmentTypes.map((t) => (
                                                            <span
                                                                key={t}
                                                                className="px-2 py-1 rounded bg-gray-100 text-gray-600 text-[10px] font-bold capitalize tracking-wide"
                                                            >
                                                                {t.replace(/_/g, ' ')}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-gray-400 font-medium">None specified</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => setSelectedProfile(profile)}
                                                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#0f1035] text-white hover:bg-[#0f1035]/90 transition-colors"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                {!isLoading && !error && profiles.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-sm text-gray-400">
                                            No measurement profiles found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* View Dialog */}
            <Dialog open={!!selectedProfile} onOpenChange={(open) => !open && setSelectedProfile(null)}>
                {selectedProfile && (
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-extrabold">
                                {selectedProfile.profileName}
                            </DialogTitle>
                            <p className="text-sm text-gray-500">
                                For {selectedProfile.user?.name || 'Customer'} (
                                {selectedProfile.user?.phone || 'No phone'})
                            </p>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                            {/* Precise Measurements Column */}
                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                <h3 className="text-sm font-extrabold text-[#0f1035] mb-4 border-b border-gray-200 pb-2">
                                    Precise Measurements (Inches)
                                </h3>
                                <div className="space-y-1">
                                    <GridItem label="Length" value={selectedProfile.measurements.length} />
                                    <GridItem label="Shoulder" value={selectedProfile.measurements.shoulder} />
                                    <GridItem label="Sleeve Length" value={selectedProfile.measurements.sleeveLength} />
                                    <GridItem label="Loose 1 (Chest)" value={selectedProfile.measurements.loose1} />
                                    <GridItem label="Loose 2 (Waist)" value={selectedProfile.measurements.loose2} />
                                    <GridItem label="Chest" value={selectedProfile.measurements.chest} />
                                    <GridItem label="Waist" value={selectedProfile.measurements.waist} />
                                    <GridItem label="Bottom" value={selectedProfile.measurements.bottom} />
                                    <GridItem label="Neck" value={selectedProfile.measurements.neck} />
                                </div>
                            </div>

                            {/* Preferences & Finishing Column */}
                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                <h3 className="text-sm font-extrabold text-[#0f1035] mb-4 border-b border-gray-200 pb-2">
                                    Tailoring Preferences
                                </h3>
                                <div className="space-y-1">
                                    <GridItem
                                        label="Fit Style"
                                        value={selectedProfile.preferences?.fitPreference}
                                    />
                                    <GridItem
                                        label="Neck Type"
                                        value={selectedProfile.preferences?.neckType?.replace('_', ' ')}
                                    />
                                    <GridItem
                                        label="Cuff Type"
                                        value={selectedProfile.preferences?.cuffType?.replace('_', ' ')}
                                    />
                                    <GridItem
                                        label="Chest Finish"
                                        value={selectedProfile.preferences?.chestFinish}
                                    />
                                    <GridItem
                                        label="Waist Finish"
                                        value={selectedProfile.preferences?.waistFinish}
                                    />
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-sm font-extrabold text-[#0f1035] mb-3">
                                        Garment Types
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProfile.garmentTypes?.length > 0 ? (
                                            selectedProfile.garmentTypes.map((t) => (
                                                <span
                                                    key={t}
                                                    className="px-2.5 py-1 rounded bg-white border border-gray-200 text-gray-700 text-xs font-bold capitalize"
                                                >
                                                    {t.replace(/_/g, ' ')}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400">None specified</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <DialogClose asChild>
                                <button className="px-5 py-2 rounded-xl text-sm font-bold bg-[#0f1035] text-white">
                                    Done
                                </button>
                            </DialogClose>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}
