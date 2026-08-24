import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import Navbar from '@/Components/SisaSaji/Navbar';
import HeroSection from '@/Components/SisaSaji/HeroSection';
import FloatingActionButton from '@/Components/SisaSaji/FloatingActionButton';
import IngredientModal from '@/Components/SisaSaji/IngredientModal';
import LoadingState from '@/Components/SisaSaji/LoadingState';
import RecipeResult from '@/Components/SisaSaji/RecipeResult';
import SavedRecipesModal from '@/Components/SisaSaji/SavedRecipesModal';
import Toast from '@/Components/SisaSaji/Toast';
import Chip from '@/Components/SisaSaji/Chip';
import { Utensils, ArrowRight } from 'lucide-react';

const SAVED_RECIPES_STORAGE_KEY = 'sisasaji_saved_recipes';

export default function Welcome() {
    // State management
    const [bahanUtama, setBahanUtama] = useState([]);
    const [bumbuDapur, setBumbuDapur] = useState([]);
    const [preferensi, setPreferensi] = useState({
        waktu: 'Semua',
        pedas: 'Bebas',
        metode: 'Bebas',
        alat: 'Semua Alat',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [recipe, setRecipe] = useState(null);
    const [usedBahan, setUsedBahan] = useState([]);
    const [usedBumbu, setUsedBumbu] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    // Load saved recipes from localStorage on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem(SAVED_RECIPES_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) setSavedRecipes(parsed);
            }
        } catch (e) {
            console.warn('Failed to load saved recipes from localStorage:', e);
        }
    }, []);

    // Sync saved recipes to localStorage
    const updateSavedRecipes = (newList) => {
        setSavedRecipes(newList);
        try {
            localStorage.setItem(SAVED_RECIPES_STORAGE_KEY, JSON.stringify(newList));
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
        }
    };

    // Toast helper
    const showToast = (message, type = 'warning') => {
        setToast({ show: true, message, type });
    };

    const hideToast = () => {
        setToast((prev) => ({ ...prev, show: false }));
    };

    // Add Bahan Utama (Max 7)
    const handleAddBahanUtama = (text) => {
        const trimmed = text.trim();
        if (!trimmed) return false;

        if (bahanUtama.length >= 7) {
            showToast('Maksimal 7 bahan utama telah tercapai.', 'warning');
            return false;
        }

        if (bahanUtama.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
            showToast(`"${trimmed}" sudah ada di dalam daftar.`, 'info');
            return false;
        }

        setBahanUtama((prev) => [...prev, trimmed]);
        return true;
    };

    const handleRemoveBahanUtama = (index) => {
        setBahanUtama((prev) => prev.filter((_, i) => i !== index));
    };

    // Add Bumbu Dapur (Max 10)
    const handleAddBumbuDapur = (text) => {
        const trimmed = text.trim();
        if (!trimmed) return false;

        if (bumbuDapur.length >= 10) {
            showToast('Maksimal 10 bumbu dapur telah tercapai.', 'warning');
            return false;
        }

        if (bumbuDapur.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
            showToast(`"${trimmed}" sudah ada di dalam daftar.`, 'info');
            return false;
        }

        setBumbuDapur((prev) => [...prev, trimmed]);
        return true;
    };

    const handleRemoveBumbuDapur = (index) => {
        setBumbuDapur((prev) => prev.filter((_, i) => i !== index));
    };

    // Submit / Generate Recipe
    const handleSubmitRecipe = async (overridePrefs = null) => {
        if (bahanUtama.length === 0) {
            showToast('Masukkan minimal 1 bahan utama untuk mencari resep.', 'warning');
            return;
        }

        setIsModalOpen(false);
        setIsLoading(true);
        setRecipe(null);

        window.scrollTo({ top: 0, behavior: 'smooth' });

        try {
            const activePrefs = overridePrefs || preferensi;
            const response = await axios.post('/generate-recipe', {
                bahan_utama: bahanUtama,
                bumbu_dapur: bumbuDapur,
                preferensi: activePrefs,
            });

            if (response.data?.success && response.data?.data) {
                setRecipe(response.data.data);
                setUsedBahan([...bahanUtama]);
                setUsedBumbu([...bumbuDapur]);

                if (response.data.notice) {
                    showToast(response.data.notice, 'info');
                } else {
                    showToast('Resep berhasil diracik!', 'success');
                }
            } else {
                throw new Error(response.data?.message || 'Gagal menghasilkan resep.');
            }
        } catch (error) {
            console.error('Recipe error:', error);
            const msg =
                error.response?.data?.message ||
                error.message ||
                'Terjadi kesalahan. Silakan coba lagi.';
            showToast(msg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Request alternative variation
    const handleRequestVariation = () => {
        if (!recipe) return;
        const variationPrefs = {
            ...preferensi,
            variasi_dari: recipe.nama_resep,
        };
        showToast('Meracik variasi resep alternatif...', 'info');
        handleSubmitRecipe(variationPrefs);
    };

    // Toggle Bookmark / Save recipe
    const isCurrentRecipeSaved = recipe && savedRecipes.some((r) => r.recipe?.nama_resep === recipe.nama_resep);

    const handleToggleSaveRecipe = () => {
        if (!recipe) return;

        if (isCurrentRecipeSaved) {
            const updated = savedRecipes.filter((r) => r.recipe?.nama_resep !== recipe.nama_resep);
            updateSavedRecipes(updated);
            showToast('Resep dihapus dari Buku Resep.', 'info');
        } else {
            const newItem = {
                id: Date.now(),
                recipe: recipe,
                usedBahan: usedBahan,
                usedBumbu: usedBumbu,
                savedAt: new Date().toISOString(),
            };
            const updated = [newItem, ...savedRecipes];
            updateSavedRecipes(updated);
            showToast('Resep berhasil disimpan ke Buku Resep! ⭐', 'success');
        }
    };

    const handleLoadSavedRecipe = (item) => {
        if (!item || !item.recipe) return;
        setRecipe(item.recipe);
        setUsedBahan(item.usedBahan || []);
        setUsedBumbu(item.usedBumbu || []);
        setBahanUtama(item.usedBahan || []);
        setBumbuDapur(item.usedBumbu || []);
        showToast(`Memuat resep "${item.recipe.nama_resep}"`, 'info');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteSavedRecipe = (id) => {
        const updated = savedRecipes.filter((r) => r.id !== id);
        updateSavedRecipes(updated);
        showToast('Resep dihapus dari Buku Resep.', 'info');
    };

    const totalTags = bahanUtama.length + bumbuDapur.length;

    return (
        <div className="min-h-[100dvh] flex flex-col bg-cream-50 text-charcoal-800 font-sans selection:bg-terracotta-500/20 selection:text-terracotta-700">
            <Head title="SisaSaji - Ubah Bahan Makanan Jadi Resep Praktis" />

            <Toast toast={toast} onClose={hideToast} />
            <Navbar
                onOpenSavedModal={() => setIsSavedModalOpen(true)}
                savedCount={savedRecipes.length}
            />

            {/* Main Content */}
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                {isLoading && <LoadingState />}

                {!isLoading && recipe && (
                    <RecipeResult
                        recipe={recipe}
                        usedBahan={usedBahan}
                        usedBumbu={usedBumbu}
                        isSaved={isCurrentRecipeSaved}
                        onToggleSave={handleToggleSaveRecipe}
                        onRequestVariation={handleRequestVariation}
                        onOpenModal={() => setIsModalOpen(true)}
                    />
                )}

                {!isLoading && !recipe && (
                    <div className="space-y-8">
                        <HeroSection
                            onOpenModal={() => setIsModalOpen(true)}
                            bahanUtama={bahanUtama}
                            bumbuDapur={bumbuDapur}
                        />

                        {/* Pantry Preview — shows when user has added ingredients */}
                        {totalTags > 0 && (
                            <div className="max-w-lg mx-auto animate-fade-in">
                                <div className="border-l-2 border-sage-300 pl-4 py-3">
                                    <div className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                        <Utensils className="w-3 h-3 text-charcoal-400" strokeWidth={2} />
                                        Bahan Dimasukkan ({totalTags})
                                    </div>

                                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                                        {bahanUtama.map((b, i) => (
                                            <Chip
                                                key={`p-b-${i}`}
                                                label={b}
                                                variant="sage"
                                                onRemove={() => handleRemoveBahanUtama(i)}
                                            />
                                        ))}
                                        {bumbuDapur.map((bm, i) => (
                                            <Chip
                                                key={`p-bm-${i}`}
                                                label={bm}
                                                variant="terracotta"
                                                onRemove={() => handleRemoveBumbuDapur(i)}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-start gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(true)}
                                            className="text-xs font-medium text-charcoal-500 hover:text-charcoal-700 underline underline-offset-2 decoration-charcoal-300 transition-colors"
                                        >
                                            Edit bahan & preferensi
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleSubmitRecipe()}
                                            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold shadow-terracotta-glow transition-all duration-200 active:scale-[0.97]"
                                        >
                                            <span>Cari Resep Sekarang</span>
                                            <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <IngredientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                bahanUtama={bahanUtama}
                bumbuDapur={bumbuDapur}
                preferensi={preferensi}
                onChangePreferensi={setPreferensi}
                onAddBahanUtama={handleAddBahanUtama}
                onRemoveBahanUtama={handleRemoveBahanUtama}
                onAddBumbuDapur={handleAddBumbuDapur}
                onRemoveBumbuDapur={handleRemoveBumbuDapur}
                onSubmit={() => handleSubmitRecipe()}
            />

            <SavedRecipesModal
                isOpen={isSavedModalOpen}
                onClose={() => setIsSavedModalOpen(false)}
                savedRecipes={savedRecipes}
                onLoadRecipe={handleLoadSavedRecipe}
                onDeleteRecipe={handleDeleteSavedRecipe}
            />

            <FloatingActionButton
                onClick={() => setIsModalOpen(true)}
                totalTags={totalTags}
            />

            {/* Minimal footer */}
            <footer className="w-full border-t border-cream-200/80 py-6 text-center">
                <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-charcoal-400">
                    <span>
                        <span className="font-semibold text-charcoal-600">SisaSaji</span>
                        {' '}Solusi Masak Praktis & Zero Waste
                    </span>
                    <span>Didukung Google Gemini AI</span>
                </div>
            </footer>
        </div>
    );
}
