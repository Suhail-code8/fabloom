import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export const dynamic = 'force-dynamic';

// ============================================================================
// ADMIN LAYOUT SHELL (SERVER COMPONENT)
// Desktop-first flex layout with strict auth guards
// ============================================================================

// Allowed admin emails — fallback if Clerk publicMetadata.role is not set
const ADMIN_EMAILS = ['muhammedsuhail6444@gmail.com'];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    let userId: string | null = null;
    let user: Awaited<ReturnType<typeof currentUser>> = null;

    try {
        const authResult = await auth();
        userId = authResult.userId;
        user = await currentUser();
    } catch (err) {
        console.error('Admin layout auth error:', err);
        redirect('/unauthorized');
    }

    if (!userId || !user) {
        redirect('/sign-in');
    }

    // AUTH GUARD: check Clerk publicMetadata.role === 'admin'
    // OR allow specific admin emails as fallback
    const userEmail = user.emailAddresses?.[0]?.emailAddress || '';
    const hasAdminRole = user.publicMetadata?.role === 'admin';
    const hasAdminEmail = ADMIN_EMAILS.includes(userEmail);

    if (!hasAdminRole && !hasAdminEmail) {
        redirect('/unauthorized');
    }

    // Extract user details for the sidebar footer
    const adminName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Admin User';
    const adminEmail = userEmail;
    const adminAvatar = user.imageUrl || '';

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
