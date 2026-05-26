'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';

interface Props {
    onClose: () => void;
    onSave: (payload: any) => Promise<void>;
}

export default function AddProductDrawer({ onClose, onSave }: Props) {
    const [step, setStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [type, setType] = useState<'readymade' | 'fabric' | 'accessory' | null>(null);
    const [baseInfo, setBaseInfo] = useState({ name: '', description: '', price: '', category: 'mens' });
    const [images, setImages] = useState<string[]>([]);
    
    // Type-specific state
    const [fabricInfo, setFabricInfo] = useState({ fabricType: 'Cotton', width: '58', stockInMeters: '0', pricePerMeter: '' });
    const [readymadeInfo, setReadymadeInfo] = useState({ material: 'Cotton', color: 'White', sizeStock: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 } });
    const [accessoryInfo, setAccessoryInfo] = useState({ material: '', color: '', stock: '0' });

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload: any = {
                ...baseInfo,
                price: parseFloat(baseInfo.price) || 0,
                type,
                images,
                active: true,
                featured: false,
                tags: []
            };

            if (type === 'fabric') {
                Object.assign(payload, {
                    ...fabricInfo,
                    width: parseFloat(fabricInfo.width) || 0,
                    stockInMeters: parseFloat(fabricInfo.stockInMeters) || 0,
                    pricePerMeter: parseFloat(fabricInfo.pricePerMeter) || parseFloat(baseInfo.price) || 0,
                });
            } else if (type === 'readymade') {
                Object.assign(payload, { ...readymadeInfo });
            } else if (type === 'accessory') {
                Object.assign(payload, {
                    ...accessoryInfo,
                    stock: parseInt(accessoryInfo.stock) || 0
                });
            }

            await onSave(payload);
            onClose();
        } catch (error) {
            console.error('Failed to create product:', error);
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-gray-900/40 backdrop-blur-sm">
            <div className="w-[500px] max-w-[100vw] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right-8 duration-300">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between bg-gray-50">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4A853] mb-1">Step {step} of 3</p>
                        <h2 className="text-xl font-extrabold text-gray-900">Add New Product</h2>
                    </div>
                    <button onClick={onClose} disabled={isSaving} className="text-gray-400 hover:text-gray-900 p-1">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {step === 1 && (
                        <div className="flex flex-col gap-4">
                            <h3 className="text-sm font-extrabold text-gray-900 mb-2">Select Product Type</h3>
                            {[
                                { id: 'readymade', label: 'Readymade Garment', desc: 'Pre-stitched items like Kurtas with sizes.' },
                                { id: 'fabric', label: 'Fabric / Textile', desc: 'Raw unstitched fabrics sold by the meter.' },
                                { id: 'accessory', label: 'Accessory & Others', desc: 'Caps, Perfumes, Shoes, etc.' },
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setType(t.id as any)}
                                    className={`p-4 rounded-2xl border-2 text-left transition-all ${type === t.id ? 'border-[#D4A853] bg-[rgba(212,168,83,0.05)]' : 'border-gray-100 hover:border-gray-300'}`}
                                >
                                    <h4 className={`text-sm font-bold ${type === t.id ? 'text-[#D4A853]' : 'text-gray-900'}`}>{t.label}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{t.desc}</p>
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col gap-5">
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-2">Product Name</label>
                                <input value={baseInfo.name} onChange={e => setBaseInfo({...baseInfo, name: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:border-[#D4A853] outline-none" placeholder="e.g. Classic White Linen" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-2">Description</label>
                                <textarea value={baseInfo.description} onChange={e => setBaseInfo({...baseInfo, description: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:border-[#D4A853] outline-none h-24 resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-2">Base Price (₹)</label>
                                    <input type="number" value={baseInfo.price} onChange={e => setBaseInfo({...baseInfo, price: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:border-[#D4A853] outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-2">Category</label>
                                    <select value={baseInfo.category} onChange={e => setBaseInfo({...baseInfo, category: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:border-[#D4A853] outline-none bg-white">
                                        <option value="mens">Mens</option>
                                        <option value="womens">Womens</option>
                                        <option value="kids">Kids</option>
                                        <option value="accessories">Accessories</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-2">Images ({images.length} added)</label>
                                <ImageUpload
                                    variant="dropzone"
                                    onUploadSuccess={(url) =>
                                        setImages((prev) => [...prev, url])
                                    }
                                />
                                
                                {images.length > 0 && (
                                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                        {images.map((img, i) => (
                                            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                                                <img src={img} alt="preview" className="w-full h-full object-cover" />
                                                <button 
                                                    type="button"
                                                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                                                    className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5"
                                                >
                                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && type === 'fabric' && (
                        <div className="flex flex-col gap-5">
                            <h3 className="text-sm font-extrabold text-gray-900 mb-2 border-b pb-2">Fabric Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-2">Fabric Type</label>
                                    <input value={fabricInfo.fabricType} onChange={e => setFabricInfo({...fabricInfo, fabricType: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-2">Width (inches)</label>
                                    <input type="number" value={fabricInfo.width} onChange={e => setFabricInfo({...fabricInfo, width: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-2">Initial Stock (m)</label>
                                    <input type="number" value={fabricInfo.stockInMeters} onChange={e => setFabricInfo({...fabricInfo, stockInMeters: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-2">Price Per Meter (₹)</label>
                                    <input type="number" value={fabricInfo.pricePerMeter} onChange={e => setFabricInfo({...fabricInfo, pricePerMeter: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm outline-none" />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && type === 'readymade' && (
                        <div className="flex flex-col gap-5">
                            <h3 className="text-sm font-extrabold text-gray-900 mb-2 border-b pb-2">Readymade Details</h3>
                            <div className="grid grid-cols-2 gap-4 mb-2">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-2">Material</label>
                                    <input value={readymadeInfo.material} onChange={e => setReadymadeInfo({...readymadeInfo, material: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-2">Color</label>
                                    <input value={readymadeInfo.color} onChange={e => setReadymadeInfo({...readymadeInfo, color: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-3">Initial Stock Grid</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {(['S', 'M', 'L', 'XL', 'XXL'] as const).map(sz => (
                                        <div key={sz}>
                                            <label className="text-[10px] font-extrabold text-gray-400 block mb-1 text-center">{sz}</label>
                                            <input type="number" min="0" value={readymadeInfo.sizeStock[sz]} onChange={e => setReadymadeInfo({...readymadeInfo, sizeStock: {...readymadeInfo.sizeStock, [sz]: parseInt(e.target.value)||0}})} className="w-full p-2 rounded-lg border border-gray-200 text-sm text-center outline-none font-bold text-[#D4A853]" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && type === 'accessory' && (
                        <div className="flex flex-col gap-5">
                            <h3 className="text-sm font-extrabold text-gray-900 mb-2 border-b pb-2">Accessory Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-2">Initial Stock</label>
                                    <input type="number" value={accessoryInfo.stock} onChange={e => setAccessoryInfo({...accessoryInfo, stock: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-2">Color (optional)</label>
                                    <input value={accessoryInfo.color} onChange={e => setAccessoryInfo({...accessoryInfo, color: e.target.value})} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm outline-none" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 flex justify-between bg-white">
                    {step > 1 ? (
                        <button onClick={() => setStep(s => s - 1)} disabled={isSaving} className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900">Back</button>
                    ) : <div />}
                    
                    {step < 3 ? (
                        <button onClick={() => setStep(s => s + 1)} disabled={step === 1 && !type} className="px-6 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50" style={{ backgroundColor: '#D4A853', color: '#0f1035' }}>Next Step</button>
                    ) : (
                        <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50" style={{ backgroundColor: '#0f1035', color: '#ffffff' }}>
                            {isSaving ? 'Publishing...' : 'Publish Product'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
