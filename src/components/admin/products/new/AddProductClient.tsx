'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AdminHeader from '@/components/admin/AdminHeader';

// ============================================================================
// SCHEMA
// ============================================================================

const productSchema = z
    .object({
        name: z.string().min(1, 'Name is required'),
        description: z.string().min(1, 'Description is required'),
        price: z.coerce.number().min(0, 'Price must be 0 or more'),
        category: z.enum(['mens', 'womens', 'kids', 'accessories']),
        type: z.enum(['readymade', 'fabric', 'accessory']),
        images: z.array(z.string()).default([]),
        
        // Readymade fields
        sizeStock: z.object({
            S: z.coerce.number().min(0).default(0),
            M: z.coerce.number().min(0).default(0),
            L: z.coerce.number().min(0).default(0),
            XL: z.coerce.number().min(0).default(0),
            XXL: z.coerce.number().min(0).default(0),
        }).optional(),
        material: z.string().optional(),
        color: z.string().optional(),

        // Fabric fields
        stockInMeters: z.coerce.number().min(0).optional(),
        pricePerMeter: z.coerce.number().min(0).optional(),
        fabricType: z.string().optional(),
        width: z.coerce.number().min(0).optional(),
        stitchingAvailable: z.boolean().default(false).optional(),
        stitchingPrice: z.coerce.number().min(0).default(0).optional(),

        // Accessory fields
        stock: z.coerce.number().min(0).optional(),
    })
    .superRefine((data, ctx) => {
        if (data.type === 'readymade') {
            if (!data.material) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Material is required', path: ['material'] });
            if (!data.color) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Color is required', path: ['color'] });
        }
        if (data.type === 'fabric') {
            if (data.stockInMeters === undefined) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Stock is required', path: ['stockInMeters'] });
            if (data.pricePerMeter === undefined) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Price per meter is required', path: ['pricePerMeter'] });
            if (!data.fabricType) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Fabric type is required', path: ['fabricType'] });
            if (data.width === undefined) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Width is required', path: ['width'] });
        }
        if (data.type === 'accessory') {
            if (data.stock === undefined) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Stock is required', path: ['stock'] });
        }
    });

type ProductFormValues = z.infer<typeof productSchema>;

// ============================================================================
// COMPONENT
// ============================================================================

