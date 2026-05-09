export default function StoreLoading() {
    return (
        <div className="min-h-screen bg-[#0f1035] animate-pulse">
            {/* Header Skeleton */}
            <div className="h-16 bg-white/5 mx-4 mt-4 rounded-xl" />
            
            <div className="flex flex-col gap-8 p-4">
                {/* Hero Skeleton */}
                <div className="h-48 bg-white/5 rounded-2xl" />

                {/* Categories Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="aspect-square bg-white/5 rounded-2xl" />
                    ))}
                </div>

                {/* Product Row Skeleton */}
                <div className="flex flex-col gap-4">
                    <div className="h-6 w-48 bg-white/10 rounded" />
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-48 h-64 bg-white/5 rounded-2xl shrink-0" />
                        ))}
                    </div>
                </div>

                {/* CTA Skeleton */}
                <div className="h-32 bg-white/5 rounded-2xl" />
            </div>
        </div>
    );
}
