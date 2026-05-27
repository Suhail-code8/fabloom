'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { KanbanItem } from '@/app/api/admin/stitching/route';

interface Props {
    item: KanbanItem;
    onClick: (item: KanbanItem) => void;
    onMoveForward?: (e: React.MouseEvent) => void;
    onMoveBack?: (e: React.MouseEvent) => void;
}

export default function StitchingKanbanCard({ item, onClick, onMoveForward, onMoveBack }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id, data: item });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 999 : 1,
    };

    // Calculate days styling — red if > 5 days
    const isRed = item.daysSinceOrder > 5;
    const isAmber = item.daysSinceOrder > 3 && item.daysSinceOrder <= 5;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onClick(item)}
            className="group relative bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing flex flex-col gap-2.5"
        >
            {/* Header: Order Number & Badge */}
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="text-[10px] font-bold text-gray-400 font-mono tracking-wider mb-0.5">
                        {item.orderNumber}
                    </p>
                    <p className="text-xs font-extrabold text-gray-900 leading-tight">
                        {item.customerName}
                    </p>
                </div>
                <span
                    className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md flex-shrink-0"
                    style={{ backgroundColor: 'rgba(212,168,83,0.15)', color: '#D4A853' }}
                >
                    {item.garmentType}
                </span>
            </div>

            {/* Fabric Details */}
            <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 flex gap-2 items-center">
                <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden flex-shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-800 truncate">{item.productName}</p>
                    <p className="text-[9px] text-gray-500">{item.meters}m used</p>
                </div>
            </div>

            {/* Key Measurements & Days */}
            <div className="flex items-end justify-between">
                <div className="text-[9px] font-medium text-gray-500 leading-snug">
                    {item.measurements?.chest ? `C: ${item.measurements.chest}` : ''}
                    {item.measurements?.chest && item.measurements?.shirtLength ? ' · ' : ''}
                    {item.measurements?.shirtLength ? `L: ${item.measurements.shirtLength}` : ''}
                </div>
                
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    isRed ? 'bg-red-50 text-red-600 border border-red-100' :
                    isAmber ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    'bg-gray-50 text-gray-500 border border-gray-100'
                }`}>
                    {item.daysSinceOrder}d ago
                </span>
            </div>

            {/* Admin Note Chip */}
            {item.adminNotes && (
                <div className="flex items-start gap-1.5 p-1.5 bg-blue-50 rounded-md border border-blue-100">
                    <svg className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                    <p className="text-[9px] font-semibold text-blue-700 line-clamp-2">
                        {item.adminNotes}
                    </p>
                </div>
            )}

            {/* Action Arrows (visible on hover) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {onMoveBack ? (
                    <button onClick={onMoveBack} className="w-6 h-6 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#D4A853] hover:border-[#D4A853] pointer-events-auto transition-colors -ml-3">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                ) : <div />}
                {onMoveForward ? (
                    <button onClick={onMoveForward} className="w-6 h-6 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#D4A853] hover:border-[#D4A853] pointer-events-auto transition-colors -mr-3">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                ) : <div />}
            </div>
        </div>
    );
}
