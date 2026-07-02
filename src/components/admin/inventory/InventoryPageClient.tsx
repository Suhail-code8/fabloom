'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { AnyProduct } from '@/types/product';
import RestockModal from './RestockModal';
import EditProductDrawer from './EditProductDrawer';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function isLowStock(p: any): boolean {
    if (p.type === 'fabric') return (p.stockInMeters ?? 0) < 5;
    if (p.type === 'readymade') {
        const sizes = p.sizeStock || {};
        return Object.values(sizes).some((qty: any) => qty < 2);
    }
    if (p.type === 'accessory') return (p.stock ?? 0) < 5;
    return false;
}

function stockLabel(p: any): string {
    if (p.type === 'fabric') return `${p.stockInMeters ?? 0} m`;
    if (p.type === 'readymade') {
        const total = Object.values(p.sizeStock || {}).reduce(
            (s: number, q: any) => s + (Number(q) || 0),
            0
        );
        return `${total} units`;
    }
    return `${p.stock ?? 0} units`;
}

export default function InventoryPageClient() {
    const { data, error, mutate } = useSWR<{ products: AnyProduct[] }>(
        '/api/admin/products',
        fetcher
    );

    const [tab, setTab] = useState<
        'all' | 'readymade' | 'fabric' | 'perfumes' | 'caps' | 'accessories' | 'low_stock'
    >('all');
    const [search, setSearch] = useState('');
    const [restockProduct, setRestockProduct] = useState<AnyProduct | null>(null);
    const [editProduct, setEditProduct] = useState<AnyProduct | null>(null);
    const router = useRouter();

    const products = useMemo(() => data?.products || [], [data?.products]);

    const filteredProducts = useMemo(() => {
        const isPerfume = (p: any) =>
            p.type === 'accessory' &&
            (p.subcategory === 'perfume' || ['arabian', 'floral', 'fresh', 'woody', 'gift-set'].includes(p.subcategory));
        const isCap = (p: any) =>
            p.type === 'accessory' &&
            (p.subcategory === 'cap' || ['kufi', 'prayer', 'snapback', 'taqiyah', 'summer'].includes(p.subcategory));
        const isGeneralAccessory = (p: any) =>
            p.type === 'accessory' &&
            !['perfume', 'cap', 'arabian', 'floral', 'fresh', 'woody', 'gift-set', 'kufi', 'prayer', 'snapback', 'taqiyah', 'summer'].includes(p.subcategory);

        return products.filter((p) => {
            if (tab === 'low_stock' && !isLowStock(p)) return false;
            if (tab === 'readymade' && p.type !== 'readymade') return false;
            if (tab === 'fabric' && p.type !== 'fabric') return false;
            if (tab === 'perfumes' && !isPerfume(p)) return false;
            if (tab === 'caps' && !isCap(p)) return false;
            if (tab === 'accessories' && !isGeneralAccessory(p)) return false;

            if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        });
    }, [products, tab, search]);

    async function patchProduct(id: string, updates: Record<string, unknown>) {
        const res = await fetch(`/api/admin/products/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        const json = await res.json();
        if (!res.ok) {
            throw new Error(json.error || json.details?.[0]?.message || 'Update failed');
        }
        await mutate();
        return json.product;
    }

    const toggleActive = async (product: AnyProduct) => {
        const next = !product.active;
        mutate(
            { products: products.map((p) => (p._id === product._id ? { ...p, active: next } : p)) },
            false
        );
        try {
            await patchProduct(product._id as string, { active: next });
            toast.success(next ? 'Product activated' : 'Product deactivated');
        } catch (e) {
            mutate();
            toast.error(e instanceof Error ? e.message : 'Failed to update status');
        }
    };

    const handleRestockSave = async (id: string, updates: Record<string, unknown>) => {
        await patchProduct(id, updates);
        toast.success('Stock updated');
    };

    const handleEditSave = async (id: string, updates: Record<string, unknown>) => {
        await patchProduct(id, updates);
        toast.success('Product updated');
    };

    const handleCreateSave = async (payload: Record<string, unknown>) => {
        const res = await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to create product');
        await mutate();
        toast.success('Product created');
    };

    if (error) {
        return <p className="text-red-500 p-8">Failed to load inventory.</p>;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-extrabold text-gray-900">Inventory</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage products, stock, and catalog status</p>
                </div>
                <button
                    onClick={() => router.push('/admin/products/new')}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0f1035] text-white flex items-center gap-2"
                >
                    + Add Product
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-2xl border border-gray-200">
                {[
                    ['all', 'All'],
                    ['readymade', 'Readymade'],
                    ['fabric', 'Fabrics'],
                    ['perfumes', 'Perfumes'],
                    ['caps', 'Caps'],
                    ['accessories', 'Accessories'],
                    ['low_stock', 'Low Stock'],
                ].map(([id, label]) => (
                    <button
                        key={id}
                        onClick={() => setTab(id as typeof tab)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold ${
                            tab === id ? 'bg-[#0f1035] text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {label}
                    </button>
                ))}
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="ml-auto w-full sm:w-64 px-4 py-2 rounded-xl border border-gray-200 text-sm"
                />
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-[10px] font-extrabold text-gray-500 uppercase">
                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Active</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((p) => (
                            <tr key={p._id as string} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                                        {p.images?.[0] ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                                        ) : null}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <p className="text-sm font-extrabold text-gray-900">{p.name}</p>
                                </td>
                                <td className="p-4">
                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gray-100">
                                        {p.type}
                                    </span>
                                </td>
                                <td className="p-4 text-sm font-bold">{stockLabel(p)}</td>
                                <td className="p-4 text-sm font-bold">
                                    {p.type === 'fabric'
                                        ? `₹${(p.pricePerMeter ?? 0).toLocaleString('en-IN')} / meter`
                                        : `₹${(p.price ?? 0).toLocaleString('en-IN')}`}
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => toggleActive(p)}
                                        className={`relative inline-flex h-5 w-9 items-center rounded-full ${
                                            p.active ? 'bg-emerald-500' : 'bg-gray-300'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
                                                p.active ? 'translate-x-4' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => setRestockProduct(p)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#D4A853]/20 text-[#0f1035]"
                                    >
                                        Restock
                                    </button>
                                    <button
                                        onClick={() => setEditProduct(p)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-700"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-12 text-center text-sm text-gray-500">
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {restockProduct && (
                <RestockModal
                    product={restockProduct}
                    onClose={() => setRestockProduct(null)}
                    onSave={handleRestockSave}
                />
            )}
            {editProduct && (
                <EditProductDrawer
                    product={editProduct}
                    onClose={() => setEditProduct(null)}
                    onSave={handleEditSave}
                />
            )}
        </div>
    );
}
