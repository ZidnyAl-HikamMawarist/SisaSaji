import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChefHat, Leaf, ArrowRight, Wallet, Sparkles, UtensilsCrossed, Clock } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-[100dvh] flex flex-col bg-cream-50 text-charcoal-800 font-sans selection:bg-terracotta-500/20 selection:text-terracotta-700 overflow-x-hidden">
            <Head title="SisaSaji - Jangan Buang Makananmu" />

            {/* Minimal Navbar */}
            <header className="absolute top-0 w-full z-30 pt-6 px-6 sm:px-10 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-terracotta-500 text-white flex items-center justify-center shadow-soft-sm">
                        <ChefHat className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-charcoal-900">
                        Sisa<span className="text-terracotta-500">Saji</span>
                    </span>
                </div>
                
                <Link
                    href="/app"
                    className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold tracking-wide transition-all duration-200 active:scale-[0.97]"
                >
                    Mulai Racik Resep
                </Link>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-24 pb-12 sm:py-24">
                
                {/* Hero & Bento Split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Left: Huge Typography & CTA (7 columns) */}
                    <div className="lg:col-span-7 space-y-6 sm:space-y-8 animate-stagger-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sage-50 border border-sage-200/60 text-sage-700 text-xs font-semibold tracking-wide">
                            <Leaf className="w-3.5 h-3.5 text-sage-500" strokeWidth={2.5} />
                            <span>Aplikasi Anti Food-Waste</span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-6xl lg:text-[4.5rem] font-extrabold font-display text-charcoal-950 tracking-tight leading-[1.05]">
                            Jangan Buang Makananmu.<br/>
                            <span className="text-terracotta-500">Jadikan Masakan Lezat.</span>
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-charcoal-500 max-w-xl leading-relaxed font-medium">
                            Ubah sisa telur, tahu, atau sayur layu di kulkas menjadi hidangan istimewa. AI kami akan menemukan kombinasi rasa terbaik untukmu.
                        </p>
                        
                        <div className="pt-2">
                            <Link
                                href="/app"
                                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-base shadow-terracotta-glow hover:shadow-xl transition-all duration-300 active:scale-[0.97]"
                            >
                                <span>Coba Racik Resep (Gratis)</span>
                                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                            </Link>
                        </div>
                    </div>

                    {/* Right: Bento Grid Value Props (5 columns) */}
                    <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-stagger-2 mt-8 lg:mt-0">
                        
                        {/* Box 1: Zero Waste */}
                        <div className="glass-card p-6 rounded-3xl flex flex-col justify-between aspect-square sm:aspect-auto sm:h-52 hover:border-sage-300 transition-colors">
                            <div className="w-12 h-12 rounded-2xl bg-sage-100 text-sage-600 flex items-center justify-center mb-4">
                                <Leaf className="w-6 h-6" strokeWidth={2} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold font-display text-charcoal-900 mb-1">Zero Waste</h3>
                                <p className="text-sm text-charcoal-500 leading-relaxed">Kurangi sampah makanan. Manfaatkan setiap tetes bahan di dapurmu.</p>
                            </div>
                        </div>

                        {/* Box 2: Hemat */}
                        <div className="glass-card p-6 rounded-3xl flex flex-col justify-between aspect-square sm:aspect-auto sm:h-52 hover:border-terracotta-300 transition-colors">
                            <div className="w-12 h-12 rounded-2xl bg-terracotta-50 text-terracotta-500 flex items-center justify-center mb-4">
                                <Wallet className="w-6 h-6" strokeWidth={2} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold font-display text-charcoal-900 mb-1">Lebih Hemat</h3>
                                <p className="text-sm text-charcoal-500 leading-relaxed">Stop jajan di luar. Masak bahan sisa jauh lebih murah dan sehat.</p>
                            </div>
                        </div>

                        {/* Box 3: Pintar (Wide) */}
                        <div className="glass-card p-6 rounded-3xl sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:border-amber-300 transition-colors">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-6 h-6" strokeWidth={2} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold font-display text-charcoal-900 mb-1">Ditenagai Gemini AI</h3>
                                <p className="text-sm text-charcoal-500 leading-relaxed">Sistem cerdas yang mengerti bumbu dan teknik masak layaknya koki profesional.</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Step-by-step section (Super clean) */}
                <div className="mt-24 sm:mt-32 pt-16 border-t border-cream-200/80 animate-stagger-3">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold font-display text-charcoal-900">Cara Kerja Simpel</h2>
                        <p className="text-sm text-charcoal-400 mt-2">Tidak perlu ribet, langsung praktek.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
                        <StepItem 
                            number="1" 
                            icon={<UtensilsCrossed />} 
                            title="Cek Kulkas" 
                            desc="Lihat bahan makanan dan bumbu sisa apa saja yang kamu punya hari ini."
                        />
                        <StepItem 
                            number="2" 
                            icon={<Sparkles />} 
                            title="Ketik di Aplikasi" 
                            desc="Masukkan nama-nama bahan tersebut ke dalam sistem cerdas SisaSaji."
                        />
                        <StepItem 
                            number="3" 
                            icon={<Clock />} 
                            title="Langsung Masak" 
                            desc="AI akan memberikan resep instan, lengkap dengan takaran dan langkahnya."
                        />
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-24 sm:mt-32 pt-24 border-t border-cream-200/80 animate-stagger-1">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold font-display text-charcoal-900">Pertanyaan Populer</h2>
                        <p className="text-sm text-charcoal-400 mt-3 max-w-md mx-auto">Jawaban cepat untuk pertanyaan yang sering ditanyakan seputar SisaSaji.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div className="bg-white/50 border border-cream-200/60 p-6 rounded-3xl">
                            <h4 className="text-base font-bold text-charcoal-900 mb-2">Apakah SisaSaji 100% gratis?</h4>
                            <p className="text-sm text-charcoal-500 leading-relaxed">Ya, SisaSaji sepenuhnya gratis untuk digunakan oleh siapa saja. Misi kami adalah mengurangi limbah makanan di Indonesia, sehingga aksesnya terbuka untuk umum.</p>
                        </div>
                        <div className="bg-white/50 border border-cream-200/60 p-6 rounded-3xl">
                            <h4 className="text-base font-bold text-charcoal-900 mb-2">Berapa bahan maksimal yang bisa diinput?</h4>
                            <p className="text-sm text-charcoal-500 leading-relaxed">Untuk menjaga kualitas rekomendasi, Anda bisa memasukkan hingga 7 bahan utama dan 10 bumbu dapur sekaligus.</p>
                        </div>
                        <div className="bg-white/50 border border-cream-200/60 p-6 rounded-3xl">
                            <h4 className="text-base font-bold text-charcoal-900 mb-2">Apakah resepnya pasti enak?</h4>
                            <p className="text-sm text-charcoal-500 leading-relaxed">Resep diracik oleh Google Gemini AI yang dilatih dengan jutaan resep kuliner, sehingga kombinasi bahan dan langkah memasaknya dijamin masuk akal dan lezat.</p>
                        </div>
                        <div className="bg-white/50 border border-cream-200/60 p-6 rounded-3xl">
                            <h4 className="text-base font-bold text-charcoal-900 mb-2">Apakah saya perlu membuat akun?</h4>
                            <p className="text-sm text-charcoal-500 leading-relaxed">Saat ini tidak perlu! Anda bisa langsung membuka kulkas, melihat sisa bahan, mengetikkannya di aplikasi kami, dan langsung memasak.</p>
                        </div>
                    </div>
                </div>

            </main>

            {/* Comprehensive Footer */}
            <footer className="w-full bg-charcoal-950 text-charcoal-300 py-16 sm:py-20 mt-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                    {/* Brand Column */}
                    <div className="md:col-span-1 space-y-5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-terracotta-500 text-white flex items-center justify-center shadow-soft-sm">
                                <ChefHat className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">
                                Sisa<span className="text-terracotta-500">Saji</span>
                            </span>
                        </div>
                        <p className="text-sm text-charcoal-400 leading-relaxed">
                            Membantu Anda mengubah sisa bahan makanan menjadi hidangan lezat dan mengurangi limbah pangan dari dapur sendiri.
                        </p>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className="text-white font-bold mb-5 tracking-wide text-sm">Produk</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/app" className="hover:text-terracotta-400 transition-colors">Racik Resep AI</Link></li>
                            <li><a href="/" className="hover:text-terracotta-400 transition-colors">Buku Resep Komunitas</a></li>
                            <li><a href="/" className="hover:text-terracotta-400 transition-colors">Cara Kerja AI</a></li>
                            <li><a href="/" className="hover:text-terracotta-400 transition-colors">Pembaruan Versi</a></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="text-white font-bold mb-5 tracking-wide text-sm">Perusahaan</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="/" className="hover:text-terracotta-400 transition-colors">Tentang Kami</a></li>
                            <li><a href="/" className="hover:text-terracotta-400 transition-colors">Misi Zero Waste</a></li>
                            <li><a href="/" className="hover:text-terracotta-400 transition-colors">Karir</a></li>
                            <li><a href="/" className="hover:text-terracotta-400 transition-colors">Kontak</a></li>
                        </ul>
                    </div>

                    {/* Links 3 */}
                    <div>
                        <h4 className="text-white font-bold mb-5 tracking-wide text-sm">Legal & Bantuan</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-terracotta-400 transition-colors">Pusat Bantuan</a></li>
                            <li><a href="#" className="hover:text-terracotta-400 transition-colors">Syarat & Ketentuan</a></li>
                            <li><a href="#" className="hover:text-terracotta-400 transition-colors">Kebijakan Privasi</a></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16 pt-8 border-t border-charcoal-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <p>© {new Date().getFullYear()} SisaSaji. Seluruh hak cipta dilindungi.</p>
                    <p className="flex items-center gap-1.5">
                        Didesain di Indonesia dengan <Leaf className="w-3.5 h-3.5 text-sage-500" />
                    </p>
                </div>
            </footer>
        </div>
    );
}
function StepItem({ number, icon, title, desc }) {
    return (
        <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-white/40 border border-cream-200/50 hover:bg-white/70 transition-colors duration-300">
            <div className="w-14 h-14 rounded-2xl bg-cream-200/80 text-charcoal-800 flex items-center justify-center mb-5 relative">
                {React.cloneElement(icon, { className: 'w-6 h-6', strokeWidth: 2 })}
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-charcoal-900 text-white text-[10px] font-bold flex items-center justify-center border-2 border-cream-50">
                    {number}
                </div>
            </div>
            <h3 className="text-base font-bold font-display text-charcoal-900 mb-2">{title}</h3>
            <p className="text-sm text-charcoal-500 leading-relaxed max-w-xs">{desc}</p>
        </div>
    );
}
