import React from 'react';
import { Link } from '@inertiajs/react';
import { ChefHat } from 'lucide-react';

export default function Navbar({ onOpenModal }) {
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


            </div>
        </header>
    );
}
