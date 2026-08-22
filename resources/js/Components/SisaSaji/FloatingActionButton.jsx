import React from 'react';
import { Plus } from 'lucide-react';

export default function FloatingActionButton({ onClick, totalTags = 0 }) {
    return (
        <div className="fixed bottom-6 right-6 z-40">
            <button
                type="button"
                onClick={onClick}
                className="group relative flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-semibold text-sm shadow-soft-lg transition-all duration-300 hover:shadow-soft-xl active:scale-[0.97]"
                aria-label="Tambah Bahan Masakan"
            >
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-white/15 transition-transform duration-300 group-hover:rotate-90">
                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <span className="font-display tracking-wide text-[13px]">
                    {totalTags > 0 ? `Bahan (${totalTags})` : 'Tambah Bahan'}
                </span>

                {/* Live indicator dot */}
                {totalTags > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta-400 opacity-60" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-terracotta-500 border border-charcoal-900" />
                    </span>
                )}
            </button>
        </div>
    );
}
