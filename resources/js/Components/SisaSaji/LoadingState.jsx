import React, { useState, useEffect } from 'react';
import { ChefHat, Flame } from 'lucide-react';

const tips = [
    'Menganalisis kombinasi bahan dan bumbu di dapurmu...',
    'Menghitung proporsi rasa terbaik agar masakan lezat...',
    'Menyusun langkah memasak yang ringkas dan mudah dipahami...',
    'Memilih alat masak minimalis yang cocok untukmu...',
    'Menyiapkan rekomendasi bahan tambahan opsional...',
];

export default function LoadingState() {
    const [currentTipIndex, setCurrentTipIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTipIndex((prev) => (prev + 1) % tips.length);
        }, 2800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-xl mx-auto my-12 animate-fade-in">
            {/* Main loading card */}
            <div className="glass-card rounded-3xl p-8 sm:p-10 text-center">
                {/* Icon with subtle animation */}
                <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    {/* Outer ring — slow spinning */}
                    <div
                        className="absolute inset-0 rounded-full border border-dashed border-charcoal-200/60 animate-gentle-spin"
                    />

                    {/* Icon container */}
                    <div className="relative w-14 h-14 rounded-2xl bg-terracotta-500 text-white flex items-center justify-center shadow-terracotta-glow animate-float">
                        <ChefHat className="w-7 h-7" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold font-display text-charcoal-900 mb-1.5">
                    Sedang Meracik Resep
                </h3>
                <p className="text-sm text-charcoal-400 mb-6">
                    Tunggu sebentar, AI sedang bekerja...
                </p>

                {/* Rotating tip */}
                <div className="h-8 flex items-center justify-center mb-6">
                    <p className="text-xs font-medium text-charcoal-500 flex items-center gap-2 transition-all duration-300">
                        <Flame className="w-3.5 h-3.5 text-terracotta-400 animate-gentle-pulse flex-shrink-0" strokeWidth={2} />
                        <span>{tips[currentTipIndex]}</span>
                    </p>
                </div>

                {/* Skeleton preview — mimics recipe card layout */}
                <div className="space-y-3 mb-6">
                    <div className="skeleton-shimmer h-5 w-3/4 mx-auto" />
                    <div className="skeleton-shimmer h-3 w-full" />
                    <div className="skeleton-shimmer h-3 w-5/6" />
                    <div className="skeleton-shimmer h-3 w-4/6" />
                </div>

                {/* Progress bar — indeterminate */}
                <div className="w-40 h-1 bg-cream-200 rounded-full mx-auto overflow-hidden">
                    <div className="w-1/3 h-full bg-terracotta-400 rounded-full animate-indeterminate" />
                </div>
            </div>
        </div>
    );
}
