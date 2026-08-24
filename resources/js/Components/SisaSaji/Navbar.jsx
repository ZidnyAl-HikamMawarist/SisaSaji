import React from 'react';
import { Link } from '@inertiajs/react';
import { ChefHat, Bookmark } from 'lucide-react';

export default function Navbar({ onOpenSavedModal, savedCount = 0 }) {
    return (
        <header className="sticky top-0 z-30 w-full bg-cream-100/80 backdrop-blur-xl border-b border-cream-300/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
                {/* Logo & Brand */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-terracotta-500 text-white flex items-center justify-center shadow-soft-sm transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
                        <ChefHat className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold tracking-tight text-charcoal-900">
                            Sisa<span className="text-terracotta-500">Saji</span>
                        </span>
                        <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-widest text-charcoal-400">
                            AI Recipe
                        </span>
                    </div>
                </Link>

                {/* Right side actions */}
                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={onOpenSavedModal}
                        className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-charcoal-700 bg-white/80 hover:bg-white border border-cream-300 hover:border-amber-400 transition-all duration-200 active:scale-95 shadow-soft-xs"
                        title="Buka Buku Resep Favorit"
                    >
                        <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500/30 group-hover:fill-amber-500 transition-colors" />
                        <span className="hidden sm:inline">Buku Resep</span>
                        {savedCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                                {savedCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
