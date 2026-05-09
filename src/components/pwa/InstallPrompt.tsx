'use client';

import { useState, useEffect } from 'react';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // 1. Track page visits in localStorage
        const visits = parseInt(localStorage.getItem('pwa-visits') || '0');
        localStorage.setItem('pwa-visits', (visits + 1).toString());

        // 2. Check if dismissed recently
        const dismissedAt = localStorage.getItem('pwa-dismissed-at');
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const isRecentlyDismissed = dismissedAt && parseInt(dismissedAt) > sevenDaysAgo;

        // 3. Listen for install prompt event
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            
            // Only show if user has visited 3+ pages and hasn't dismissed recently
            if (visits >= 3 && !isRecentlyDismissed) {
                setShowPrompt(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted the PWA install');
        }
        
        setShowPrompt(false);
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        localStorage.setItem('pwa-dismissed-at', Date.now().toString());
        setShowPrompt(false);
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
            <div className="bg-[#0f1035] border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#D4A853] rounded-xl flex items-center justify-center text-2xl">
                        🌸
                    </div>
                    <div>
                        <h3 className="text-white font-bold">Install Fabloom</h3>
                        <p className="text-white/60 text-sm">Add to home screen for a better experience</p>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={handleInstall}
                        className="flex-1 bg-[#D4A853] text-[#0f1035] font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                    >
                        Install
                    </button>
                    <button 
                        onClick={handleDismiss}
                        className="flex-1 bg-white/5 text-white/60 font-bold py-3 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        Not now
                    </button>
                </div>
            </div>
        </div>
    );
}
