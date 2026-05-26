interface AdminPlaceholderProps {
    title: string;
    description?: string;
}

export default function AdminPlaceholder({ title, description }: AdminPlaceholderProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h1 className="text-2xl font-extrabold text-gray-900">{title}</h1>
            <p className="text-gray-500 mt-2 text-sm">
                {description ?? 'This section is coming soon. Use the sidebar to return to active admin tools.'}
            </p>
        </div>
    );
}
