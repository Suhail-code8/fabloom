'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { AnyProduct } from '@/types/product';
import ImageUploader from '@/components/admin/ImageUploader';

interface Props {
    product: AnyProduct;
    onClose: () => void;
    onSave: (id: string, updates: Record<string, unknown>) => Promise<void>;
}

export default function EditProductDrawer({ product, onClose, onSave }: Props) {
    const [saving, setSaving] = useState(false);
    const p = product as any;

    const [name, setName] = useState(p.name || '');
    const [description, setDescription] = useState(p.description || '');
    const [price, setPrice] = useState(String(p.price ?? ''));
    const [images, setImages] = useState<string[]>(p.images || []);
    const [material, setMaterial] = useState(p.material || p.fabricType || '');
    const [color, setColor] = useState(p.color || '');
    const [subcategory, setSubcategory] = useState(p.subcategory || '');
    const [stockInMeters, setStockInMeters] = useState(String(p.stockInMeters ?? ''));
    const [pricePerMeter, setPricePerMeter] = useState(String(p.pricePerMeter ?? ''));
    const [width, setWidth] = useState(String(p.width ?? ''));
    const [stock, setStock] = useState(String(p.stock ?? ''));
    const [suitableForText, setSuitableForText] = useState((p.suitableFor || []).join(', '));
    const [sizeStock, setSizeStock] = useState({
        S: p.sizeStock?.S ?? 0,
        M: p.sizeStock?.M ?? 0,
        L: p.sizeStock?.L ?? 0,
        XL: p.sizeStock?.XL ?? 0,
        XXL: p.sizeStock?.XXL ?? 0,
    });

    async function handleSave() {
        setSaving(true);
        try {
            const payload: Record<string, unknown> = {
                name,
                description,
                images,
            };

            if (product.type === 'readymade') {
                payload.price = parseFloat(price) || 0;
                payload.material = material;
                payload.color = color;
                payload.sizeStock = sizeStock;
                payload.subcategory = subcategory; // garmentType
            } else if (product.type === 'fabric') {
                payload.pricePerMeter = parseFloat(pricePerMeter) || 0;
                payload.stockInMeters = parseFloat(stockInMeters) || 0;
                payload.fabricType = material;
                payload.width = parseFloat(width) || 0;
                payload.suitableFor = suitableForText
                    .split(',')
                    .map((s: string) => s.trim())
                    .filter(Boolean);
            } else {
                payload.price = parseFloat(price) || 0;
                payload.stock = parseInt(stock) || 0;
                payload.color = color;
                payload.material = material;
                payload.subcategory = subcategory; // accessoryType
            }

            await onSave(product._id as string, payload);
            toast.success('Product updated');
            onClose();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Failed to save');
            setSaving(false);
        }
    }

    const inputClass =
        'w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:border-[#D4A853] outline-none';

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-gray-900/40 backdrop-blur-sm">
            <div className="w-[480px] max-w-[100vw] bg-white h-full shadow-2xl flex flex-col">
                <div className="px-6 py-5 border-b flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold uppercase text-[#D4A853]">Edit Product</p>
                        <h2 className="text-lg font-extrabold text-gray-900 capitalize">{product.type}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-900">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputClass} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Images</label>
                        <ImageUploader images={images} onChange={setImages} />
                    </div>

                    {product.type === 'readymade' && (
                        <>
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">Price (₹)</label>
                                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">Garment Type</label>
                                <input value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className={inputClass} placeholder="e.g. kurta, thobe, shirt, pant" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">Material</label>
                                    <input value={material} onChange={(e) => setMaterial(e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">Color</label>
                                    <input value={color} onChange={(e) => setColor(e.target.value)} className={inputClass} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-2">Size Stock</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((sz) => (
                                        <div key={sz}>
                                            <label className="text-[10px] text-gray-500 block text-center">{sz}</label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={sizeStock[sz]}
                                                onChange={(e) =>
                                                    setSizeStock({ ...sizeStock, [sz]: parseInt(e.target.value) || 0 })
                                                }
                                                className={inputClass + ' text-center'}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {product.type === 'fabric' && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">Price per meter</label>
                                    <input type="number" value={pricePerMeter} onChange={(e) => setPricePerMeter(e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">Stock (meters)</label>
                                    <input type="number" value={stockInMeters} onChange={(e) => setStockInMeters(e.target.value)} className={inputClass} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">Fabric type</label>
                                    <input value={material} onChange={(e) => setMaterial(e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">Width (inches)</label>
                                    <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className={inputClass} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">Suitable for</label>
                                <input value={suitableForText} onChange={(e) => setSuitableForText(e.target.value)} placeholder="e.g. Kurta, Thobe, Shirt, Pant" className={inputClass} />
                            </div>
                        </>
                    )}

                    {product.type === 'accessory' && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">Price</label>
                                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">Stock</label>
                                    <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className={inputClass} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">Accessory Type</label>
                                <input value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className={inputClass} placeholder="e.g. perfume, cap, belt" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">Color</label>
                                <input value={color} onChange={(e) => setColor(e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">Material</label>
                                <input value={material} onChange={(e) => setMaterial(e.target.value)} className={inputClass} />
                            </div>
                        </>
                    )}
                </div>

                <div className="p-5 border-t flex justify-end gap-3">
                    <button onClick={onClose} disabled={saving} className="px-4 py-2 text-xs font-bold text-gray-600">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 rounded-xl text-xs font-bold bg-[#0f1035] text-white disabled:opacity-50"
                    >
                        {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
