'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/ImageUpload';

type ProductType = 'readymade' | 'fabric' | 'accessory';

interface FormState {
    name: string;
    description: string;
    price: string;
    type: ProductType;
    category: 'mens' | 'womens' | 'kids' | 'accessories';
    subcategory: string;
    tags: string;
    featured: boolean;
    // Readymade-specific
    material: string;
    color: string;
    sizeStock_S: string;
    sizeStock_M: string;
    sizeStock_L: string;
    sizeStock_XL: string;
    sizeStock_XXL: string;
    // Fabric-specific
    pricePerMeter: string;
    stockInMeters: string;
    fabricType: string;
    width: string;
    stitchingAvailable: boolean;
    stitchingPrice: string;
    // Accessory-specific
    stock: string;
}

const defaultForm: FormState = {
    name: '',
    description: '',
    price: '',
    type: 'readymade',
    category: 'mens',
    subcategory: '',
    tags: '',
    featured: false,
    material: '',
    color: '',
    sizeStock_S: '0',
    sizeStock_M: '0',
    sizeStock_L: '0',
    sizeStock_XL: '0',
    sizeStock_XXL: '0',
    pricePerMeter: '',
    stockInMeters: '',
    fabricType: '',
    width: '',
    stitchingAvailable: true,
    stitchingPrice: '0',
    stock: '0',
};

