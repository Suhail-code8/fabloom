'use client';

import useSWR from 'swr';

// ============================================================================
// TYPES
// ============================================================================

interface Customer {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'customer' | 'admin';
    createdAt: string;
}

// ============================================================================
// HELPERS
// ============================================================================

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function RoleBadge({ role }: { role: string }) {
    const isAdmin = role === 'admin';
    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                isAdmin
                    ? 'bg-[#D4A853]/15 text-[#9a7320] border border-[#D4A853]/30'
                    : 'bg-gray-100 text-gray-500 border border-gray-200'
            }`}
        >
            {role}
        </span>
    );
}

function SkeletonRow() {
    return (
        <tr className="border-b border-gray-100">
            {[1, 2, 3, 4, 5].map((i) => (
                <td key={i} className="p-4">
                    <div className="h-4 rounded bg-gray-100 animate-pulse" style={{ width: `${60 + i * 8}%` }} />
                </td>
            ))}
        </tr>
    );
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function CustomersClient() {
    const { data, error } = useSWR<{ success: boolean; count: number; data: Customer[] }>(
        '/api/admin/customers',
        fetcher
    );

    const isLoading = !data && !error;
    const customers: Customer[] = data?.data ?? [];

    return (
        <div className="flex flex-col gap-6">
            {/* ── Page Header ────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-extrabold text-gray-900 leading-tight">Customers</h2>
                    <p className="text-sm font-medium text-gray-500 mt-0.5">
                        {isLoading ? 'Loading…' : `${data?.count ?? 0} registered users`}
                    </p>
                </div>
            </div>

            {/* ── Error State ─────────────────────────────────────────── */}
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 font-medium">
                    Failed to load customers. Please refresh.
                </div>
            )}

            {/* ── Table ───────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Phone</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {/* Loading skeletons */}
                        {isLoading &&
                            Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

                        {/* Data rows */}
                        {!isLoading &&
                            customers.map((customer) => (
                                <tr
                                    key={customer._id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {/* Name */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar initial */}
                                            <div className="w-8 h-8 rounded-full bg-[#0f1035]/10 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs font-extrabold text-[#0f1035]">
                                                    {customer.name?.charAt(0).toUpperCase() ?? '?'}
                                                </span>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {customer.name}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td className="p-4">
                                        <span className="text-sm text-gray-600">{customer.email}</span>
                                    </td>

                                    {/* Phone */}
                                    <td className="p-4">
                                        <span className="text-sm text-gray-500">
                                            {customer.phone ?? '—'}
                                        </span>
                                    </td>

                                    {/* Role */}
                                    <td className="p-4">
                                        <RoleBadge role={customer.role} />
                                    </td>

                                    {/* Joined */}
                                    <td className="p-4">
                                        <span className="text-sm text-gray-500">
                                            {new Date(customer.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                        {/* Empty state */}
                        {!isLoading && !error && customers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-sm text-gray-400">
                                    No customers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
