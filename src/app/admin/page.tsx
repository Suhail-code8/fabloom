export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-serif font-bold text-navy-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome to Fabloom Admin</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-navy-900 mt-2">--</p>
                    <p className="text-sm text-emerald-600 mt-2">View all orders →</p>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                    <p className="text-sm text-gray-600">Pending Stitching</p>
                    <p className="text-3xl font-bold text-gold-600 mt-2">--</p>
                    <p className="text-sm text-gold-600 mt-2">View stitching orders →</p>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">$--</p>
                    <p className="text-sm text-emerald-600 mt-2">View analytics →</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                        href="/admin/orders"
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <h3 className="font-semibold">Manage Orders</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            View and update order statuses
                        </p>
                    </a>
                    <a
                        href="/admin/orders?filter=stitching"
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <h3 className="font-semibold">Stitching Jobs</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Print tailor job cards
                        </p>
                    </a>
                </div>
            </div>
        </div>
    );
}
