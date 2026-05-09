import type { Metadata } from 'next';
import OrderListClient from '@/components/account/OrderListClient';

export const metadata: Metadata = {
    title: 'My Orders - Fabloom',
    description: 'View your Fabloom order history.',
};

export default function OrdersPage() {
    return <OrderListClient />;
}
