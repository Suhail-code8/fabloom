import type { Metadata } from 'next';
import OrderTrackingClient from '@/components/account/OrderTrackingClient';

export const metadata: Metadata = {
    title: 'Track Order - Fabloom',
    description: 'Live order tracking and stitching progress.',
};

export default async function OrderTrackingPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;
    return <OrderTrackingClient orderId={orderId} />;
}
