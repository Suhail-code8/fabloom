'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import type { AnyProduct } from '@/types/product';
import RestockModal from './RestockModal';
import AddProductDrawer from './AddProductDrawer';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// ============================================================================
// HELPERS
// ============================================================================
function isLowStock(p: any): boolean {
    if (p.type === 'fabric') return (p.stockInMeters ?? 0) < 5;
    if (p.type === 'readymade') {
        const sizes = p.sizeStock || {};
        return Object.values(sizes).some((qty: any) => qty < 2);
    }
    if (p.type === 'accessory') return (p.stock ?? 0) < 5;
    return false;
}

// ============================================================================
// COMPONENT
// ============================================================================
export default function InventoryPageClient() {
    const { data, error, mutate } = useSWR<{ products: AnyProduct[] }>('/api/admin/products', fetcher);
    
    const [tab, setTab] = useState<'all' | 'readymade' | 'fabric' | 'accessory' | 'low_stock'>('all');
    const [search, setSearch] = useState('');
    
    // Modals
    const [restockProduct, setRestockProduct] = useState<AnyProduct | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Filter Logic
    const products = useMemo(() => data?.products || [], [data?.products]);
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            // Tab filter
            if (tab === 'low_stock' && !isLowStock(p)) return false;
            if (tab !== 'all' && tab !== 'low_stock' && p.type !== tab) return false;
            
            // Search filter
            if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
            
            return true;
        });
    }, [products, tab, search]);

    // Handlers
    const toggleActive = async (product: AnyProduct) => {
        const previous = [...products];
        // Optimistic update
        mutate({ products: products.map(p => p._id === product._id ? { ...p, active: !p.active } : p) }, false);
        try {
            await fetch(`/api/admin/products/${product._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !product.active }),
            });
            mutate();
        } catch {
            mutate({ products: previous }, false);
        }
    };

    const handleRestockSave = async (id: string, updates: any) => {
        const previous = [...products];
        mutate({ products: products.map(p => p._id === id ? { ...p, ...updates } : p) }, false);
        await fetch(`/api/admin/products/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        mutate();
    };

    const handleCreateSave = async (payload: any) => {
        await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        mutate();
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-extrabold text-gray-900 leading-tight">Inventory</h2>
                    <p className="text-sm font-medium text-gray-500 mt-0.5">Manage stock, prices, and catalog status.</p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-2"
                    style={{ backgroundColor: '#0f1035', color: '#ffffff' }}
                >
                    <svg className="w-4 h-4 text-[#D4A853]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Product
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2">
                    {[
                        { id: 'all', label: 'All Products' },
                        { id: 'readymade', label: 'Readymade' },
                        { id: 'fabric', label: 'Fabrics' },
                        { id: 'accessory', label: 'Accessories' },
                        { id: 'low_stock', label: 'Low Stock Alerts', icon: true },
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id as any)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                                tab === t.id ? 'bg-[#0f1035] text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {t.icon && <svg className={`w-3.5 h-3.5 ${tab === t.id ? 'text-red-400' : 'text-red-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="relative w-64">
                    <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
                            <th className="p-4 w-12">Img</th>
                            <th className="p-4">Product Info</th>
                            <th className="p-4">Stock Level</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map(p => {
                            const low = isLowStock(p);
                            return (
                                <tr key={p._id as string} className="hover:bg-gray-50 transition-colors group" style={low ? { borderLeft: '4px solid #f59e0b' } : { borderLeft: '4px solid transparent' }}>
                                    <td className="p-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#D4A853]/20" />}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm font-extrabold text-gray-900">{p.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                                                {p.type}
                                            </span>
                                            <span className="text-[10px] font-mono text-gray-400">ID: {(p._id as string).slice(-6).toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {/* Stock formatting based on type */}
                                        {p.type === 'fabric' && (
                                            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                                                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                                                <span className={(p as any).stockInMeters < 5 ? 'text-amber-600' : ''}>{(p as any).stockInMeters} m</span>
                                            </div>
                                        )}
                                        {p.type === 'readymade' && (
                                            <div className="flex gap-1.5">
                                                {Object.entries((p as any).sizeStock || {}).map(([sz, qty]: [string, any]) => (
                                                    <div key={sz} className="flex flex-col items-center">
                                                        <span className="text-[9px] font-bold text-gray-400">{sz}</span>
                                                        <span className={`text-xs font-bold ${qty === 0 ? 'text-red-500' : qty < 3 ? 'text-amber-500' : 'text-gray-900'}`}>{qty}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {p.type === 'accessory' && (
                                            <div className="text-sm font-bold text-gray-900">
                                                <span className={(p as any).stock < 5 ? 'text-amber-600' : ''}>{(p as any).stock} units</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm font-bold text-gray-900">₹{p.price.toLocaleString('en-IN')}</p>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => toggleActive(p)}
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${p.active ? 'bg-[#10b981]' : 'bg-gray-300'}`}
                                        >
                                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${p.active ? 'translate-x-4' : 'translate-x-1'}`} />
                                        </button>
                                        <span className="text-[10px] font-bold text-gray-500 ml-2 uppercase">{p.active ? 'Active' : 'Draft'}</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => setRestockProduct(p)} className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#0f1035] bg-[#D4A853]/20 hover:bg-[#D4A853]/30 transition-colors border border-[#D4A853]/30">
                                            Restock
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-sm font-medium text-gray-500">
                                    No products found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {restockProduct && <RestockModal product={restockProduct} onClose={() => setRestockProduct(null)} onSave={handleRestockSave} />}
            {isAddOpen && <AddProductDrawer onClose={() => setIsAddOpen(false)} onSave={handleCreateSave} />}
        </div>
    );
}
