import { useState, useEffect } from 'react';

export default function AnnouncementBanner({ announcement, dismissible = true }) {
    const [isVisible, setIsVisible] = useState(true);
    const [dismissedId, setDismissedId] = useState(null);

    useEffect(() => {
        // Check if this announcement has been dismissed
        const dismissed = localStorage.getItem('dismissed_announcement_id');
        if (dismissed) {
            setDismissedId(dismissed);
        }
    }, []);

    if (!announcement || !isVisible || announcement === dismissedId) {
        return null;
    }

    const handleDismiss = () => {
        if (dismissible) {
            localStorage.setItem('dismissed_announcement_id', announcement);
            setIsVisible(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-[#3B68FC] via-indigo-600 to-blue-600 text-white py-3.5 px-6 shadow-lg relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute w-full h-full bg-[url('data:image/svg+xml,...')] animate-pulse"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-bell text-white text-sm"></i>
                    </div>
                    <p className="text-sm font-medium text-white leading-relaxed">
                        {announcement}
                    </p>
                </div>

                {dismissible && (
                    <button
                        onClick={handleDismiss}
                        className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                        aria-label="Dismiss announcement"
                    >
                        <i className="fas fa-times text-white"></i>
                    </button>
                )}
            </div>
        </div>
    );
}
