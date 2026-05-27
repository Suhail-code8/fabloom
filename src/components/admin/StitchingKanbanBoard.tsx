'use client';

import { useState } from 'react';
import useSWR from 'swr';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import StitchingKanbanCard from './StitchingKanbanCard';
import type { KanbanItem, StitchingStatus } from '@/app/api/admin/stitching/route';

// ============================================================================
// COLUMNS CONFIG
// ============================================================================
const COLUMNS: { id: StitchingStatus; label: string; color: string }[] = [
    { id: 'pending',       label: 'Pending',       color: 'border-gray-200 bg-gray-50 text-gray-700' },
    { id: 'cutting',       label: 'Cutting',       color: 'border-orange-200 bg-orange-50 text-orange-700' },
    { id: 'stitching',     label: 'Stitching',     color: 'border-blue-200 bg-blue-50 text-blue-700' },
    { id: 'quality_check', label: 'QC',            color: 'border-purple-200 bg-purple-50 text-purple-700' },
    { id: 'ready',         label: 'Ready',         color: 'border-green-200 bg-green-50 text-green-700' },
];

const fetcher = (url: string) => fetch(url).then(res => res.json());

// ============================================================================
// COMPONENT
// ============================================================================
export default function StitchingKanbanBoard() {
    const { data, error, mutate } = useSWR<{ items: KanbanItem[] }>('/api/admin/stitching', fetcher, {
        refreshInterval: 30000, // auto refresh every 30s
    });

    const [activeId, setActiveId] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<KanbanItem | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [draftNote, setDraftNote] = useState('');
    const [isSavingNote, setIsSavingNote] = useState(false);

    const items = data?.items || [];

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor)
    );

    // Filter states
    const [garmentFilter, setGarmentFilter] = useState<string>('All');
    const [overdueOnly, setOverdueOnly] = useState(false);

    const filteredItems = items.filter(item => {
        if (garmentFilter !== 'All' && item.garmentType.toLowerCase() !== garmentFilter.toLowerCase()) return false;
        if (overdueOnly && item.daysSinceOrder <= 5) return false;
        return true;
    });

    // ── API Update Call ──
    const updateStatus = async (item: KanbanItem, newStatus: StitchingStatus) => {
        // Optimistic UI update
        const previousItems = [...items];
        mutate({ items: items.map(i => i.id === item.id ? { ...i, status: newStatus } : i) }, false);

        try {
            await fetch(`/api/admin/orders/${item.orderId}/stitching-status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId: item.id, status: newStatus }),
            });
            mutate(); // Revalidate with server truth
        } catch (err) {
            console.error('Failed to update status', err);
            mutate({ items: previousItems }, false); // Rollback
        }
    };

    // ── Drag Handlers ──
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;
        if (!over) return;

        const activeItem = items.find(i => i.id === active.id);
        if (!activeItem) return;

        // Dropped directly on a column
        if (COLUMNS.find(c => c.id === over.id)) {
            if (activeItem.status !== over.id) {
                updateStatus(activeItem, over.id as StitchingStatus);
            }
            return;
        }

        // Dropped on another item (sortable area)
        const overItem = items.find(i => i.id === over.id);
        if (overItem && activeItem.status !== overItem.status) {
            updateStatus(activeItem, overItem.status);
        }
    };

    // ── Arrow Action Handlers ──
    const handleMove = (e: React.MouseEvent, item: KanbanItem, direction: 1 | -1) => {
        e.stopPropagation();
        const currIdx = COLUMNS.findIndex(c => c.id === item.status);
        const nextIdx = currIdx + direction;
        if (nextIdx >= 0 && nextIdx < COLUMNS.length) {
            updateStatus(item, COLUMNS[nextIdx].id);
        }
    };

    // ── Drawer Handlers ──
    const openDrawer = (item: KanbanItem) => {
        setSelectedItem(item);
        setDraftNote(item.adminNotes || '');
        setIsDrawerOpen(true);
    };

    const saveNote = async () => {
        if (!selectedItem) return;
        setIsSavingNote(true);
        try {
            await fetch(`/api/admin/orders/${selectedItem.orderId}/stitching-status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId: selectedItem.id, adminNotes: draftNote }),
            });
            mutate();
            setSelectedItem({ ...selectedItem, adminNotes: draftNote });
        } catch (err) {
            console.error(err);
        }
        setIsSavingNote(false);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header / Filters */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    {['All', 'Kurta', 'Thobe', 'Kandoora', 'Shirt', 'Pant'].map(f => (
                        <button
                            key={f}
                            onClick={() => setGarmentFilter(f)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                garmentFilter === f ? 'bg-[#0f1035] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer select-none bg-white px-3 py-1.5 rounded-full border border-gray-200">
                    <input type="checkbox" checked={overdueOnly} onChange={(e) => setOverdueOnly(e.target.checked)} className="rounded text-[#D4A853] focus:ring-[#D4A853]" />
                    Show Overdue Only ({'>'}5 days)
                </label>
            </div>

            {error && <p className="text-red-500 mb-4">Failed to load production data.</p>}
            {!data && !error && <p className="text-gray-500 mb-4 animate-pulse">Loading board...</p>}

            {/* Kanban Board */}
            <div className="flex-1 flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    {COLUMNS.map(column => {
                        const colItems = filteredItems.filter(i => i.status === column.id);
                        return (
                            <div key={column.id} className="flex-shrink-0 w-80 flex flex-col bg-gray-100/50 rounded-2xl border border-gray-200/60 overflow-hidden">
                                {/* Column Header */}
                                <div className={`px-4 py-3 border-b flex items-center justify-between ${column.color}`}>
                                    <h3 className="text-xs font-extrabold uppercase tracking-wider">{column.label}</h3>
                                    <span className="text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded-full">{colItems.length}</span>
                                </div>
                                {/* Column Body */}
                                <div className="flex-1 p-3 overflow-y-auto custom-scrollbar flex flex-col gap-3 min-h-[200px]" id={column.id}>
                                    <SortableContext items={colItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
                                        {colItems.map(item => (
                                            <StitchingKanbanCard
                                                key={item.id}
                                                item={item}
                                                onClick={openDrawer}
                                                onMoveBack={column.id !== 'pending' ? (e) => handleMove(e, item, -1) : undefined}
                                                onMoveForward={column.id !== 'ready' ? (e) => handleMove(e, item, 1) : undefined}
                                            />
                                        ))}
                                    </SortableContext>
                                </div>
                            </div>
                        );
                    })}
                </DndContext>
            </div>

            {/* Detail Drawer overlay */}
            {isDrawerOpen && selectedItem && (
                <>
                    <div className="fixed inset-0 bg-gray-900/40 z-40 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)} />
                    <div className="fixed top-0 right-0 h-full w-[400px] max-w-[90vw] bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right-8 duration-300">
                        {/* Drawer Header */}
                        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between bg-gray-50">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4A853] mb-1">Order {selectedItem.orderNumber}</p>
                                <h2 className="text-xl font-extrabold text-gray-900">{selectedItem.customerName}</h2>
                                <p className="text-sm font-medium text-gray-500">{selectedItem.customerPhone}</p>
                            </div>
                            <button onClick={() => setIsDrawerOpen(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-900 transition-colors">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        {/* Drawer Body */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Fabric */}
                            <div className="mb-8">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Fabric Selected</h4>
                                <div className="flex gap-4 items-center">
                                    <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={selectedItem.productImage} alt={selectedItem.productName} className="object-cover w-full h-full" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{selectedItem.productName}</p>
                                        <p className="text-xs font-medium text-gray-500 mt-0.5">{selectedItem.meters} meters</p>
                                        <p className="text-[10px] font-bold uppercase text-[#D4A853] mt-1 bg-[#D4A853]/10 inline-block px-2 py-0.5 rounded">{selectedItem.garmentType}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Measurements */}
                            <div className="mb-8">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Measurements</h4>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    {Object.entries(selectedItem.measurements || {}).map(([key, val]) => (
                                        <div key={key} className="flex justify-between border-b border-gray-100 pb-1">
                                            <span className="text-xs font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <span className="text-xs font-bold text-gray-900">{val as number}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Status update */}
                            <div className="mb-8">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Update Stage</h4>
                                <div className="flex flex-wrap gap-2">
                                    {COLUMNS.map((col) => (
                                        <button
                                            key={col.id}
                                            type="button"
                                            disabled={selectedItem.status === col.id}
                                            onClick={() => {
                                                updateStatus(selectedItem, col.id);
                                                setSelectedItem({ ...selectedItem, status: col.id });
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                                selectedItem.status === col.id
                                                    ? 'bg-[#D4A853] text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {col.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Admin Notes */}
                            <div className="mb-8">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Admin Notes</h4>
                                <textarea
                                    value={draftNote}
                                    onChange={(e) => setDraftNote(e.target.value)}
                                    placeholder="Add internal notes about this garment..."
                                    className="w-full h-24 p-3 rounded-xl border border-gray-200 text-sm focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] outline-none resize-none"
                                />
                                <button onClick={saveNote} disabled={isSavingNote || draftNote === selectedItem.adminNotes} className="mt-2 text-xs font-bold text-white bg-[#0f1035] px-4 py-2 rounded-lg disabled:opacity-50">
                                    {isSavingNote ? 'Saving...' : 'Save Note'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style>{`.custom-scrollbar::-webkit-scrollbar { height: 6px; width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }`}</style>
        </div>
    );
}
