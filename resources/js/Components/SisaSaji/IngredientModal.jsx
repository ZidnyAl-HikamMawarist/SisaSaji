import React, { useEffect, useRef, useState } from 'react';
import { ChefHat, X, Lightbulb, ArrowRight, SlidersHorizontal, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import TagInput from './TagInput';

export default function IngredientModal({
    isOpen,
    onClose,
    bahanUtama = [],
    bumbuDapur = [],
    preferensi = { waktu: 'Semua', pedas: 'Bebas', metode: 'Bebas', alat: 'Semua Alat' },
    onChangePreferensi,
    onAddBahanUtama,
    onRemoveBahanUtama,
    onAddBumbuDapur,
    onRemoveBumbuDapur,
    onSubmit,
}) {
    const modalRef = useRef(null);
    const [showPreferences, setShowPreferences] = useState(false);

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

    const quickBahanSuggestions = ['Telur', 'Nasi', 'Tahu', 'Tempe', 'Ayam', 'Mie Instan', 'Kentang', 'Wortel', 'Cabai'];
    const quickBumbuSuggestions = ['Bawang Merah', 'Bawang Putih', 'Kecap Manis', 'Garam', 'Merica', 'Saus Tiram', 'Gula', 'Ketumbar'];

    const hasMinBahan = bahanUtama.length >= 1;

    const filterOptions = {
        waktu: [
            { label: 'Semua Waktu', value: 'Semua' },
            { label: '⚡ Kilat (< 15 mnt)', value: 'Kilat (< 15 menit)' },
            { label: '🍲 Santai', value: 'Santai' },
        ],
        pedas: [
            { label: 'Bebas', value: 'Bebas' },
            { label: '🌱 Tidak Pedas', value: 'Tidak Pedas' },
            { label: '🌶️ Sedang', value: 'Sedang' },
            { label: '🔥 Pedas Nampol', value: 'Pedas Nampol' },
        ],
        metode: [
            { label: 'Bebas', value: 'Bebas' },
            { label: '🍳 Tumis / Goreng', value: 'Tumis / Goreng' },
            { label: '🥣 Berkuah / Sup', value: 'Berkuah / Sup' },
            { label: '🥟 Kukus / Rebus', value: 'Kukus / Rebus' },
        ],
        alat: [
            { label: 'Semua Alat', value: 'Semua Alat' },
            { label: '🍚 Rice Cooker', value: 'Hanya Rice Cooker' },
            { label: '🍳 1 Wajan/Teflon', value: 'Hanya 1 Wajan/Teflon' },
        ],
    };

    const hasActivePreferences = Object.entries(preferensi || {}).some(
        ([key, val]) => val && val !== 'Semua' && val !== 'Bebas' && val !== 'Semua Alat'
    );

    const handleSelectPref = (category, value) => {
        if (onChangePreferensi) {
            onChangePreferensi({
                ...preferensi,
                [category]: value,
            });
        }
    };

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
                className="relative w-full max-w-2xl glass-modal rounded-3xl p-6 sm:p-8 z-10 animate-slide-up my-auto max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-cream-300/60 flex-shrink-0">
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
                <div className="py-4 space-y-5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
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

                    {/* Expandable Preferences Accordion */}
                    <div className="pt-2 border-t border-cream-200/80">
                        <button
                            type="button"
                            onClick={() => setShowPreferences((prev) => !prev)}
                            className="w-full flex items-center justify-between p-3 rounded-2xl bg-cream-100/70 hover:bg-cream-200/60 transition-all text-xs font-semibold text-charcoal-700"
                        >
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-3.5 h-3.5 text-terracotta-500" />
                                <span>Preferensi Tambahan (Opsional)</span>
                                {hasActivePreferences && (
                                    <span className="px-2 py-0.5 rounded-full bg-terracotta-500 text-white text-[10px] font-bold">
                                        Aktif
                                    </span>
                                )}
                            </div>
                            {showPreferences ? (
                                <ChevronUp className="w-4 h-4 text-charcoal-400" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-charcoal-400" />
                            )}
                        </button>

                        {showPreferences && (
                            <div className="mt-3 p-4 rounded-2xl bg-white/70 border border-cream-200/80 space-y-3.5 animate-fade-in text-xs">
                                {/* Waktu Masak */}
                                <div>
                                    <span className="block text-[11px] font-bold text-charcoal-600 mb-1.5 uppercase tracking-wider">
                                        Waktu Memasak
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {filterOptions.waktu.map((opt) => {
                                            const isSelected = (preferensi.waktu || 'Semua') === opt.value;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => handleSelectPref('waktu', opt.value)}
                                                    className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-all ${
                                                        isSelected
                                                            ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-soft-xs'
                                                            : 'bg-cream-50 text-charcoal-600 border-cream-300 hover:bg-cream-100'
                                                    }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Tingkat Pedas */}
                                <div>
                                    <span className="block text-[11px] font-bold text-charcoal-600 mb-1.5 uppercase tracking-wider">
                                        Tingkat Pedas
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {filterOptions.pedas.map((opt) => {
                                            const isSelected = (preferensi.pedas || 'Bebas') === opt.value;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => handleSelectPref('pedas', opt.value)}
                                                    className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-all ${
                                                        isSelected
                                                            ? 'bg-terracotta-500 text-white border-terracotta-500 shadow-soft-xs'
                                                            : 'bg-cream-50 text-charcoal-600 border-cream-300 hover:bg-cream-100'
                                                    }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Metode Masak */}
                                <div>
                                    <span className="block text-[11px] font-bold text-charcoal-600 mb-1.5 uppercase tracking-wider">
                                        Metode / Gaya Masak
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {filterOptions.metode.map((opt) => {
                                            const isSelected = (preferensi.metode || 'Bebas') === opt.value;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => handleSelectPref('metode', opt.value)}
                                                    className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-all ${
                                                        isSelected
                                                            ? 'bg-sage-600 text-white border-sage-600 shadow-soft-xs'
                                                            : 'bg-cream-50 text-charcoal-600 border-cream-300 hover:bg-cream-100'
                                                    }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Batasan Alat */}
                                <div>
                                    <span className="block text-[11px] font-bold text-charcoal-600 mb-1.5 uppercase tracking-wider">
                                        Batasan Alat Masak
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {filterOptions.alat.map((opt) => {
                                            const isSelected = (preferensi.alat || 'Semua Alat') === opt.value;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => handleSelectPref('alat', opt.value)}
                                                    className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-all ${
                                                        isSelected
                                                            ? 'bg-amber-600 text-white border-amber-600 shadow-soft-xs'
                                                            : 'bg-cream-50 text-charcoal-600 border-cream-300 hover:bg-cream-100'
                                                    }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-cream-300/60 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
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
