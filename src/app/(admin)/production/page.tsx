import type { Metadata } from 'next';
import StitchingKanbanBoard from '@/components/admin/StitchingKanbanBoard';

export const metadata: Metadata = {
    title: 'Stitching Production — Fabloom Admin',
    description: 'Manage custom stitching orders through the production lifecycle.',
};

export default function ProductionKanbanPage() {
    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-2">
                <h2 className="text-xl font-extrabold text-gray-900 leading-tight">Production Board</h2>
                <p className="text-sm font-medium text-gray-500 mt-0.5">
                    Drag and drop orders across stages to update their status.
                </p>
            </div>
            
            <div className="flex-1 min-h-0 mt-4">
                <StitchingKanbanBoard />
            </div>
        </div>
    );
}
