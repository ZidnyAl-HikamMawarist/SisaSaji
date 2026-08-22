import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
    useEffect(() => {
        if (toast?.show) {
            const timer = setTimeout(() => {
                onClose();
            }, toast.duration || 3500);
            return () => clearTimeout(timer);
        }
    }, [toast, onClose]);

    if (!toast?.show) return null;

    const typeConfig = {
        warning: {
            bg: 'bg-white border-charcoal-200',
            icon: <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" strokeWidth={2} />,
            accent: 'bg-amber-500',
        },
        error: {
            bg: 'bg-white border-red-200',
            icon: <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" strokeWidth={2} />,
            accent: 'bg-red-500',
        },
        success: {
            bg: 'bg-white border-sage-200',
            icon: <CheckCircle2 className="w-4 h-4 text-sage-600 flex-shrink-0" strokeWidth={2} />,
            accent: 'bg-sage-500',
        },
        info: {
            bg: 'bg-white border-charcoal-200',
            icon: <Info className="w-4 h-4 text-charcoal-500 flex-shrink-0" strokeWidth={2} />,
            accent: 'bg-charcoal-400',
        },
    };

    const config = typeConfig[toast.type] || typeConfig.info;

    return (
        <div className="fixed top-5 right-5 z-50 max-w-xs w-full animate-bounce-in">
            <div
                className={`relative flex items-start gap-2.5 p-3.5 rounded-xl border shadow-soft-md overflow-hidden ${config.bg}`}
            >
                {/* Left accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${config.accent}`} />

                {config.icon}
                <div className="flex-1 text-xs font-medium text-charcoal-700 leading-relaxed">
                    {toast.message}
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="p-0.5 rounded text-charcoal-300 hover:text-charcoal-600 transition-colors"
                    aria-label="Tutup notifikasi"
                >
                    <X className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
            </div>
        </div>
    );
}