export default function AddProductClient() {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            category: 'mens',
            type: 'readymade',
            images: [],
            sizeStock: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
            stitchingAvailable: false,
            stitchingPrice: 0,
        },
    });

    const selectedType = watch('type');
    const uploadedImages = watch('images');

    // Handle Image Upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        setIsUploading(true);
        try {
            const urls = [...uploadedImages];
            // Upload multiple files sequentially for simplicity
            for (let i = 0; i < e.target.files.length; i++) {
                const formData = new FormData();
                formData.append('file', e.target.files[i]);
                
                const res = await fetch('/api/admin/upload-image', {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                
                if (!res.ok) throw new Error(data.error || 'Upload failed');
                urls.push(data.url);
            }
            setValue('images', urls, { shouldValidate: true });
            toast.success('Images uploaded successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload images');
        } finally {
            setIsUploading(false);
            // reset file input
            e.target.value = '';
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...uploadedImages];
        newImages.splice(index, 1);
        setValue('images', newImages);
    };

    // Handle Form Submit
    const onSubmit = async (data: ProductFormValues) => {
        try {
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            
            if (!res.ok) throw new Error(json.error || 'Failed to create product');
            
            toast.success('Product created successfully');
            router.push('/admin/inventory');
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 min-h-screen">
            <AdminHeader />
            
            <main className="flex-1 p-6 lg:p-8 max-w-5xl mx-auto w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    
                    {/* Basic Info */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                        <h2 className="text-lg font-extrabold text-gray-900">Basic Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Product Name</label>
                                <Input {...register('name')} placeholder="e.g. Classic White Kurta" />
                                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Base Price (₹)</label>
                                <Input type="number" {...register('price')} placeholder="0" />
                                {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Category</label>
                                <select 
                                    {...register('category')}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="mens">Mens</option>
                                    <option value="womens">Womens</option>
                                    <option value="kids">Kids</option>
                                    <option value="accessories">Accessories</option>
                                </select>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Product Type</label>
                                <select 
                                    {...register('type')}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="readymade">Readymade</option>
                                    <option value="fabric">Fabric</option>
                                    <option value="accessory">Accessory</option>
                                </select>
                            </div>
                            
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-gray-700">Description</label>
                                <Textarea {...register('description')} rows={4} placeholder="Product description..." />
                                {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Fields */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                        <h2 className="text-lg font-extrabold text-gray-900 capitalize">{selectedType} Details</h2>
                        
                        {selectedType === 'readymade' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Material</label>
                                    <Input {...register('material')} placeholder="e.g. Cotton" />
                                    {errors.material && <p className="text-xs text-red-500">{errors.material.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Color</label>
                                    <Input {...register('color')} placeholder="e.g. Blue" />
                                    {errors.color && <p className="text-xs text-red-500">{errors.color.message}</p>}
                                </div>
                                
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-sm font-bold text-gray-700">Size Inventory</label>
                                    <div className="flex gap-4">
                                        {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                            <div key={size} className="flex-1 space-y-1">
                                                <label className="text-xs font-semibold text-gray-500">{size}</label>
                                                <Input type="number" {...register(`sizeStock.${size}` as any)} placeholder="0" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedType === 'fabric' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Fabric Type</label>
                                    <Input {...register('fabricType')} placeholder="e.g. Silk" />
                                    {errors.fabricType && <p className="text-xs text-red-500">{errors.fabricType.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Width (inches)</label>
                                    <Input type="number" {...register('width')} placeholder="44" />
                                    {errors.width && <p className="text-xs text-red-500">{errors.width.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Stock (Meters)</label>
                                    <Input type="number" {...register('stockInMeters')} placeholder="0" />
                                    {errors.stockInMeters && <p className="text-xs text-red-500">{errors.stockInMeters.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Price per Meter (₹)</label>
                                    <Input type="number" {...register('pricePerMeter')} placeholder="0" />
                                    {errors.pricePerMeter && <p className="text-xs text-red-500">{errors.pricePerMeter.message}</p>}
                                </div>
                                
                                <div className="md:col-span-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Controller
                                            name="stitchingAvailable"
                                            control={control}
                                            render={({ field }) => (
                                                <input 
                                                    type="checkbox" 
                                                    id="stitchingAvailable"
                                                    checked={field.value}
                                                    onChange={field.onChange}
                                                    className="w-4 h-4 text-[#0f1035] rounded border-gray-300 focus:ring-[#0f1035]"
                                                />
                                            )}
                                        />
                                        <label htmlFor="stitchingAvailable" className="text-sm font-bold text-gray-700">
                                            Custom Stitching Available
                                        </label>
                                    </div>
                                    
                                    {watch('stitchingAvailable') && (
                                        <div className="space-y-2 max-w-xs">
                                            <label className="text-sm font-bold text-gray-700">Stitching Price (₹)</label>
                                            <Input type="number" {...register('stitchingPrice')} placeholder="0" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {selectedType === 'accessory' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Stock Count</label>
                                    <Input type="number" {...register('stock')} placeholder="0" />
                                    {errors.stock && <p className="text-xs text-red-500">{errors.stock.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Material (Optional)</label>
                                    <Input {...register('material')} placeholder="e.g. Leather" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Color (Optional)</label>
                                    <Input {...register('color')} placeholder="e.g. Brown" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Images */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                        <h2 className="text-lg font-extrabold text-gray-900">Product Images</h2>
                        
                        <div className="flex flex-wrap gap-4">
                            {uploadedImages.map((url, i) => (
                                <div key={i} className="relative w-32 h-32 rounded-lg border border-gray-200 overflow-hidden group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={url} alt="Product" className="w-full h-full object-cover" />
                                    <button 
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            
                            <label className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors">
                                {isUploading ? (
                                    <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span className="text-2xl">+</span>
                                        <span className="text-xs font-semibold mt-1">Add Image</span>
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    multiple 
                                    onChange={handleImageUpload} 
                                    disabled={isUploading}
                                    className="hidden" 
                                />
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => router.back()}
                            disabled={isSubmitting || isUploading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting || isUploading}
                            className="bg-[#0f1035] hover:bg-[#0f1035]/90 text-white"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Product'}
                        </Button>
                    </div>

                </form>
            </main>
        </div>
    );
}
