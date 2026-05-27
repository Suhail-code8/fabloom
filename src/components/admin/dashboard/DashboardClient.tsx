'use client';

import useSWR from 'swr';
import Link from 'next/link';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const EMPTY = {
    metrics: { revenue: 0, totalOrders: 0, pendingStitching: 0, lowStock: 0 },
    revenueByDay: [] as { date: string; amount: number }[],
    ordersByType: [] as { name: string; value: number }[],
    recentOrders: [] as {
        orderNumber: string;
        customerName: string;
        total: number;
        status: string;
    }[],
};

const PIE_COLORS = ['#0f1035', '#D4A853', '#3b82f6', '#10b981'];

async function fetcher(url: string) {
    try {
        const res = await fetch(url, { credentials: 'include' });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) return EMPTY;
        return {
            metrics: json.metrics ?? EMPTY.metrics,
            revenueByDay: json.revenueByDay ?? EMPTY.revenueByDay,
            ordersByType: json.ordersByType ?? EMPTY.ordersByType,
            recentOrders: json.recentOrders ?? EMPTY.recentOrders,
        };
    } catch {
        return EMPTY;
    }
}

function formatDay(dateStr: string) {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', { weekday: 'short' });
}

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

export default function DashboardClient() {
    const { data, isLoading } = useSWR('/api/admin/analytics', fetcher, {
        refreshInterval: 60000,
    });

    if (isLoading && !data) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const { metrics, revenueByDay, ordersByType, recentOrders } = data ?? EMPTY;
    const chartData = revenueByDay.map((d: { date: string; amount: number }) => ({
        ...d,
        label: formatDay(d.date),
    }));
    const hasRevenue = chartData.some((d: { amount: number }) => d.amount > 0);
    const hasPie = ordersByType.some((e: { value: number }) => e.value > 0);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Store overview at a glance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Today's Revenue", value: `₹${metrics.revenue.toLocaleString('en-IN')}` },
                    { label: 'Total Orders', value: metrics.totalOrders },
                    { label: 'Pending Stitching', value: metrics.pendingStitching, warn: metrics.pendingStitching > 0 },
                    { label: 'Low Stock', value: metrics.lowStock, warn: metrics.lowStock > 0 },
                ].map((card) => (
                    <div
                        key={card.label}
                        className={`p-5 rounded-2xl border shadow-sm ${
                            card.warn ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'
                        }`}
                    >
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{card.label}</p>
                        <p className="text-3xl font-extrabold text-gray-900 mt-2">{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-extrabold text-gray-900 mb-4">Revenue (Last 7 Days)</h3>
                    <div className="h-[260px]">
                        {hasRevenue ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4A853" stopOpacity={0.35} />
                                            <stop offset="95%" stopColor="#D4A853" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={(v) => `₹${v}`} />
                                    <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} />
                                    <Area type="monotone" dataKey="amount" stroke="#D4A853" strokeWidth={2} fill="url(#revGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-sm text-gray-400">No data yet</div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-extrabold text-gray-900 mb-4">Orders by Type</h3>
                    <div className="h-[220px]">
                        {hasPie ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={ordersByType} innerRadius={55} outerRadius={75} dataKey="value" stroke="none">
                                        {ordersByType.map((_: { name: string; value: number }, i: number) => (
                                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-sm text-gray-400">No data yet</div>
                        )}
                    </div>
                    {hasPie && (
                        <div className="flex flex-wrap gap-2 justify-center mt-2">
                            {ordersByType.map((e: { name: string; value: number }, i: number) => (
                                <div key={e.name} className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                                    {e.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-gray-900">Recent Orders</h3>
                    <Link href="/admin/orders" className="text-xs font-bold text-[#D4A853] hover:underline">
                        View all
                    </Link>
                </div>
                {recentOrders.length === 0 ? (
                    <p className="p-8 text-center text-sm text-gray-400">No orders yet</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase">
                                <th className="text-left p-4">Order #</th>
                                <th className="text-left p-4">Customer</th>
                                <th className="text-left p-4">Total</th>
                                <th className="text-left p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentOrders.map((o: { orderNumber: string; customerName: string; total: number; status: string }) => (
                                <tr key={o.orderNumber} className="hover:bg-gray-50">
                                    <td className="p-4 font-bold text-gray-900">{o.orderNumber}</td>
                                    <td className="p-4 text-gray-600">{o.customerName}</td>
                                    <td className="p-4 font-semibold">₹{o.total.toLocaleString('en-IN')}</td>
                                    <td className="p-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-700'}`}>
                                            {o.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
