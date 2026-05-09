'use client';

import { useState } from 'react';
import type { AnyProduct } from '@/types/product';

interface RestockModalProps {
    product: AnyProduct;
    onClose: () => void;
    onSave: (id: string, updates: any) => Promise<void>;
}

export default function RestockModal({ product, onClose, onSave }: RestockModalProps) {
    const [isSaving, setIsSaving] = useState(false);

    // Initial state based on product type
    const [stockInMeters, setStockInMeters] = useState(product.type === 'fabric' ? product.stockInMeters.toString() : '');
    const [simpleStock, setSimpleStock] = useState(product.type === 'accessory' ? product.stock.toString() : '');
    const [sizeStock, setSizeStock] = useState(product.type === 'readymade' ? { ...product.sizeStock } : { S: 0, M: 0, L: 0, XL: 0, XXL: 0 });

    const handleSave = async () => {
        setIsSaving(true);
        try {
            let updates = {};
            if (product.type === 'fabric') {
                updates = { stockInMeters: parseFloat(stockInMeters) || 0 };
            } else if (product.type === 'accessory') {
                updates = { stock: parseInt(simpleStock) || 0 };
            } else if (product.type === 'readymade') {
                updates = { sizeStock };
            }

            await onSave(product._id as string, updates);
            onClose();
        } catch (error) {
            console.error('Failed to restock:', error);
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <div>
                        <h3 className="text-sm font-extrabold text-gray-900">Restock Product</h3>
                        <p className="text-[10px] text-gray-500 font-medium truncate max-w-[200px] mt-0.5">{product.name}</p>
                    </div>
                    <button onClick={onClose} disabled={isSaving} className="text-gray-400 hover:text-gray-900 p-1">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="p-5 flex-1 overflow-y-auto">
                    {product.type === 'fabric' && (
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-2">Total Meters Available</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    value={stockInMeters}
                                    onChange={(e) => setStockInMeters(e.target.value)}
                                    className="flex-1 p-2.5 rounded-lg border border-gray-200 text-sm focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] outline-none font-bold text-gray-900"
                                />
                                <span className="text-xs font-bold text-gray-500">meters</span>
                            </div>
                        </div>
                    )}

                    {product.type === 'accessory' && (
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-2">Total Stock (Units)</label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={simpleStock}
                                onChange={(e) => setSimpleStock(e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] outline-none font-bold text-gray-900"
                            />
                        </div>
                    )}

                    {product.type === 'readymade' && (
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-3">Stock by Size</label>
                            <div className="flex flex-col gap-3">
                                {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((size) => (
                                    <div key={size} className="flex items-center gap-4">
                                        <div className="w-10 text-xs font-extrabold text-gray-500">{size}</div>
                                        <input
                                            type="number"
                                            min="0"
                                            value={sizeStock[size]}
                                            onChange={(e) => setSizeStock({ ...sizeStock, [size]: parseInt(e.target.value) || 0 })}
                                            className="flex-1 p-2 rounded-lg border border-gray-200 text-sm focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] outline-none font-bold text-gray-900"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                    <button onClick={onClose} disabled={isSaving} className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                        style={{ backgroundColor: '#0f1035', color: '#ffffff' }}
                    >
                        {isSaving ? 'Saving...' : 'Update Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
}