export default function NewProductPage() {
    const router = useRouter();
    const [form, setForm] = useState<FormState>(defaultForm);
    const [images, setImages] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        if (images.length === 0) {
            setError('Please upload at least one product image.');
            setSubmitting(false);
            return;
        }

        // Build the payload based on type
        const payload: any = {
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
            type: form.type,
            category: form.category,
            subcategory: form.subcategory,
            tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
            featured: form.featured,
            images,
        };

        if (form.type === 'readymade') {
            payload.material = form.material;
            payload.color = form.color;
            payload.sizeStock = {
                S: parseInt(form.sizeStock_S) || 0,
                M: parseInt(form.sizeStock_M) || 0,
                L: parseInt(form.sizeStock_L) || 0,
                XL: parseInt(form.sizeStock_XL) || 0,
                XXL: parseInt(form.sizeStock_XXL) || 0,
            };
        } else if (form.type === 'fabric') {
            payload.pricePerMeter = parseFloat(form.pricePerMeter);
            payload.stockInMeters = parseFloat(form.stockInMeters);
            payload.fabricType = form.fabricType;
            payload.width = parseFloat(form.width);
            payload.stitchingAvailable = form.stitchingAvailable;
            payload.stitchingPrice = parseFloat(form.stitchingPrice) || 0;
        } else {
            payload.stock = parseInt(form.stock) || 0;
            payload.material = form.material;
            payload.color = form.color;
        }

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || data.error || 'Failed to create product');
            }

            router.push('/admin');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass =
        'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent';
    const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-emerald-600 mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Admin
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-gray-500 text-sm mt-1">Fill in the details to list a new product.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* ── Core Details ── */}
                <section className="bg-white border rounded-xl p-6 space-y-4">
                    <h2 className="font-semibold text-gray-800 text-lg">Core Details</h2>

                    <div>
                        <label className={labelClass}>Product Name *</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Premium Cotton Kurta"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Description *</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            placeholder="Describe the product..."
                            className={inputClass}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Type *</label>
                            <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
                                <option value="readymade">Readymade</option>
                                <option value="fabric">Fabric</option>
                                <option value="accessory">Accessory</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Category *</label>
                            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                                <option value="mens">Men&apos;s</option>
                                <option value="womens">Women&apos;s</option>
                                <option value="kids">Kids</option>
                                <option value="accessories">Accessories</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Base Price (PKR) *</label>
                            <input
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.price}
                                onChange={handleChange}
                                required
                                placeholder="0.00"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Subcategory</label>
                            <input
                                name="subcategory"
                                value={form.subcategory}
                                onChange={handleChange}
                                placeholder="e.g. Kurta, Abaya, Cap"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Tags (comma-separated)</label>
                        <input
                            name="tags"
                            value={form.tags}
                            onChange={handleChange}
                            placeholder="e.g. summer, cotton, eid"
                            className={inputClass}
                        />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="featured"
                            checked={form.featured}
                            onChange={handleChange}
                            className="w-4 h-4 accent-emerald-600"
                        />
                        <span className="text-sm text-gray-700">Mark as Featured</span>
                    </label>
                </section>

                {/* ── Type-specific Fields ── */}
                {form.type === 'readymade' && (
                    <section className="bg-white border rounded-xl p-6 space-y-4">
                        <h2 className="font-semibold text-gray-800 text-lg">Readymade Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Material *</label>
                                <input name="material" value={form.material} onChange={handleChange} required placeholder="e.g. Cotton" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Color *</label>
                                <input name="color" value={form.color} onChange={handleChange} required placeholder="e.g. White" className={inputClass} />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Size Stock</label>
                            <div className="grid grid-cols-5 gap-2">
                                {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((size) => (
                                    <div key={size} className="text-center">
                                        <label className="text-xs text-gray-500 block mb-1">{size}</label>
                                        <input
                                            type="number"
                                            name={`sizeStock_${size}`}
                                            min="0"
                                            value={(form as any)[`sizeStock_${size}`]}
                                            onChange={handleChange}
                                            className={inputClass + ' text-center'}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {form.type === 'fabric' && (
                    <section className="bg-white border rounded-xl p-6 space-y-4">
                        <h2 className="font-semibold text-gray-800 text-lg">Fabric Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Fabric Type *</label>
                                <input name="fabricType" value={form.fabricType} onChange={handleChange} required placeholder="e.g. Linen" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Width (inches) *</label>
                                <input name="width" type="number" min="0" value={form.width} onChange={handleChange} required placeholder="e.g. 44" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Price Per Meter (PKR) *</label>
                                <input name="pricePerMeter" type="number" min="0" step="0.01" value={form.pricePerMeter} onChange={handleChange} required placeholder="0.00" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Stock (meters) *</label>
                                <input name="stockInMeters" type="number" min="0" value={form.stockInMeters} onChange={handleChange} required placeholder="e.g. 50" className={inputClass} />
                            </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="stitchingAvailable"
                                checked={form.stitchingAvailable}
                                onChange={handleChange}
                                className="w-4 h-4 accent-emerald-600"
                            />
                            <span className="text-sm text-gray-700">Stitching Available</span>
                        </label>
                        {form.stitchingAvailable && (
                            <div>
                                <label className={labelClass}>Stitching Price (PKR)</label>
                                <input name="stitchingPrice" type="number" min="0" step="0.01" value={form.stitchingPrice} onChange={handleChange} placeholder="0.00" className={inputClass} />
                            </div>
                        )}
                    </section>
                )}

                {form.type === 'accessory' && (
                    <section className="bg-white border rounded-xl p-6 space-y-4">
                        <h2 className="font-semibold text-gray-800 text-lg">Accessory Details</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>Stock *</label>
                                <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Material</label>
                                <input name="material" value={form.material} onChange={handleChange} placeholder="e.g. Leather" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Color</label>
                                <input name="color" value={form.color} onChange={handleChange} placeholder="e.g. Black" className={inputClass} />
                            </div>
                        </div>
                    </section>
                )}

                {/* ── Images ── */}
                <section className="bg-white border rounded-xl p-6 space-y-4">
                    <h2 className="font-semibold text-gray-800 text-lg">Product Images *</h2>

                    {/* Thumbnails */}
                    {images.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                            {images.map((url, i) => (
                                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                                    <img src={url} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                                        className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <ImageUpload
                        onUploadSuccess={(url) => setImages((prev) => [...prev, url])}
                    />
                    <p className="text-xs text-gray-400">Upload multiple images. First image will be the main display photo.</p>
                </section>

                {/* ── Error & Submit ── */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                        {error}
                    </div>
                )}

                <div className="flex gap-3">
                    <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700">
                        {submitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Create Product'
                        )}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                </div>

            </form>
        </div>
    );
}
