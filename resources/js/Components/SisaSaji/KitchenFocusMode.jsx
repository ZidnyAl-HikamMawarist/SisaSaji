import React, { useState, useEffect } from 'react';
import {
    X,
    ChevronLeft,
    ChevronRight,
    Check,
    Flame,
    Clock,
    Lightbulb,
    ChefHat,
    Sparkles,
    PartyPopper,
} from 'lucide-react';
import StepTimer from './StepTimer';

export default function KitchenFocusMode({
    isOpen,
    onClose,
    recipe,
    completedSteps = {},
    onToggleStep,
}) {
    const [currentStepIdx, setCurrentStepIdx] = useState(0);

    const steps = recipe?.langkah_memasak || [];
    const totalSteps = steps.length;

    // Reset or bound current index on open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Handle Keyboard shortcuts (ArrowLeft, ArrowRight, ESC)
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowRight' && currentStepIdx < totalSteps - 1) {
                setCurrentStepIdx((prev) => prev + 1);
            } else if (e.key === 'ArrowLeft' && currentStepIdx > 0) {
                setCurrentStepIdx((prev) => prev - 1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentStepIdx, totalSteps, onClose]);

    if (!isOpen || !recipe || totalSteps === 0) return null;

    const currentStep = steps[currentStepIdx];
    const stepData = typeof currentStep === 'string'
        ? { nomor: currentStepIdx + 1, instruksi: currentStep, durasi: null, api: null, keterangan: null }
        : {
            nomor: currentStep.nomor || currentStepIdx + 1,
            instruksi: currentStep.instruksi || currentStep.text || currentStep.step || '',
            durasi: currentStep.durasi || null,
            api: currentStep.api || null,
            keterangan: currentStep.keterangan || currentStep.tips || null,
        };

    const isCurrentDone = !!completedSteps[currentStepIdx];
    const completedCount = Object.values(completedSteps).filter(Boolean).length;
    const progressPercent = Math.round((completedCount / totalSteps) * 100);

    const getFlameBadge = (apiStr) => {
        if (!apiStr) return null;
        const lower = apiStr.toLowerCase();
        if (lower.includes('besar') || lower.includes('tinggi')) {
            return {
                color: 'bg-terracotta-500 text-white',
                label: apiStr,
            };
        }
        if (lower.includes('kecil')) {
            return {
                color: 'bg-sky-500 text-white',
                label: apiStr,
            };
        }
        if (lower.includes('tanpa') || lower.includes('mati') || lower.includes('padam')) {
            return {
                color: 'bg-charcoal-700 text-white',
                label: apiStr,
            };
        }
        return {
            color: 'bg-amber-500 text-white',
            label: apiStr,
        };
    };

    const flameBadge = getFlameBadge(stepData.api);

    return (
        <div className="fixed inset-0 z-50 bg-charcoal-950/90 backdrop-blur-md flex flex-col justify-between text-charcoal-100 p-4 sm:p-6 lg:p-8 animate-fade-in select-none">
            {/* Top Bar */}
            <div className="w-full max-w-4xl mx-auto flex items-center justify-between gap-4 pb-4 border-b border-charcoal-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-terracotta-500 text-white flex items-center justify-center shadow-terracotta-glow flex-shrink-0">
                        <ChefHat className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                        <div className="text-[11px] font-bold text-terracotta-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" />
                            Mode Fokus Masak
                        </div>
                        <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
                            {recipe.nama_resep}
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Progress indicator */}
                    <div className="hidden sm:flex items-center gap-2">
                        <span className="text-xs text-charcoal-400 font-semibold tabular-nums">
                            {completedCount}/{totalSteps} Selesai
                        </span>
                        <div className="w-20 h-2 bg-charcoal-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-sage-500 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-charcoal-800/80 hover:bg-charcoal-700 text-charcoal-300 hover:text-white text-xs font-semibold border border-charcoal-700 transition-all active:scale-95"
                    >
                        <X className="w-4 h-4" />
                        <span className="hidden sm:inline">Tutup (ESC)</span>
                    </button>
                </div>
            </div>

            {/* Main Stage Content */}
            <main className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center py-6 sm:py-10">
                <div className="space-y-6">
                    {/* Step indicator header */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-charcoal-900 border border-charcoal-700/80 text-xs font-bold text-charcoal-300">
                            <span>Langkah</span>
                            <span className="text-terracotta-400 text-sm font-extrabold">{currentStepIdx + 1}</span>
                            <span className="text-charcoal-500">dari {totalSteps}</span>
                        </div>

                        {/* Flame & Duration Badges */}
                        <div className="flex items-center gap-2">
                            {stepData.api && flameBadge && (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold shadow-sm ${flameBadge.color}`}>
                                    <Flame className="w-3.5 h-3.5" />
                                    <span>{flameBadge.label}</span>
                                </span>
                            )}
                            {stepData.durasi && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-charcoal-800 text-amber-300 border border-charcoal-700">
                                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                                    <span>{stepData.durasi}</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Step Instruction Card — Extra Large font */}
                    <div className="bg-charcoal-900/90 border border-charcoal-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
                        <p className={`text-xl sm:text-3xl font-display font-medium leading-relaxed transition-all ${
                            isCurrentDone ? 'text-charcoal-500 line-through' : 'text-white'
                        }`}>
                            {stepData.instruksi}
                        </p>

                        {/* Keterangan / Tips Callout */}
                        {stepData.keterangan && (
                            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-sm sm:text-base leading-relaxed flex items-start gap-3">
                                <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <span className="font-bold text-amber-300">Tips Koki: </span>
                                    <span>{stepData.keterangan}</span>
                                </div>
                            </div>
                        )}

                        {/* Timer area if duration exists */}
                        {stepData.durasi && (
                            <div className="pt-2">
                                <StepTimer
                                    durationStr={stepData.durasi}
                                    stepTitle={`Langkah ${currentStepIdx + 1}`}
                                />
                            </div>
                        )}

                        {/* Big Done Button toggle */}
                        <div className="pt-2 flex items-center justify-between border-t border-charcoal-800">
                            <button
                                type="button"
                                onClick={() => onToggleStep(currentStepIdx)}
                                className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                                    isCurrentDone
                                        ? 'bg-sage-600 hover:bg-sage-500 text-white shadow-soft-sm'
                                        : 'bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 border border-charcoal-700'
                                }`}
                            >
                                <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                                    isCurrentDone ? 'bg-white text-sage-600 border-white' : 'border-charcoal-500'
                                }`}>
                                    {isCurrentDone && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                                </div>
                                <span>{isCurrentDone ? 'Langkah Ini Selesai' : 'Tandai Langkah Selesai'}</span>
                            </button>

                            <div className="flex items-center gap-1.5">
                                {steps.map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setCurrentStepIdx(i)}
                                        className={`h-2.5 rounded-full transition-all duration-300 ${
                                            i === currentStepIdx
                                                ? 'w-8 bg-terracotta-500'
                                                : completedSteps[i]
                                                ? 'w-2.5 bg-sage-500'
                                                : 'w-2.5 bg-charcoal-800 hover:bg-charcoal-700'
                                        }`}
                                        title={`Buka Langkah ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Navigation */}
            <div className="w-full max-w-4xl mx-auto flex items-center justify-between gap-4 pt-4 border-t border-charcoal-800">
                <button
                    type="button"
                    disabled={currentStepIdx === 0}
                    onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                        currentStepIdx === 0
                            ? 'opacity-40 cursor-not-allowed text-charcoal-600'
                            : 'bg-charcoal-800 hover:bg-charcoal-700 text-white border border-charcoal-700'
                    }`}
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                </button>

                {currentStepIdx < totalSteps - 1 ? (
                    <button
                        type="button"
                        onClick={() => setCurrentStepIdx((prev) => prev + 1)}
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-sm shadow-terracotta-glow transition-all active:scale-95"
                    >
                        <span>Langkah Selanjutnya</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-sage-600 hover:bg-sage-500 text-white font-bold text-sm shadow-lg transition-all active:scale-95 animate-gentle-pulse"
                    >
                        <PartyPopper className="w-4 h-4" />
                        <span>Selesai Memasak!</span>
                    </button>
                )}
            </div>
        </div>
    );
}
