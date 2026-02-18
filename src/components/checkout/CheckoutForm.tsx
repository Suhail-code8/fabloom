'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    shippingAddressSchema,
    ShippingAddress,
    shippingFieldHelp,
} from '@/lib/validations/order';

interface CheckoutFormProps {
    onSubmit: (data: ShippingAddress) => void;
    isLoading?: boolean;
}

export default function CheckoutForm({
    onSubmit,
    isLoading = false,
}: CheckoutFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ShippingAddress>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: {
            country: 'United Arab Emirates',
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <h2 className="text-2xl font-serif font-bold text-navy-900 mb-4">
                    Shipping Information
                </h2>

                <div className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <Label htmlFor="fullName">
                            Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="fullName"
                            {...register('fullName')}
                            placeholder="John Doe"
                            className={errors.fullName ? 'border-red-500' : ''}
                        />
                        <p className="text-xs text-gray-500">{shippingFieldHelp.fullName}</p>
                        {errors.fullName && (
                            <p className="text-xs text-red-500">{errors.fullName.message}</p>
                        )}
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                {...register('email')}
                                placeholder="john@example.com"
                                className={errors.email ? 'border-red-500' : ''}
                            />
                            <p className="text-xs text-gray-500">{shippingFieldHelp.email}</p>
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">
                                Phone <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                {...register('phone')}
                                placeholder="+971 50 123 4567"
                                className={errors.phone ? 'border-red-500' : ''}
                            />
                            <p className="text-xs text-gray-500">{shippingFieldHelp.phone}</p>
                            {errors.phone && (
                                <p className="text-xs text-red-500">{errors.phone.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address">
                            Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="address"
                            {...register('address')}
                            placeholder="Street address, apartment, suite, etc."
                            className={errors.address ? 'border-red-500' : ''}
                        />
                        <p className="text-xs text-gray-500">{shippingFieldHelp.address}</p>
                        {errors.address && (
                            <p className="text-xs text-red-500">{errors.address.message}</p>
                        )}
                    </div>

                    {/* City & Postal Code */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">
                                City <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="city"
                                {...register('city')}
                                placeholder="Dubai"
                                className={errors.city ? 'border-red-500' : ''}
                            />
                            <p className="text-xs text-gray-500">{shippingFieldHelp.city}</p>
                            {errors.city && (
                                <p className="text-xs text-red-500">{errors.city.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="postalCode">
                                Postal Code <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="postalCode"
                                {...register('postalCode')}
                                placeholder="12345"
                                className={errors.postalCode ? 'border-red-500' : ''}
                            />
                            <p className="text-xs text-gray-500">{shippingFieldHelp.postalCode}</p>
                            {errors.postalCode && (
                                <p className="text-xs text-red-500">{errors.postalCode.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                        <Label htmlFor="country">
                            Country <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="country"
                            {...register('country')}
                            placeholder="United Arab Emirates"
                            className={errors.country ? 'border-red-500' : ''}
                        />
                        <p className="text-xs text-gray-500">{shippingFieldHelp.country}</p>
                        {errors.country && (
                            <p className="text-xs text-red-500">{errors.country.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Method */}
            <div className="border-t pt-6">
                <h2 className="text-2xl font-serif font-bold text-navy-900 mb-4">
                    Payment Method
                </h2>

                <RadioGroup defaultValue="cod" className="space-y-3">
                    <div className="flex items-center space-x-3 border rounded-lg p-4 bg-emerald-50 border-emerald-200">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                            <div>
                                <p className="font-semibold text-navy-900">Cash on Delivery</p>
                                <p className="text-sm text-gray-600">
                                    Pay when you receive your order
                                </p>
                            </div>
                        </Label>
                    </div>

                    {/* Future payment methods (disabled for MVP) */}
                    <div className="flex items-center space-x-3 border rounded-lg p-4 opacity-50">
                        <RadioGroupItem value="card" id="card" disabled />
                        <Label htmlFor="card" className="flex-1">
                            <div>
                                <p className="font-semibold text-gray-500">
                                    Credit/Debit Card
                                </p>
                                <p className="text-sm text-gray-400">Coming soon</p>
                            </div>
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
            >
                {isLoading ? 'Processing...' : 'Place Order'}
            </Button>
        </form>
    );
}
