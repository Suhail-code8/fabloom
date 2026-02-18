'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    measurementSchema,
    MeasurementFormData,
    measurementHelp,
    garmentStyles,
    styleDescriptions,
    getLengthLabel,
    getLengthHelp,
} from '@/lib/validations/measurement';
import { Shirt, User } from 'lucide-react';

interface MeasurementFormProps {
    onSubmit: (data: MeasurementFormData) => void;
    isLoading?: boolean;
}

export default function MeasurementForm({
    onSubmit,
    isLoading = false,
}: MeasurementFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<MeasurementFormData>({
        resolver: zodResolver(measurementSchema),
    });

    const selectedStyle = watch('style');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Garment Style Selector */}
            <div className="space-y-3">
                <Label className="text-base font-semibold text-navy-900">
                    Select Garment Style <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-600">{measurementHelp.style}</p>

                <RadioGroup
                    value={selectedStyle}
                    onValueChange={(value) => setValue('style', value as any)}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                    {garmentStyles.map((style) => (
                        <div key={style}>
                            <RadioGroupItem
                                value={style}
                                id={style}
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor={style}
                                className={`
                  flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer
                  transition-all duration-200
                  ${selectedStyle === style
                                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                                        : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                                    }
                `}
                            >
                                <Shirt className="h-8 w-8 mb-2" />
                                <span className="font-semibold text-sm">{style}</span>
                                <span className="text-xs text-gray-600 text-center mt-1">
                                    {styleDescriptions[style]}
                                </span>
                            </Label>
                        </div>
                    ))}
                </RadioGroup>

                {errors.style && (
                    <p className="text-xs text-red-500">{errors.style.message}</p>
                )}
            </div>

            {/* Measurement Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Neck */}
                <div className="space-y-2">
                    <Label htmlFor="neck" className="text-sm font-medium text-navy-900">
                        Neck <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <Input
                            id="neck"
                            type="number"
                            step="0.5"
                            placeholder="e.g., 15.5"
                            {...register('neck', { valueAsNumber: true })}
                            className={errors.neck ? 'border-red-500' : ''}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            inches
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">{measurementHelp.neck}</p>
                    {errors.neck && (
                        <p className="text-xs text-red-500">{errors.neck.message}</p>
                    )}
                </div>

                {/* Chest */}
                <div className="space-y-2">
                    <Label htmlFor="chest" className="text-sm font-medium text-navy-900">
                        Chest <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <Input
                            id="chest"
                            type="number"
                            step="0.5"
                            placeholder="e.g., 40"
                            {...register('chest', { valueAsNumber: true })}
                            className={errors.chest ? 'border-red-500' : ''}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            inches
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">{measurementHelp.chest}</p>
                    {errors.chest && (
                        <p className="text-xs text-red-500">{errors.chest.message}</p>
                    )}
                </div>

                {/* Waist */}
                <div className="space-y-2">
                    <Label htmlFor="waist" className="text-sm font-medium text-navy-900">
                        Waist <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <Input
                            id="waist"
                            type="number"
                            step="0.5"
                            placeholder="e.g., 34"
                            {...register('waist', { valueAsNumber: true })}
                            className={errors.waist ? 'border-red-500' : ''}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            inches
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">{measurementHelp.waist}</p>
                    {errors.waist && (
                        <p className="text-xs text-red-500">{errors.waist.message}</p>
                    )}
                </div>

                {/* Shoulder */}
                <div className="space-y-2">
                    <Label htmlFor="shoulder" className="text-sm font-medium text-navy-900">
                        Shoulder <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <Input
                            id="shoulder"
                            type="number"
                            step="0.5"
                            placeholder="e.g., 18"
                            {...register('shoulder', { valueAsNumber: true })}
                            className={errors.shoulder ? 'border-red-500' : ''}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            inches
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">{measurementHelp.shoulder}</p>
                    {errors.shoulder && (
                        <p className="text-xs text-red-500">{errors.shoulder.message}</p>
                    )}
                </div>

                {/* Sleeve Length */}
                <div className="space-y-2">
                    <Label
                        htmlFor="sleeveLength"
                        className="text-sm font-medium text-navy-900"
                    >
                        Sleeve Length <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <Input
                            id="sleeveLength"
                            type="number"
                            step="0.5"
                            placeholder="e.g., 25"
                            {...register('sleeveLength', { valueAsNumber: true })}
                            className={errors.sleeveLength ? 'border-red-500' : ''}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            inches
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">{measurementHelp.sleeveLength}</p>
                    {errors.sleeveLength && (
                        <p className="text-xs text-red-500">{errors.sleeveLength.message}</p>
                    )}
                </div>

                {/* Shirt/Garment Length - Dynamic Label */}
                <div className="space-y-2">
                    <Label
                        htmlFor="shirtLength"
                        className="text-sm font-medium text-navy-900"
                    >
                        {getLengthLabel(selectedStyle)} <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <Input
                            id="shirtLength"
                            type="number"
                            step="0.5"
                            placeholder={
                                selectedStyle === 'Jubbah' || selectedStyle === 'Kandura'
                                    ? 'e.g., 60'
                                    : selectedStyle === 'Kurta'
                                        ? 'e.g., 42'
                                        : 'e.g., 30'
                            }
                            {...register('shirtLength', { valueAsNumber: true })}
                            className={errors.shirtLength ? 'border-red-500' : ''}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            inches
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">{getLengthHelp(selectedStyle)}</p>
                    {errors.shirtLength && (
                        <p className="text-xs text-red-500">{errors.shirtLength.message}</p>
                    )}
                </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-navy-900">
                    Additional Notes
                </Label>
                <Textarea
                    id="notes"
                    placeholder="Any special instructions or preferences..."
                    rows={3}
                    {...register('notes')}
                    className={errors.notes ? 'border-red-500' : ''}
                />
                <p className="text-xs text-gray-500">{measurementHelp.notes}</p>
                {errors.notes && (
                    <p className="text-xs text-red-500">{errors.notes.message}</p>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-emerald-600 hover:bg-emerald-700"
                >
                    {isLoading ? 'Saving...' : 'Save Measurements'}
                </Button>
            </div>
        </form>
    );
}
