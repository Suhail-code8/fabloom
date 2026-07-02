'use client';

import useSWR from 'swr';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

// ============================================================================
// TYPES
// ============================================================================

interface AnalyticsMetrics {
    todayRevenue: number;
    totalRevenue: number;
    totalOrders: number;
    pendingStitching: number;
    stitchingJobsTotal: number;
    lowStockCount: number;
}

interface AnalyticsData {
    success: boolean;
    metrics: AnalyticsMetrics;
    revenueByDay: { date: string; amount: number }[];
    ordersByType: { name: string; value: number }[];
    recentOrders: { orderNumber: string; customerName: string; total: number; status: string }[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PIE_COLORS = ['#0f1035', '#D4A853', '#3b82f6', '#10b981', '#f59e0b'];

const EMPTY: AnalyticsData = {
    success: true,
    metrics: {
        todayRevenue: 0,
        totalRevenue: 0,
        totalOrders: 0,
        pendingStitching: 0,
        stitchingJobsTotal: 0,
        lowStockCount: 0,
    },
    revenueByDay: [],
    ordersByType: [],
    recentOrders: [],
};

// ============================================================================
// HELPERS
// ============================================================================

const fetcher = (url: string) =>
    fetch(url, { credentials: 'include' })
        .then((r) => r.json())
        .catch(() => EMPTY);

function formatDay(dateStr: string) {
    const d = new Date(dateStr);
    return Number.isNaN(d.getTime())
        ? dateStr
        : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
}

function formatINR(n: number) {
    return `₹${n.toLocaleString('en-IN')}`;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function MetricCard({
    label,
    value,
    sub,
    warn = false,
}: {
    label: string;
    value: string | number;
    sub?: string;
    warn?: boolean;
}) {
    return (
        <div
            className={`rounded-2xl border p-5 shadow-sm flex flex-col gap-1 ${
                warn ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'
            }`}
        >
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">{label}</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
            <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
            <div className="h-8 w-32 rounded bg-gray-100 animate-pulse" />
        </div>
    );
}

function SkeletonChart({ height = 280 }: { height?: number }) {
    return (
        <div
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm animate-pulse"
            style={{ height }}
        >
            <div className="h-4 w-40 rounded bg-gray-100 mb-6" />
            <div className="h-full max-h-[200px] rounded-xl bg-gray-50" />
        </div>
    );
}

// Custom Tooltip for the Line Chart
function RevenueTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-2 text-sm">
            <p className="text-gray-500 text-[11px] mb-1">{label}</p>
            <p className="font-extrabold text-gray-900">{formatINR(payload[0].value)}</p>
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AnalyticsClient() {
    const { data, error } = useSWR<AnalyticsData>('/api/admin/analytics', fetcher, {
        refreshInterval: 120_000, // refresh every 2 min
    });

    const isLoading = !data && !error;
    const d = data ?? EMPTY;

    // Merge sparse API data into a full 7-day zero-filled series so the line
    // chart always renders all 7 labels even on days with no orders.
    const fullSeries = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const key = date.toISOString().slice(0, 10);
        const match = d.revenueByDay.find((r) => r.date === key);
        return { date: key, amount: match?.amount ?? 0, label: formatDay(key) };
    });

    const hasRevenue = fullSeries.some((s) => s.amount > 0);
    const hasPie = d.ordersByType.some((e) => e.value > 0);

    return (
        <div className="flex flex-col gap-6">
            {/* ── Page Title ────────────────────────────────────────── */}
            <div>
                <h2 className="text-xl font-extrabold text-gray-900 leading-tight">Analytics</h2>
                <p className="text-sm font-medium text-gray-500 mt-0.5">
                    Store performance at a glance
                </p>
            </div>

            {/* ── Error banner ─────────────────────────────────────── */}
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 font-medium">
                    Could not load analytics data. Please refresh.
                </div>
            )}

            {/* ── Top Row — Metric Cards ────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {isLoading ? (
                    <>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </>
                ) : (
                    <>
                        <MetricCard
                            label="Total Revenue"
                            value={formatINR(d.metrics.totalRevenue)}
                            sub="Paid & confirmed orders"
                        />
                        <MetricCard
                            label="Total Orders"
                            value={d.metrics.totalOrders}
                            sub={`Today: ${formatINR(d.metrics.todayRevenue)}`}
                        />
                        <MetricCard
                            label="Stitching Jobs"
                            value={d.metrics.stitchingJobsTotal}
                            sub={`${d.metrics.pendingStitching} pending`}
                            warn={d.metrics.pendingStitching > 0}
                        />
                    </>
                )}
            </div>

            {/* ── Middle Row — Line Chart ───────────────────────────── */}
            {isLoading ? (
                <SkeletonChart height={320} />
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 className="text-sm font-extrabold text-gray-900 mb-5">Revenue — Last 7 Days</h3>
                    <div className="h-[260px]">
                        {hasRevenue ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={fullSeries}
                                    margin={{ top: 4, right: 16, left: -16, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4A853" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#D4A853" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f3f4f6"
                                    />
                                    <XAxis
                                        dataKey="label"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#9ca3af' }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#9ca3af' }}
                                        tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                                        width={48}
                                    />
                                    <Tooltip content={<RevenueTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#D4A853"
                                        strokeWidth={2.5}
                                        dot={{ r: 4, fill: '#D4A853', strokeWidth: 0 }}
                                        activeDot={{ r: 6, fill: '#0f1035', strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <p className="text-sm text-gray-400">No revenue data for the past 7 days</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Bottom Row — Pie Chart + Legend ─────────────────────── */}
            {isLoading ? (
                <SkeletonChart height={300} />
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 className="text-sm font-extrabold text-gray-900 mb-5">Sales by Category</h3>
                    {hasPie ? (
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Donut chart */}
                            <div className="w-full md:w-[300px] h-[220px] flex-shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={d.ordersByType}
                                            innerRadius={65}
                                            outerRadius={90}
                                            dataKey="value"
                                            stroke="none"
                                            paddingAngle={3}
                                        >
                                            {d.ordersByType.map((_, i) => (
                                                <Cell
                                                    key={i}
                                                    fill={PIE_COLORS[i % PIE_COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value, name) => [
                                                `${value} units`,
                                                String(name),
                                            ]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Legend table */}
                            <div className="flex-1 w-full">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-[10px] font-extrabold text-gray-400 uppercase border-b border-gray-100">
                                            <th className="text-left pb-2">Category</th>
                                            <th className="text-right pb-2">Units</th>
                                            <th className="text-right pb-2">Share</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {(() => {
                                            const total = d.ordersByType.reduce(
                                                (s, e) => s + e.value,
                                                0
                                            );
                                            return d.ordersByType.map((entry, i) => (
                                                <tr key={entry.name} className="py-1">
                                                    <td className="py-2">
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                                style={{
                                                                    backgroundColor:
                                                                        PIE_COLORS[i % PIE_COLORS.length],
                                                                }}
                                                            />
                                                            <span className="font-semibold text-gray-800 capitalize">
                                                                {entry.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-2 text-right font-bold text-gray-900">
                                                        {entry.value}
                                                    </td>
                                                    <td className="py-2 text-right text-gray-400 text-xs">
                                                        {total > 0
                                                            ? `${((entry.value / total) * 100).toFixed(1)}%`
                                                            : '—'}
                                                    </td>
                                                </tr>
                                            ));
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="h-48 flex items-center justify-center">
                            <p className="text-sm text-gray-400">No order category data yet</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
