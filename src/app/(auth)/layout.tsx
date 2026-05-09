export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0f1035] flex items-center justify-center">
            {children}
        </div>
    );
}
