import React from 'react';
import { X } from 'lucide-react';

export default function Chip({ label, onRemove, variant = 'sage' }) {
    const variantStyles = {
        sage: 'bg-sage-50 text-sage-700 border-sage-200/60',
        terracotta: 'bg-terracotta-50 text-terracotta-600 border-terracotta-200/60',
        cream: 'bg-cream-100 text-charcoal-600 border-cream-300/60',
    };

    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all duration-150 animate-fade-in ${
                variantStyles[variant] || variantStyles.sage
            }`}
        >
            <span>{label}</span>
            {onRemove && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="p-0.5 -mr-0.5 rounded hover:bg-charcoal-900/10 transition-colors focus:outline-none"
                    aria-label={`Hapus ${label}`}
                >
                    <X className="w-3 h-3" strokeWidth={2.5} />
                </button>
            )}
        </span>
    );
}
