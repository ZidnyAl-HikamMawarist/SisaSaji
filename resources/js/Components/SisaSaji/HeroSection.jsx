import React from 'react';
import { ArrowRight, Leaf, Timer, BookOpen } from 'lucide-react';

export default function HeroSection({ onOpenModal, bahanUtama = [], bumbuDapur = [] }) {
    const totalTags = bahanUtama.length + bumbuDapur.length;

    return (
        <section className="py-10 sm:py-16 lg:py-20">
            {/* Split layout: Left-aligned text, right whitespace on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
                {/* Left content — takes 3 of 5 columns */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Category tag — subtle, no gradient */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sage-50 border border-sage-200/60 text-sage-700 text-xs font-medium tracking-wide">
                        <Leaf className="w-3.5 h-3.5 text-sage-500" strokeWidth={2} />
                        <span>Kurangi Limbah Pangan, Hemat Pengeluaran</span>
                    </div>

                    {/* Main headline — NO gradient text */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-charcoal-950 tracking-tight leading-[1.15]">
                        Punya Bahan Seadanya?
                        <br />
                        <span className="text-terracotta-500">
                            Biar AI yang Racik Resepnya.
                        </span>
                    </h1>

                    {/* Subtitle — constrained width for optimal reading */}
                    <p className="text-base sm:text-lg text-charcoal-500 max-w-lg leading-relaxed">
                        Maksimalkan bahan makanan dan bumbu yang ada di kosan atau rumahmu. Cukup input, dan AI meracik resep lengkap untukmu.
                    </p>

                    {/* CTA — single solid button, no gradient */}
                    <div className="flex flex-col sm:flex-row items-start gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onOpenModal}
                            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-sm shadow-terracotta-glow hover:shadow-lg transition-all duration-200 active:scale-[0.97]"
                        >
                            <span>{totalTags > 0 ? `Lanjutkan (${totalTags} Bahan)` : 'Mulai Masukkan Bahan'}</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* Right side — visual element on large screens */}
                <div className="hidden lg:flex lg:col-span-2 justify-end pt-4">
                    <div className="w-full max-w-xs space-y-3">
                        {/* Quick stat cards */}
                        <div className="glass-card rounded-2xl p-5 animate-stagger-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-sage-100 text-sage-600 flex items-center justify-center">
                                    <Leaf className="w-4 h-4" strokeWidth={2} />
                                </div>
                                <span className="text-xs font-semibold text-charcoal-700">Zero Waste</span>
                            </div>
                            <p className="text-xs text-charcoal-400 leading-relaxed">
                                Maksimalkan sisa bahan di dapurmu, kurangi makanan terbuang.
                            </p>
                        </div>

                        <div className="glass-card rounded-2xl p-5 animate-stagger-2">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-terracotta-50 text-terracotta-500 flex items-center justify-center">
                                    <Timer className="w-4 h-4" strokeWidth={2} />
                                </div>
                                <span className="text-xs font-semibold text-charcoal-700">Cepat & Praktis</span>
                            </div>
                            <p className="text-xs text-charcoal-400 leading-relaxed">
                                Resep otomatis dari AI dalam hitungan detik.
                            </p>
                        </div>

                        <div className="glass-card rounded-2xl p-5 animate-stagger-3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-cream-200 text-charcoal-600 flex items-center justify-center">
                                    <BookOpen className="w-4 h-4" strokeWidth={2} />
                                </div>
                                <span className="text-xs font-semibold text-charcoal-700">Step-by-Step</span>
                            </div>
                            <p className="text-xs text-charcoal-400 leading-relaxed">
                                Langkah memasak jelas, cocok untuk pemula sekalipun.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile: Horizontal step indicators */}
            <div className="grid grid-cols-3 gap-3 mt-10 lg:hidden">
                <StepCard number="1" title="Cek Bahan" color="sage" />
                <StepCard number="2" title="Input Tag" color="terracotta" />
                <StepCard number="3" title="Resep Jadi" color="charcoal" />
            </div>
        </section>
    );
}

function StepCard({ number, title, color }) {
    const colorMap = {
        sage: 'bg-sage-50 text-sage-600 border-sage-200/50',
        terracotta: 'bg-terracotta-50 text-terracotta-500 border-terracotta-200/50',
        charcoal: 'bg-charcoal-50 text-charcoal-600 border-charcoal-200/50',
    };

    return (
        <div className={`rounded-xl p-3 border text-center ${colorMap[color]}`}>
            <span className="block text-lg font-bold font-display">{number}</span>
            <span className="text-[11px] font-medium tracking-wide">{title}</span>
        </div>
    );
}
