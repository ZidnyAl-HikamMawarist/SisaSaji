import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    Wrench,
    PlusCircle,
    Check,
    Copy,
    BookOpen,
    ArrowRight,
    ArrowLeft,
    Utensils,
    Flame,
    Clock,
    Lightbulb,
} from 'lucide-react';
import Chip from './Chip';

export default function RecipeResult({
    recipe,
    usedBahan = [],
    usedBumbu = [],
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

    const getStepData = (step, idx) => {
        if (typeof step === 'string') {
            return {
                nomor: idx + 1,
                instruksi: step,
                durasi: null,
                api: null,
                keterangan: null,
            };
        }
        return {
            nomor: step.nomor || idx + 1,
            instruksi: step.instruksi || step.text || step.step || '',
            durasi: step.durasi || null,
            api: step.api || null,
            keterangan: step.keterangan || step.tips || null,
        };
    };

    const getFlameBadge = (apiStr) => {
        if (!apiStr) return null;
        const lower = apiStr.toLowerCase();
        if (lower.includes('besar') || lower.includes('tinggi')) {
            return {
                color: 'bg-terracotta-50 text-terracotta-700 border-terracotta-200/80',
                iconColor: 'text-terracotta-500',
            };
        }
        if (lower.includes('kecil')) {
            return {
                color: 'bg-sky-50 text-sky-700 border-sky-200/80',
                iconColor: 'text-sky-500',
            };
        }
        if (lower.includes('tanpa') || lower.includes('mati') || lower.includes('padam')) {
            return {
                color: 'bg-cream-200/70 text-charcoal-600 border-cream-300',
                iconColor: 'text-charcoal-400',
            };
        }
        // Default Api Sedang / lainnya
        return {
            color: 'bg-amber-50 text-amber-800 border-amber-200/80',
            iconColor: 'text-amber-500',
        };
    };

    const handleCopy = () => {
        const stepsFormatted = (recipe.langkah_memasak || []).map((step, i) => {
            const data = getStepData(step, i);
            const meta = [];
            if (data.api) meta.push(`🔥 Api: ${data.api}`);
            if (data.durasi) meta.push(`⏱️ Waktu: ${data.durasi}`);
            const metaStr = meta.length > 0 ? ` [${meta.join(' | ')}]` : '';
            const tipsStr = data.keterangan ? `\n   💡 Tips: ${data.keterangan}` : '';
            return `${i + 1}. ${data.instruksi}${metaStr}${tipsStr}`;
        }).join('\n\n');

        const text = `${recipe.nama_resep} (Dibuat via SisaSaji)

Bahan yang Digunakan:
${usedBahan.concat(usedBumbu).map((b) => `- ${b}`).join('\n')}

Alat Masak yang Disarankan:
${(recipe.alat_masak || []).map((a) => `- ${a}`).join('\n')}

Bahan Tambahan Opsional:
${(recipe.bahan_tambahan_opsional || []).map((b) => `- ${b}`).join('\n')}

Langkah-Langkah Memasak:
${stepsFormatted}
`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const totalSteps = recipe.langkah_memasak?.length || 0;
    const completedCount = Object.values(completedSteps).filter(Boolean).length;
    const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

    return (
        <div className="w-full max-w-3xl mx-auto my-4 sm:my-8 animate-fade-in space-y-5">
            {/* Top Navigation Back to Home */}
            <div className="flex items-center justify-between gap-3">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 bg-white/80 hover:bg-white border border-cream-200/90 hover:border-charcoal-300 transition-all duration-200 active:scale-[0.97] shadow-soft-xs"
                >
                    <ArrowLeft className="w-3.5 h-3.5 text-charcoal-500" strokeWidth={2.5} />
                    <span>Kembali ke Beranda</span>
                </Link>

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
                            <Check className="w-3.5 h-3.5 text-sage-600" strokeWidth={2.5} />
                            <span>Tersalin</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5 text-charcoal-500" strokeWidth={2} />
                            <span>Salin Resep</span>
                        </>
                    )}
                </button>
            </div>

            {/* Recipe Header */}
            <div className="space-y-2 pt-1">
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
                    <div className="space-y-1">
                        <h3 className="text-base font-bold font-display text-charcoal-900 flex items-center gap-2">
                            <BookOpen className="w-4.5 h-4.5 text-terracotta-500" strokeWidth={2} />
                            Langkah Memasak
                        </h3>
                        <p className="text-xs text-charcoal-400">
                            Klik pada langkah yang telah selesai untuk menandai progres memasak.
                        </p>
                    </div>

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

                <div className="space-y-3">
                    {recipe.langkah_memasak && recipe.langkah_memasak.length > 0 ? (
                        recipe.langkah_memasak.map((step, idx) => {
                            const data = getStepData(step, idx);
                            const isDone = !!completedSteps[idx];
                            const flameInfo = getFlameBadge(data.api);

                            return (
                                <div
                                    key={idx}
                                    onClick={() => toggleStep(idx)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && toggleStep(idx)}
                                    className={`group p-4 rounded-2xl border cursor-pointer flex items-start gap-3.5 transition-all duration-200 ${
                                        isDone
                                            ? 'bg-sage-50/40 border-sage-200/50 shadow-none'
                                            : 'bg-white/70 border-cream-200/70 hover:border-charcoal-300/80 hover:bg-white shadow-soft-xs'
                                    }`}
                                >
                                    {/* Number / Checkbox indicator */}
                                    <div
                                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 transition-all duration-200 mt-0.5 ${
                                            isDone
                                                ? 'bg-sage-500 text-white shadow-soft-xs'
                                                : 'bg-cream-200/80 text-charcoal-600 group-hover:bg-charcoal-100 group-hover:text-charcoal-900'
                                        }`}
                                    >
                                        {isDone ? <Check className="w-4 h-4" strokeWidth={2.5} /> : data.nomor}
                                    </div>

                                    {/* Main Step Content */}
                                    <div className="flex-1 space-y-2">
                                        {/* Instruction Text */}
                                        <p className={`text-sm leading-relaxed transition-colors duration-200 font-medium ${
                                            isDone ? 'text-charcoal-400 line-through' : 'text-charcoal-800'
                                        }`}>
                                            {data.instruksi}
                                        </p>

                                        {/* Metadata Badges: Api & Durasi */}
                                        {(data.api || data.durasi) && (
                                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                                {/* Flame / Api Badge */}
                                                {data.api && flameInfo && (
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${flameInfo.color} ${isDone ? 'opacity-50' : ''}`}>
                                                        <Flame className={`w-3.5 h-3.5 ${flameInfo.iconColor}`} strokeWidth={2.5} />
                                                        <span>{data.api}</span>
                                                    </span>
                                                )}

                                                {/* Duration / Waktu Badge */}
                                                {data.durasi && (
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-cream-100/90 text-charcoal-700 border border-cream-300 ${isDone ? 'opacity-50' : ''}`}>
                                                        <Clock className="w-3.5 h-3.5 text-charcoal-500" strokeWidth={2} />
                                                        <span>{data.durasi}</span>
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Keterangan / Tips Koki Callout */}
                                        {data.keterangan && (
                                            <div className={`mt-2 p-2.5 rounded-xl text-xs leading-relaxed flex items-start gap-2 border transition-colors ${
                                                isDone
                                                    ? 'bg-sage-100/30 border-sage-200/40 text-charcoal-400'
                                                    : 'bg-amber-50/70 border-amber-200/60 text-amber-900/90'
                                            }`}>
                                                <Lightbulb className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isDone ? 'text-charcoal-400' : 'text-amber-600'}`} strokeWidth={2.5} />
                                                <div className="flex-1">
                                                    <span className="font-bold">{isDone ? 'Catatan: ' : 'Tips: '}</span>
                                                    <span>{data.keterangan}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-sm text-charcoal-400 italic text-center py-4">Langkah memasak tidak tersedia.</p>
                    )}
                </div>
            </div>

            {/* Bottom Actions — Clean & Focused */}
            <div className="flex items-center justify-end pt-2">
                <button
                    type="button"
                    onClick={onOpenModal}
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-sm font-semibold shadow-soft-sm transition-all duration-200 active:scale-[0.97]"
                >
                    <span>Ubah Bahan & Cari Resep Lain</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
                </button>
            </div>
        </div>
    );
}
