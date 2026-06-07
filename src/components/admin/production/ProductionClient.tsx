'use client';

import { useEffect, useMemo, useState } from 'react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { toast } from 'sonner';

type StitchingStatus = 'pending' | 'cutting' | 'stitching' | 'quality_check' | 'ready';

type ProductionOrder = {
    _id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    stitchingStatus: StitchingStatus;
    createdAt: string;
    stitchingItems: {
        garmentType: string;
        fabricName: string;
        meters: number;
        measurements: Record<string, number>;
    }[];
};

const COLUMNS: { id: StitchingStatus; label: string; color: string }[] = [
    { id: 'pending', label: 'Pending', color: 'border-gray-200 bg-gray-50 text-gray-700' },
    { id: 'cutting', label: 'Cutting', color: 'border-orange-200 bg-orange-50 text-orange-700' },
    { id: 'stitching', label: 'Stitching', color: 'border-blue-200 bg-blue-50 text-blue-700' },
    { id: 'quality_check', label: 'QC', color: 'border-purple-200 bg-purple-50 text-purple-700' },
    { id: 'ready', label: 'Ready', color: 'border-green-200 bg-green-50 text-green-700' },
];

async function fetchProduction() {
    const res = await fetch('/api/admin/production', { credentials: 'include' });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || 'Failed to load production data');
    return (json.orders || []) as ProductionOrder[];
}

function DraggableCard({ order, onMove }: { order: ProductionOrder; onMove: (id: string, nextStatus: string) => void }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: order._id,
    });

    const currentIndex = COLUMNS.findIndex(c => c.id === order.stitchingStatus);
    const nextColumn = COLUMNS[currentIndex + 1];

    return (
        <div
            ref={setNodeRef}
            className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2 transition-opacity touch-none relative"
            style={{ opacity: isDragging ? 0.5 : 1 }}
            {...listeners}
            {...attributes}
        >
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="text-[10px] font-bold text-gray-400 font-mono tracking-wider mb-0.5">
                        {order.orderNumber}
                    </p>
                    <p className="text-xs font-extrabold text-gray-900 leading-tight">
                        {order.customerName}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{order.customerPhone}</p>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 whitespace-nowrap">
                    {order.stitchingItems.length} item{order.stitchingItems.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 flex flex-col gap-1">
                {order.stitchingItems.slice(0, 2).map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2">
                        <p className="text-[10px] font-bold text-gray-800 truncate">
                            {it.fabricName} × {it.meters}m
                        </p>
                        <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md"
                              style={{ backgroundColor: 'rgba(212,168,83,0.15)', color: '#92650a' }}>
                            {it.garmentType}
                        </span>
                    </div>
                ))}
                {order.stitchingItems.length > 2 && (
                    <p className="text-[10px] text-gray-500">
                        +{order.stitchingItems.length - 2} more
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between mt-1">
                <p className="text-[10px] text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                
                {nextColumn && (
                    <button 
                        onPointerDown={(e) => e.stopPropagation()} 
                        onClick={(e) => {
                            e.stopPropagation();
                            onMove(order._id, nextColumn.id);
                        }}
                        className="text-[10px] font-bold bg-[#0f1035] text-white px-2 py-1 rounded hover:bg-[#1a1c4b] active:scale-95 transition-all z-10 relative cursor-pointer"
                    >
                        Move to {nextColumn.label}
                    </button>
                )}
            </div>
        </div>
    );
}

function KanbanColumn({ col, orders, onMove }: { col: typeof COLUMNS[0], orders: ProductionOrder[], onMove: (id: string, nextStatus: string) => void }) {
    const { setNodeRef, isOver } = useDroppable({
        id: col.id,
    });

    return (
        <div
            className={`flex-shrink-0 w-80 flex flex-col bg-gray-100/50 rounded-2xl border ${isOver ? 'border-[#D4A853] bg-[#D4A853]/5' : 'border-gray-200/60'} overflow-hidden transition-colors`}
        >
            <div className={`px-4 py-3 border-b flex items-center justify-between ${col.color}`}>
                <h3 className="text-xs font-extrabold uppercase tracking-wider">{col.label}</h3>
                <span className="text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded-full">
                    {orders.length}
                </span>
            </div>

            <div 
                ref={setNodeRef}
                className="flex-1 p-3 overflow-y-auto custom-scrollbar flex flex-col gap-3 min-h-[200px]"
            >
                {col.id === 'pending' && orders.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-gray-400">
                        No production orders yet
                    </div>
                ) : (
                    orders.map((o) => <DraggableCard key={o._id} order={o} onMove={onMove} />)
                )}
            </div>
        </div>
    );
}

export default function ProductionClient() {
    const [orders, setOrders] = useState<ProductionOrder[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 }
        })
    );

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchProduction();
            setOrders(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load production data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void load();
    }, []);

    const grouped = useMemo(() => {
        const base: Record<StitchingStatus, ProductionOrder[]> = {
            pending: [],
            cutting: [],
            stitching: [],
            quality_check: [],
            ready: [],
        };
        for (const o of orders) {
            base[o.stitchingStatus]?.push(o);
        }
        return base;
    }, [orders]);

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        // Optimistic update
        setOrders((prev) => 
            prev.map((o) => o._id === orderId ? { ...o, stitchingStatus: newStatus as StitchingStatus } : o)
        );

        try {
            const res = await fetch(`/api/admin/orders/${orderId}/stitching-status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stitchingStatus: newStatus })
            });

            if (!res.ok) throw new Error('Failed to update status');
            toast.success(`Moved order to ${newStatus}`);
        } catch (error) {
            toast.error('Failed to update. Reverting...');
            void load(); // revert by refetching
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const orderId = active.id as string;
        const newStatus = over.id as StitchingStatus;
        
        // Don't update if dropped in same column somehow
        const order = orders.find(o => o._id === orderId);
        if (order?.stitchingStatus === newStatus) return;

        await handleUpdateStatus(orderId, newStatus);
    };

    if (loading) {
        return <p className="text-gray-500 mb-4 animate-pulse">Loading board...</p>;
    }

    if (error) {
        return (
            <div className="bg-white border border-red-200 rounded-2xl p-6">
                <p className="text-sm font-bold text-red-600 mb-3">{error}</p>
                <button
                    onClick={load}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0f1035] text-white"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                {COLUMNS.map((col) => {
                    const colOrders = grouped[col.id] || [];
                    return (
                        <KanbanColumn 
                            key={col.id} 
                            col={col} 
                            orders={colOrders} 
                            onMove={handleUpdateStatus} 
                        />
                    );
                })}
            </DndContext>

            <style>{`.custom-scrollbar::-webkit-scrollbar { height: 6px; width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }`}</style>
        </div>
    );
}
