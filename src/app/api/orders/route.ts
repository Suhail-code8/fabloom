import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import { shippingAddressSchema } from '@/lib/validations/order';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        // Get authenticated user from Clerk
        const { userId } = await auth();
        if (!userId) {
            console.log('⚠️ Auth failed in API — no userId found. User is a guest or session is missing.');
        } else {
            console.log('✅ Authenticated userId:', userId);
        }

        const body = await request.json();
        const { shippingAddress, cartItems, subtotal, tax, total, paymentMethod, email } = body;

        // Sync user to MongoDB (silent fail — never block the order)
        if (userId) {
            try {
                await User.findOneAndUpdate(
                    { clerkId: userId },
                    {
                        $setOnInsert: {
                            clerkId: userId,
                            email: email || `${userId}@unknown.com`,
                            name: shippingAddress?.fullName || 'Customer',
                            phone: shippingAddress?.phone,
                            role: 'customer',
                            addresses: shippingAddress ? [{
                                fullName: shippingAddress.fullName,
                                phone: shippingAddress.phone,
                                addressLine1: shippingAddress.address,
                                city: shippingAddress.city,
                                state: shippingAddress.city,
                                postalCode: shippingAddress.postalCode,
                                country: shippingAddress.country || 'India',
                                isDefault: true,
                            }] : [],
                        },
                    },
                    { upsert: true, new: true }
                );
                console.log('✅ User synced to MongoDB for clerkId:', userId);
            } catch (userSyncError) {
                // Silent fail — user profile creation should never block an order
                console.error('⚠️ User sync failed (non-blocking):', userSyncError);
            }
        }


        // Validate shipping address
        const validationResult = shippingAddressSchema.safeParse(shippingAddress);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid shipping address',
                    details: validationResult.error.errors,
                },
                { status: 400 }
            );
        }

        // Validate cart items
        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Cart is empty',
                },
                { status: 400 }
            );
        }

        // Map cart items to order items (snapshot current data)
        const orderItems = cartItems.map((item: any) => {
            const baseItem = {
                itemType: item.type,
                productId: item.productId,
                productName: item.name,
                productImage: item.image || '',
            };

            if (item.type === 'readymade') {
                return {
                    ...baseItem,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.price,
                    totalPrice: item.price * item.quantity,
                };
            } else if (item.type === 'fabric') {
                const fabricTotal = item.pricePerMeter * item.meters;
                const stitchingCost = item.stitchingDetails && item.stitchingPrice
                    ? item.stitchingPrice
                    : 0;

                const orderItem: any = {
                    ...baseItem,
                    meters: item.meters,
                    pricePerMeter: item.pricePerMeter,
                    quantity: item.quantity,
                    totalPrice: (fabricTotal + stitchingCost) * item.quantity,
                };

                // Add stitching details if present
                if (item.stitchingDetails) {
                    orderItem.stitchingDetails = {
                        measurements: {
                            neck: item.stitchingDetails.measurements.neck,
                            chest: item.stitchingDetails.measurements.chest,
                            waist: item.stitchingDetails.measurements.waist,
                            shoulder: item.stitchingDetails.measurements.shoulder,
                            sleeveLength: item.stitchingDetails.measurements.sleeveLength,
                            shirtLength: item.stitchingDetails.measurements.shirtLength,
                        },
                        stitchingPrice: item.stitchingPrice || 0,
                        specialInstructions: item.stitchingDetails.notes || '',
                        status: 'pending',
                    };
                }

                return orderItem;
            } else {
                // Accessory
                return {
                    ...baseItem,
                    quantity: item.quantity,
                    price: item.price,
                    totalPrice: item.price * item.quantity,
                };
            }
        });

        // Generate order number
        const count = await Order.countDocuments();
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const orderNumber = `FB${year}${month}${(count + 1).toString().padStart(5, '0')}`;

        // Create order
        const order = new Order({
            orderNumber: orderNumber,
            userId: userId || 'guest', // Clerk userId (string like 'user_xxx') or 'guest'
            items: orderItems,
            shippingAddress: {
                fullName: validationResult.data.fullName,
                phone: validationResult.data.phone,
                addressLine1: validationResult.data.address,
                city: validationResult.data.city,
                state: validationResult.data.city, // Using city as state for now
                postalCode: validationResult.data.postalCode,
                country: validationResult.data.country,
            },
            subtotal: subtotal || 0,
            tax: tax || 0,
            shippingCost: 0, // Free shipping for now
            totalAmount: total || 0,
            paymentMethod: paymentMethod || 'cod',
            status: 'pending',
            paymentStatus: 'pending',
        });

        await order.save();

        return NextResponse.json({
            success: true,
            data: {
                orderId: order._id,
                orderNumber: order.orderNumber,
            },
        });
    } catch (error: any) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create order',
                message: error.message,
            },
            { status: 500 }
        );
    }
}
