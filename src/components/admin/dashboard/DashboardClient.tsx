'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// ============================================================================
// HELPERS & ICONS
// ============================================================================
function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHrs < 24) return `${diffHrs} hr ago`;
    return `${diffDays} days ago`;
}

const ICONS = {
    order: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
    user: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    warning: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
};

const PIE_COLORS = ['#0f1035', '#D4A853', '#3b82f6', '#10b981'];

// ============================================================================
// COMPONENT
// ============================================================================
export default function DashboardClient() {
    const { data, error } = useSWR('/api/admin/analytics', fetcher, { refreshInterval: 60000 });

    if (error) return <div className="p-8 text-red-500">Failed to load analytics dashboard.</div>;
    if (!data) return (
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const { metrics, charts, activityFeed } = data;

    return (
        <div className="flex flex-col gap-6">
            <div className="mb-2">
                <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">Dashboard Overview</h1>
                <p className="text-sm font-medium text-gray-500 mt-1">Instant operational clarity across Fabloom.</p>
            </div>

            {/* METRICS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Revenue */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Today's Revenue</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${metrics.revenueTrend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {metrics.revenueTrend >= 0 ? '+' : ''}{metrics.revenueTrend}%
                        </span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">₹{metrics.todayRevenue.toLocaleString('en-IN')}</h2>
                </div>

                {/* Orders */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Orders Today</p>
                    <div className="flex items-end gap-3">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{metrics.ordersToday}</h2>
                        <p className="text-[10px] font-bold text-gray-400 mb-1 leading-snug">
                            {metrics.stitchingToday} stitching<br/>
                            {metrics.readymadeToday} readymade
                        </p>
                    </div>
                </div>

                {/* Pending Stitching */}
                <div className={`p-5 rounded-2xl border shadow-sm flex flex-col gap-3 transition-colors ${metrics.pendingStitchingCount > 5 ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
                    <p className={`text-xs font-bold uppercase tracking-wider ${metrics.pendingStitchingCount > 5 ? 'text-amber-700' : 'text-gray-500'}`}>Pending Stitching</p>
                    <h2 className={`text-3xl font-extrabold tracking-tight ${metrics.pendingStitchingCount > 5 ? 'text-amber-900' : 'text-gray-900'}`}>
                        {metrics.pendingStitchingCount}
                    </h2>
                </div>

                {/* Low Stock */}
                <div className={`p-5 rounded-2xl border shadow-sm flex flex-col gap-3 transition-colors ${metrics.lowStockCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
                    <p className={`text-xs font-bold uppercase tracking-wider ${metrics.lowStockCount > 0 ? 'text-red-700' : 'text-gray-500'}`}>Low Stock Alerts</p>
                    <h2 className={`text-3xl font-extrabold tracking-tight ${metrics.lowStockCount > 0 ? 'text-red-900' : 'text-gray-900'}`}>
                        {metrics.lowStockCount}
                    </h2>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT COL: Charts */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    
                    {/* Revenue Area Chart */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-extrabold text-gray-900 mb-6">Revenue Trend (7 Days)</h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={charts.revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorStitching" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4A853" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#D4A853" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorReadymade" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0f1035" stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor="#0f1035" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 700 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 700 }} tickFormatter={(val) => `₹${val}`} />
                                    <RechartsTooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 700 }}
                                        itemStyle={{ color: '#0f1035' }}
                                        formatter={(value: any) => `₹${value?.toLocaleString('en-IN') || 0}`}
                                    />
                                    <Area type="monotone" dataKey="readymade" name="Readymade" stroke="#0f1035" strokeWidth={2} fillOpacity={1} fill="url(#colorReadymade)" />
                                    <Area type="monotone" dataKey="stitching" name="Stitching" stroke="#D4A853" strokeWidth={2} fillOpacity={1} fill="url(#colorStitching)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Order Type Donut */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                            <h3 className="text-sm font-extrabold text-gray-900 mb-2">Orders by Type</h3>
                            <div className="flex-1 min-h-[200px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={charts.ordersByType} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                                            {charts.ordersByType.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 700 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-wrap gap-3 justify-center mt-2">
                                {charts.ordersByType.map((entry: any, index: number) => (
                                    <div key={entry.name} className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                                        <span className="text-[10px] font-bold text-gray-500">{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pipeline Bar Chart */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-extrabold text-gray-900 mb-4">Production Pipeline</h3>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={charts.pipelineData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: 700 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 700 }} />
                                        <RechartsTooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 700 }} />
                                        <Bar dataKey="orders" name="Orders" fill="#D4A853" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COL: Feed & Links */}
                <div className="flex flex-col gap-6">
                    
                    {/* Quick Links */}
                    <div className="bg-[#0f1035] rounded-2xl p-5 shadow-sm text-white">
                        <h3 className="text-sm font-extrabold mb-4 opacity-90">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link href="/admin/production" className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors group">
                                <span className="text-xs font-bold">Stitching Production</span>
                                <svg className="w-4 h-4 text-[#D4A853] group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="9 18 15 12 9 6"/></svg>
                            </Link>
                            <Link href="/admin/inventory" className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors group">
                                <span className="text-xs font-bold">Inventory & Add Product</span>
                                <svg className="w-4 h-4 text-[#D4A853] group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="9 18 15 12 9 6"/></svg>
                            </Link>
                        </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex-1">
                        <h3 className="text-sm font-extrabold text-gray-900 mb-6">Recent Activity</h3>
                        <div className="space-y-5 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                            {activityFeed.map((event: any, i: number) => (
                                <div key={event.id} className="relative flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 shadow-sm z-10 flex-shrink-0 mt-0.5">
                                            {ICONS[event.type as keyof typeof ICONS] || ICONS.order}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-900 truncate">{event.title}</p>
                                            <p className="text-[10px] text-gray-500 mt-0.5 truncate">{event.desc}</p>
                                        </div>
                                    </div>
                                    <div className="text-[9px] font-bold text-gray-400 whitespace-nowrap pt-1">
                                        {formatTimeAgo(event.timestamp)}
                                    </div>
                                </div>
                            ))}
                            {activityFeed.length === 0 && (
                                <p className="text-xs text-gray-500 font-medium text-center py-4">No recent activity found.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
