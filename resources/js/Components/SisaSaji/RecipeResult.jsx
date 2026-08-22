import React, { useState } from 'react';
import {
    Wrench,
    PlusCircle,
    Check,
    Copy,
    RotateCcw,
    BookOpen,
    ArrowRight,
    Utensils,
} from 'lucide-react';
import Chip from './Chip';

export default function RecipeResult({
    recipe,
    usedBahan = [],
    usedBumbu = [],
    onReset,
    onOpenModal,
}) {
    const [copied, setCopied] = useState(false);
    const [completedSteps, setCompletedSteps] = useState({});

    if (!recipe) return null;

    const toggleStep = (index) => {
        setCompletedSteps((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handleCopy = () => {
        const text = `${recipe.nama_resep} (Dibuat via SisaSaji)

Bahan yang Digunakan:
${usedBahan.concat(usedBumbu).map((b) => `- ${b}`).join('\n')}

Alat Masak yang Disarankan:
${(recipe.alat_masak || []).map((a) => `- ${a}`).join('\n')}

Bahan Tambahan Opsional:
${(recipe.bahan_tambahan_opsional || []).map((b) => `- ${b}`).join('\n')}

Langkah-Langkah Memasak:
${(recipe.langkah_memasak || []).map((step, i) => `${i + 1}. ${step}`).join('\n')}
`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const totalSteps = recipe.langkah_memasak?.length || 0;
    const completedCount = Object.values(completedSteps).filter(Boolean).length;
    const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

    return (
        <div className="w-full max-w-3xl mx-auto my-6 sm:my-10 animate-fade-in space-y-5">
            {/* Recipe Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sage-50 text-sage-700 text-[11px] font-semibold border border-sage-200/60 tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-sage-400" />
                        Rekomendasi AI SisaSaji
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-charcoal-950 tracking-tight leading-tight">
                        {recipe.nama_resep}
                    </h1>
                </div>

                {/* Copy button */}
                <button
                    type="button"
                    onClick={handleCopy}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 active:scale-[0.97] shadow-soft-xs flex-shrink-0 ${
                        copied
                            ? 'bg-sage-50 border-sage-200 text-sage-700'
                            : 'bg-white/80 border-cream-300 text-charcoal-600 hover:bg-cream-50 hover:border-charcoal-300'
                    }`}
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5" strokeWidth={2} />
                            <span>Tersalin</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" strokeWidth={2} />
                            <span>Salin Resep</span>
                        </>
                    )}
                </button>
            </div>

            {/* Used Ingredients — clean border-left accent */}
            {(usedBahan.length > 0 || usedBumbu.length > 0) && (
                <div className="border-l-2 border-terracotta-300 pl-4 py-2">
                    <div className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Utensils className="w-3 h-3 text-terracotta-400" strokeWidth={2} />
                        Bahan dari Dapurmu
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {usedBahan.map((b, idx) => (
                            <Chip key={`used-b-${idx}`} label={b} variant="sage" />
                        ))}
                        {usedBumbu.map((bm, idx) => (
                            <Chip key={`used-bm-${idx}`} label={bm} variant="terracotta" />
                        ))}
                    </div>
                </div>
            )}

            {/* Two-column info — Alat Masak & Bahan Tambahan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Alat Masak */}
                <div className="glass-card rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-charcoal-800 uppercase tracking-wider flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg bg-cream-200 text-charcoal-600 flex items-center justify-center">
                            <Wrench className="w-3.5 h-3.5" strokeWidth={2} />
                        </div>
                        Alat Masak
                    </h3>
                    <ul className="space-y-1.5">
                        {recipe.alat_masak && recipe.alat_masak.length > 0 ? (
                            recipe.alat_masak.map((alat, i) => (
                                <li key={i} className="text-xs text-charcoal-600 flex items-start gap-2">
                                    <span className="w-1 h-1 rounded-full bg-charcoal-300 mt-1.5 flex-shrink-0" />
                                    <span>{alat}</span>
                                </li>
                            ))
                        ) : (
                            <li className="text-xs text-charcoal-400 italic">Peralatan standar dapur.</li>
                        )}
                    </ul>
                </div>

                {/* Bahan Tambahan */}
                <div className="glass-card rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-charcoal-800 uppercase tracking-wider flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg bg-sage-50 text-sage-600 flex items-center justify-center">
                            <PlusCircle className="w-3.5 h-3.5" strokeWidth={2} />
                        </div>
                        Bahan Tambahan (Opsional)
                    </h3>
                    <ul className="space-y-1.5">
                        {recipe.bahan_tambahan_opsional && recipe.bahan_tambahan_opsional.length > 0 ? (
                            recipe.bahan_tambahan_opsional.map((item, i) => (
                                <li key={i} className="text-xs text-charcoal-600 flex items-start gap-2">
                                    <span className="w-1 h-1 rounded-full bg-sage-400 mt-1.5 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))
                        ) : (
                            <li className="text-xs text-charcoal-400 italic">Tidak ada bahan tambahan wajib.</li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Steps Section — the main event */}
            <div className="glass-card rounded-3xl p-5 sm:p-8">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-bold font-display text-charcoal-900 flex items-center gap-2">
                        <BookOpen className="w-4.5 h-4.5 text-terracotta-500" strokeWidth={2} />
                        Langkah Memasak
                    </h3>

                    {totalSteps > 0 && (
                        <div className="flex items-center gap-2.5">
                            <span className="text-[11px] font-semibold text-charcoal-400 tabular-nums">
                                {completedCount}/{totalSteps}
                            </span>
                            <div className="w-20 h-1.5 bg-cream-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-sage-500 rounded-full transition-all duration-500 ease-out-expo"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    {recipe.langkah_memasak && recipe.langkah_memasak.length > 0 ? (
                        recipe.langkah_memasak.map((step, idx) => {
                            const isDone = !!completedSteps[idx];
                            return (
                                <div
                                    key={idx}
                                    onClick={() => toggleStep(idx)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && toggleStep(idx)}
                                    className={`group p-3.5 rounded-xl border cursor-pointer flex items-start gap-3 transition-all duration-200 ${
                                        isDone
                                            ? 'bg-sage-50/50 border-sage-200/50'
                                            : 'bg-white/60 border-cream-200/60 hover:border-charcoal-200 hover:bg-white/80'
                                    }`}
                                >
                                    <div
                                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-semibold text-[11px] flex-shrink-0 transition-all duration-200 ${
                                            isDone
                                                ? 'bg-sage-500 text-white'
                                                : 'bg-cream-200/80 text-charcoal-500 group-hover:bg-charcoal-100'
                                        }`}
                                    >
                                        {isDone ? <Check className="w-3 h-3" strokeWidth={2.5} /> : idx + 1}
                                    </div>
                                    <p className={`text-sm leading-relaxed flex-1 pt-0.5 transition-colors duration-200 ${
                                        isDone ? 'text-charcoal-400 line-through' : 'text-charcoal-700'
                                    }`}>
                                        {step}
                                    </p>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-sm text-charcoal-400 italic text-center py-4">Langkah memasak tidak tersedia.</p>
                    )}
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-400 hover:text-charcoal-700 transition-colors duration-200"
                >
                    <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>Mulai dari Awal</span>
                </button>

                <button
                    type="button"
                    onClick={onOpenModal}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-sm font-semibold shadow-soft-sm transition-all duration-200 active:scale-[0.97]"
                >
                    <span>Ubah Bahan & Cari Resep Lain</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
                </button>
            </div>
        </div>
    );
}
