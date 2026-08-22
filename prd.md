# Product Requirements Document (PRD): SisaSaji

## 🚀 1. Ringkasan Proyek (Project Overview)
* **Nama Proyek:** SisaSaji
* **Tujuan (Goal):** Membantu pengguna memaksimalkan bahan makanan yang tersedia di tempat tinggal mereka menjadi resep masakan yang praktis menggunakan kecerdasan buatan (AI). Sistem ini bertujuan untuk menghemat pengeluaran makan sehari-hari dan mengurangi limbah makanan (*food waste*).
* **Target Pengguna:** 
  * Anak Kos (memiliki keterbatasan bahan dan alat masak).
  * Siswa/Mahasiswa Jurusan Kuliner (membutuhkan referensi dan inspirasi kreasi resep berdasarkan komposisi bahan spesifik).
* **Batasan Proyek (Scope Out):** 
  * Tidak ada fitur integrasi ke supermarket online untuk belanja bahan.
  * Tidak menyediakan video tutorial memasak dari platform eksternal (misal: YouTube).
  * *Belum ada* fitur login akun dan penyimpanan riwayat resep untuk fase awal (MVP) ini.

---

## 👥 2. Peran Pengguna (User Persona & Roles)
Karena ini adalah versi MVP (Minimum Viable Product), hanya ada satu peran utama di dalam sistem.
* **Pengguna (Guest User):**
  * Bisa mengakses halaman utama aplikasi tanpa perlu mendaftar (login).
  * Bisa menginput daftar bahan makanan dan bumbu yang dimiliki.
  * Bisa membaca hasil rekomendasi resep dari AI, lengkap dengan saran tambahan bahan dan langkah memasak.

---

## 📋 3. Fitur Utama & Alur Pengguna (Core Features & User Flows)

### Fitur 1: Input Bahan Makanan dan Bumbu (Sistem Tag)
* **Alur:** 
  1. Pengguna berada di Halaman Utama dan menekan tombol *Floating Action Button* (FAB) "Tambah" di pojok kanan bawah.
  2. Sistem menampilkan *Modal* (jendela *overlay*) berisi form dengan dua kolom input: "Bahan Utama" dan "Bumbu Dapur".
  3. Pengguna mengetik nama bahan, lalu menekan "Enter" atau tombol "+", teks tersebut otomatis berubah menjadi *Label/Tag* visual.
  4. Setelah selesai, pengguna menekan tombol "Cari Resep".
* **User Story:** "Sebagai Pengguna, saya ingin memasukkan nama bahan satu per satu menjadi label, sehingga saya bisa melihat dengan jelas bahan apa saja yang sudah saya masukkan tanpa bingung."

### Fitur 2: *Generator* Resep AI
* **Alur:**
  1. Setelah pengguna menekan "Cari Resep", *Modal* menutup dan sistem menampilkan animasi *loading*.
  2. Sistem mengirim data kumpulan tag bahan secara *backend* ke AI Gemini.
  3. Sistem menampilkan hasil berupa: Nama Masakan, Alat Masak yang Disarankan, Bahan Tambahan Opsional, dan Langkah-langkah Memasak.
* **User Story:** "Sebagai Pengguna, saya ingin mendapatkan rekomendasi resep sekaligus alat masak yang dibutuhkan, sehingga saya tahu apakah resep tersebut bisa saya buat dengan peralatan terbatas."

---

## ⚙️ 4. Aturan Bisnis (Business Rules)
* **Ketentuan Batas Input:**
  * Kolom "Bahan Utama" memiliki batas minimum input 1 bahan dan **maksimum 7 bahan**.
  * Kolom "Bumbu Dapur" memiliki batas **maksimum 10 bumbu**.
  * Jika mencoba memasukkan tag melebihi batas, sistem akan menolak input dan memunculkan notifikasi (*toast/snackbar*): "Maksimal bahan/bumbu telah tercapai".
* **Ketentuan Format Input:** Sistem memvalidasi dan mengabaikan input kosong (hanya spasi) agar tidak menjadi label kosong.
* **Ketentuan Output AI (Prompting Rule):** *System prompt* ke AI harus secara ketat diinstruksikan untuk merespons dalam format JSON dan wajib mencantumkan daftar "Alat Masak yang Disarankan" di setiap resep.

---

## 📊 5. Kebutuhan Data (Data Requirements)
Aplikasi tidak menggunakan database permanen pada tahap ini. Data dipertahankan sebagai *state* di memori selama sesi berjalan.
* **Data Input (Sisi Klien):** 
  * `bahan_utama`: Array of Strings (Max 7. Contoh: `["Telur", "Nasi"]`).
  * `bumbu_dapur`: Array of Strings (Max 10. Contoh: `["Kecap", "Garam"]`).
* **Data Output (Respons AI - JSON format):**
  * `nama_resep`: String.
  * `alat_masak`: Array of Strings.
  * `bahan_tambahan_opsional`: Array of Strings.
  * `langkah_memasak`: Array of Strings.

---

## 🎨 6. Panduan Desain & Antarmuka (UI/UX Guidelines)
Mengingat pentingnya komposisi visual dan presisi *layout* dalam antarmuka web, desain akan mengedepankan struktur yang bersih (*clean*) dan tipografi yang rapi.
* **Gaya Desain:** Modern, *clean layout*, dan terstruktur. Menggunakan komponen *card* dengan *soft shadow* untuk membedakan antara area form input dan area hasil resep. Elemen visual seperti ikon bahan makanan disarankan menggunakan format vektor (SVG) agar tetap tajam.
* **Palet Warna:** 
  * **Warna Latar Utama:** Krem hangat (`#F9F6F0` atau `#F4EFE6`) untuk memberi nuansa organik ala dapur.
  * **Warna Aksen:** Oranye Terracotta (`#E07A5F`) atau Hijau Sage (`#81B29A`) diaplikasikan pada tombol utama dan *Floating Action Button*.
  * **Teks Utama:** Abu-abu gelap (`#333333`) untuk kontras yang nyaman dibaca.
* **Komponen UI Utama:**
  * *Floating Action Button* (FAB) yang responsif.
  * *Modal window* dengan efek *backdrop blur* (*glassmorphism* ringan) yang terpusat dengan sempurna di tengah layar.
  * *Chips/Tags* interaktif untuk input, dilengkapi ikon (x) untuk menghapus.

---

## 🛠️ 7. Batasan Teknis (Technical Stack & Constraints)
*Stack* ini dipilih agar sangat ideal untuk alur pengembangan perangkat lunak yang mengutamakan interaktivitas antarmuka (*UI-heavy*) sekaligus menjaga keamanan kredensial.
* **Frontend & Backend (Pilihan 2 - Laravel Ecosystem):** Laravel dipadukan dengan Inertia.js dan React/Vue + Ai SDK. Opsi ini mempertahankan logika arsitektur backend yang kokoh sambil tetap memberikan kemampuan *Single Page Application* (SPA) yang sangat mulus di sisi pengguna.
* **Keamanan:** API Key Gemini **wajib** diletakkan dalam variabel *environment* (`.env`) dan tidak boleh terekspos ke sisi klien/browser dalam keadaan apa pun.
