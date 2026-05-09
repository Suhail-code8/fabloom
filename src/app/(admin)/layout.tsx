import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

// ============================================================================
// ADMIN LAYOUT SHELL (SERVER COMPONENT)
// Desktop-first flex layout with strict auth guards
// ============================================================================

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const { userId } = await auth();
    const user = await currentUser();

    // STRICT AUTH GUARD:
    // Only allow users with publicMetadata.role === 'admin'
    // Ensure you set this up in your Clerk dashboard or via Webhook
    if (!userId || user?.publicMetadata?.role !== 'admin') {
        redirect('/unauthorized'); // Redirect to a safe page if not an admin
    }

    // Extract user details for the sidebar footer
    const adminName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Admin User';
    const adminEmail = user?.emailAddresses[0]?.emailAddress || '';
    const adminAvatar = user?.imageUrl || '';

    return (
        <div className="flex h-screen w-full bg-gray-50 overflow-hidden text-gray-900 font-sans">
            {/* Fixed Left Sidebar */}
            <AdminSidebar name={adminName} email={adminEmail} avatar={adminAvatar} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Top Header */}
                <AdminHeader />

                {/* Scrollable Page Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
