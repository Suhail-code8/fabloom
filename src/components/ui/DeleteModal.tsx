import React from 'react';

interface DeleteModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
    isDeleting?: boolean;
}

export default function DeleteModal({ isOpen, title, message, onCancel, onConfirm, isDeleting }: DeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0f1035]/60 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 text-center mb-2">{title}</h3>
                <p className="text-sm font-medium text-gray-500 text-center mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="flex-1 py-3.5 rounded-xl text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 py-3.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
