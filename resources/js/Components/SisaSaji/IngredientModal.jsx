import React, { useEffect, useRef } from 'react';
import { ChefHat, X, Lightbulb, ArrowRight } from 'lucide-react';
import TagInput from './TagInput';

export default function IngredientModal({
    isOpen,
    onClose,
    bahanUtama,
    bumbuDapur,
    onAddBahanUtama,
    onRemoveBahanUtama,
    onAddBumbuDapur,
    onRemoveBumbuDapur,
    onSubmit,
}) {
    const modalRef = useRef(null);

    // Handle ESC key + focus trap
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const quickBahanSuggestions = ['Telur', 'Nasi', 'Tahu', 'Tempe', 'Ayam', 'Mie Instan', 'Kentang', 'Wortel'];
    const quickBumbuSuggestions = ['Bawang Merah', 'Bawang Putih', 'Cabai', 'Kecap Manis', 'Garam', 'Merica', 'Saus Tiram', 'Minyak Goreng'];

    const hasMinBahan = bahanUtama.length >= 1;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-charcoal-950/30 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className="relative w-full max-w-2xl glass-modal rounded-3xl p-6 sm:p-8 z-10 animate-slide-up my-auto"
            >
                {/* Header */}
                <div className="flex items-start justify-between pb-5 border-b border-cream-300/60">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-terracotta-500 text-white flex items-center justify-center shadow-soft-sm">
                            <ChefHat className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <div>
                            <h2 id="modal-title" className="text-lg font-bold font-display text-charcoal-900 leading-snug">
                                Input Bahan Masakan
                            </h2>
                            <p className="text-xs text-charcoal-400 mt-0.5">
                                Masukkan bahan dan bumbu yang ada di dapurmu
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-charcoal-100/50 transition-colors focus:outline-none focus:ring-2 focus:ring-charcoal-300"
                        aria-label="Tutup Modal"
                    >
                        <X className="w-5 h-5" strokeWidth={2} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="py-5 space-y-6">
                    {/* Bahan Utama */}
                    <div>
                        <TagInput
                            label="Bahan Utama"
                            placeholder="Ketik nama bahan lalu tekan Enter..."
                            tags={bahanUtama}
                            onAddTag={onAddBahanUtama}
                            onRemoveTag={onRemoveBahanUtama}
                            maxTags={7}
                            variant="sage"
                            hint="Minimal 1 bahan utama (Maksimal 7)."
                        />

                        {/* Quick suggestions */}
                        <div className="mt-2.5 flex items-center gap-1 flex-wrap">
                            <span className="text-[10px] font-medium text-charcoal-400 flex items-center gap-1 mr-0.5">
                                <Lightbulb className="w-3 h-3 text-charcoal-300" strokeWidth={2} />
                                Cepat:
                            </span>
                            {quickBahanSuggestions.map((item) => {
                                const isAdded = bahanUtama.includes(item);
                                return (
                                    <button
                                        key={item}
                                        type="button"
                                        disabled={isAdded || bahanUtama.length >= 7}
                                        onClick={() => onAddBahanUtama(item)}
                                        className={`text-[10px] px-2 py-0.5 rounded-md border transition-all duration-150 ${
                                            isAdded
                                                ? 'bg-sage-50 text-sage-400 border-sage-200/40 cursor-default line-through'
                                                : 'bg-white/60 text-charcoal-500 border-cream-300/60 hover:border-sage-300 hover:text-sage-700 hover:bg-sage-50 active:scale-[0.97]'
                                        }`}
                                    >
                                        {isAdded ? item : `+ ${item}`}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bumbu Dapur */}
                    <div>
                        <TagInput
                            label="Bumbu Dapur"
                            placeholder="Ketik nama bumbu lalu tekan Enter..."
                            tags={bumbuDapur}
                            onAddTag={onAddBumbuDapur}
                            onRemoveTag={onRemoveBumbuDapur}
                            maxTags={10}
                            variant="terracotta"
                            hint="Opsional tapi sangat membantu (Maksimal 10)."
                        />

                        {/* Quick suggestions */}
                        <div className="mt-2.5 flex items-center gap-1 flex-wrap">
                            <span className="text-[10px] font-medium text-charcoal-400 flex items-center gap-1 mr-0.5">
                                <Lightbulb className="w-3 h-3 text-charcoal-300" strokeWidth={2} />
                                Umum:
                            </span>
                            {quickBumbuSuggestions.map((item) => {
                                const isAdded = bumbuDapur.includes(item);
                                return (
                                    <button
                                        key={item}
                                        type="button"
                                        disabled={isAdded || bumbuDapur.length >= 10}
                                        onClick={() => onAddBumbuDapur(item)}
                                        className={`text-[10px] px-2 py-0.5 rounded-md border transition-all duration-150 ${
                                            isAdded
                                                ? 'bg-terracotta-50 text-terracotta-300 border-terracotta-200/40 cursor-default line-through'
                                                : 'bg-white/60 text-charcoal-500 border-cream-300/60 hover:border-terracotta-300 hover:text-terracotta-600 hover:bg-terracotta-50 active:scale-[0.97]'
                                        }`}
                                    >
                                        {isAdded ? item : `+ ${item}`}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-cream-300/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-charcoal-400 text-center sm:text-left">
                        {!hasMinBahan ? (
                            <span className="text-charcoal-500 font-medium">
                                Tambahkan minimal 1 bahan utama.
                            </span>
                        ) : (
                            <span>
                                <span className="font-semibold text-charcoal-600">{bahanUtama.length} bahan</span>
                                {' & '}
                                <span className="font-semibold text-charcoal-600">{bumbuDapur.length} bumbu</span>
                                {' siap dimasak.'}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-cream-300/80 text-charcoal-600 text-xs font-semibold hover:bg-cream-100 transition-all duration-200 active:scale-[0.97]"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={!hasMinBahan}
                            className={`group w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-soft-sm active:scale-[0.97] ${
                                hasMinBahan
                                    ? 'bg-charcoal-900 text-white hover:bg-charcoal-800 cursor-pointer'
                                    : 'bg-charcoal-100 text-charcoal-400 cursor-not-allowed shadow-none'
                            }`}
                        >
                            <span>Cari Resep</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
