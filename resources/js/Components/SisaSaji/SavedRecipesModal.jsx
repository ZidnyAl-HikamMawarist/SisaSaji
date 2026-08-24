import React, { useEffect, useRef } from 'react';
import { Bookmark, X, ArrowRight, Trash2, Clock, Utensils, Sparkles, BookOpen } from 'lucide-react';

export default function SavedRecipesModal({
    isOpen,
    onClose,
    savedRecipes = [],
    onLoadRecipe,
    onDeleteRecipe,
}) {
    const modalRef = useRef(null);

    // ESC key support
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
                aria-labelledby="saved-recipes-title"
                className="relative w-full max-w-2xl glass-modal rounded-3xl p-6 sm:p-8 z-10 animate-slide-up my-auto max-h-[85vh] flex flex-col"
            >
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-cream-300/60 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-soft-sm">
                            <Bookmark className="w-5 h-5 fill-current" />
                        </div>
                        <div>
                            <h2 id="saved-recipes-title" className="text-lg font-bold font-display text-charcoal-900 leading-snug">
                                Buku Resep Favorit
                            </h2>
                            <p className="text-xs text-charcoal-400 mt-0.5">
                                {savedRecipes.length} resep tersimpan di perangkat ini
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-charcoal-100/50 transition-colors focus:outline-none focus:ring-2 focus:ring-charcoal-300"
                        aria-label="Tutup Buku Resep"
                    >
                        <X className="w-5 h-5" strokeWidth={2} />
                    </button>
                </div>

                {/* Recipe List */}
                <div className="py-4 space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                    {savedRecipes.length === 0 ? (
                        <div className="py-12 text-center space-y-3">
                            <div className="w-14 h-14 rounded-2xl bg-cream-200 text-charcoal-400 mx-auto flex items-center justify-center">
                                <BookOpen className="w-7 h-7" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-sm font-bold text-charcoal-700">Belum Ada Resep Tersimpan</h3>
                            <p className="text-xs text-charcoal-400 max-w-xs mx-auto leading-relaxed">
                                Simpan resep yang kamu sukai dengan menekan tombol bintang (⭐) saat hasil resep muncul.
                            </p>
                        </div>
                    ) : (
                        savedRecipes.map((item) => (
                            <div
                                key={item.id}
                                className="group p-4 rounded-2xl border border-cream-200/80 bg-white/70 hover:bg-white hover:border-amber-300/80 transition-all duration-200 shadow-soft-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                                <div className="space-y-1.5 flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60">
                                            Tersimpan {item.savedAt ? new Date(item.savedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Favorit'}
                                        </span>
                                        {item.recipe?.langkah_memasak && (
                                            <span className="text-[11px] text-charcoal-400">
                                                • {item.recipe.langkah_memasak.length} Langkah
                                            </span>
                                        )}
                                    </div>

                                    <h4 className="text-sm font-bold text-charcoal-900 group-hover:text-amber-900 transition-colors truncate">
                                        {item.recipe?.nama_resep || 'Resep Kreasi'}
                                    </h4>

                                    {/* Bahan preview */}
                                    <div className="flex flex-wrap items-center gap-1 text-[11px] text-charcoal-500">
                                        <Utensils className="w-3 h-3 text-charcoal-400 flex-shrink-0" />
                                        <span>
                                            {(item.usedBahan || []).concat(item.usedBumbu || []).slice(0, 4).join(', ')}
                                            {(item.usedBahan || []).length + (item.usedBumbu || []).length > 4 ? '...' : ''}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0 pt-1 sm:pt-0">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onLoadRecipe(item);
                                            onClose();
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold shadow-soft-xs transition-all active:scale-95"
                                    >
                                        <span>Buka Resep</span>
                                        <ArrowRight className="w-3 h-3" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => onDeleteRecipe(item.id)}
                                        className="p-2 rounded-xl text-charcoal-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                        title="Hapus dari Buku Resep"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-cream-300/60 flex items-center justify-end flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-cream-300/80 text-charcoal-600 text-xs font-semibold hover:bg-cream-100 transition-all active:scale-95"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
