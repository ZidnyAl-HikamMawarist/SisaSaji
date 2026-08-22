<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RecipeController extends Controller
{
    /**
     * Generate AI Recipe based on provided ingredients and spices.
     */
    public function generate(Request $request)
    {
        $validated = $request->validate([
            'bahan_utama' => ['required', 'array', 'min:1', 'max:7'],
            'bahan_utama.*' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z0-9\s]+$/'],
            'bumbu_dapur' => ['nullable', 'array', 'max:10'],
            'bumbu_dapur.*' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z0-9\s]+$/'],
        ], [
            'bahan_utama.required' => 'Bahan utama wajib diisi minimal 1 bahan.',
            'bahan_utama.min' => 'Bahan utama wajib diisi minimal 1 bahan.',
            'bahan_utama.max' => 'Bahan utama maksimal 7 bahan.',
            'bumbu_dapur.max' => 'Bumbu dapur maksimal 10 bumbu.',
            'bahan_utama.*.regex' => 'Bahan utama hanya boleh berisi huruf dan angka.',
            'bumbu_dapur.*.regex' => 'Bumbu dapur hanya boleh berisi huruf dan angka.',
        ]);

        $bahanUtama = $validated['bahan_utama'];
        $bumbuDapur = $validated['bumbu_dapur'] ?? [];

        $apiKey = config('services.gemini.api_key') ?: env('GEMINI_API_KEY');
        $model = config('services.gemini.model') ?: 'gemini-3.6-flash';

        // If no API key configured, return a smart demonstration recipe
        if (empty($apiKey)) {
            return response()->json([
                'success' => true,
                'data' => $this->generateMockRecipe($bahanUtama, $bumbuDapur),
                'notice' => 'Catatan: Mode demonstrasi (GEMINI_API_KEY belum diisi di .env). Resep dihasilkan secara otomatis.',
            ]);
        }

        try {
            $prompt = $this->buildPrompt($bahanUtama, $bumbuDapur);

            $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

            $response = Http::timeout(30)->post($endpoint, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'responseMimeType' => 'application/json',
                    'temperature' => 0.7,
                ],
            ]);

            if ($response->failed()) {
                Log::error('Gemini API Error: ' . $response->body());
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal menghubungi AI Gemini (' . $response->status() . '). Silakan periksa GEMINI_API_KEY Anda.',
                ], 500);
            }

            $responseData = $response->json();
            $rawText = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? '';

            // Clean markdown block wrappers if present
            $cleanedJson = preg_replace('/^```(?:json)?\s*|\s*```$/m', '', trim($rawText));
            $recipeData = json_decode($cleanedJson, true);

            if (!$recipeData || !isset($recipeData['nama_resep'])) {
                Log::warning('Gemini returned unparseable JSON: ' . $rawText);
                return response()->json([
                    'success' => true,
                    'data' => $this->generateMockRecipe($bahanUtama, $bumbuDapur),
                    'notice' => 'Resep disesuaikan dari pola bahan.',
                ]);
            }

            // Ensure expected array structure
            $recipeData['alat_masak'] = $recipeData['alat_masak'] ?? ['Wajan / Panci', 'Spatula', 'Kompor'];
            $recipeData['bahan_tambahan_opsional'] = $recipeData['bahan_tambahan_opsional'] ?? [];
            $recipeData['langkah_memasak'] = $recipeData['langkah_memasak'] ?? [];

            return response()->json([
                'success' => true,
                'data' => $recipeData,
            ]);

        } catch (\Exception $e) {
            Log::error('Recipe Generation Exception: ' . $e->getMessage());

            // Fallback gracefully so user experience is not broken
            return response()->json([
                'success' => true,
                'data' => $this->generateMockRecipe($bahanUtama, $bumbuDapur),
                'notice' => 'Resep dihasilkan via fallback offline karena terjadi kendala koneksi API.',
            ]);
        }
    }

    /**
     * Build system and user prompt for Gemini AI.
     */
    private function buildPrompt(array $bahanUtama, array $bumbuDapur): string
    {
        $bahanStr = implode(', ', $bahanUtama);
        $bumbuStr = count($bumbuDapur) > 0 ? implode(', ', $bumbuDapur) : 'Bumbu standar dapur sederhana (garam/minyak)';

        return <<<PROMPT
Anda adalah Chef Konsultan Kuliner SisaSaji, pakar dalam kreasi resep praktis, hemat, dan lezat untuk anak kos serta mahasiswa kuliner dengan peralatan dan bahan terbatas.

Tugas Anda:
Buatlah 1 resep masakan yang lezat dan realistis menggunakan bahan dan bumbu berikut:
- Bahan Utama: {$bahanStr}
- Bumbu Dapur: {$bumbuStr}

Aturan Wajib (Strict Rules):
1. Wajib merespons HANYA dalam format JSON valid tanpa format markdown tambahan di luar JSON.
2. Skema JSON harus tepat seperti berikut:
{
  "nama_resep": "Nama masakan yang menarik dan menggugah selera",
  "alat_masak": [
    "Daftar alat masak minimalis yang disarankan (contoh: Wajan kecil, Spatula, Pisau)"
  ],
  "bahan_tambahan_opsional": [
    "Saran 1-3 bahan/garnis tambahan opsional untuk memperkaya rasa jika pengguna memilikinya nanti"
  ],
  "langkah_memasak": [
    "Langkah 1: Siapkan dan potong bahan...",
    "Langkah 2: Panaskan sedikit minyak dan tumis bumbu...",
    "Langkah 3: Masukkan bahan utama dan masak hingga matang...",
    "Langkah 4: Sajikan selagi hangat..."
  ]
}
3. Pastikan langkah memasak ringkas, jelas, dan mudah diikuti oleh pemula.
PROMPT;
    }

    /**
     * Generate fallback/mock recipe when API key is not configured or in offline test mode.
     */
    private function generateMockRecipe(array $bahanUtama, array $bumbuDapur): array
    {
        $primaryBahan = implode(' & ', array_slice($bahanUtama, 0, 2));
        $allBahanStr = implode(', ', $bahanUtama);
        $allBumbuStr = count($bumbuDapur) > 0 ? implode(', ', $bumbuDapur) : 'garam dan sedikit minyak';

        return [
            'nama_resep' => 'Tumis Kreasi SisaSaji: ' . $primaryBahan . ' Bumbu Spesial',
            'alat_masak' => [
                'Wajan atau Teflon',
                'Spatula',
                'Pisau & Talenan',
                'Kompor / Pemanas Listrik'
            ],
            'bahan_tambahan_opsional' => [
                'Irisan daun bawang atau seledri untuk aroma segar',
                'Taburan bawang goreng',
                'Sedikit kecap manis atau saus sambal sesuai selera'
            ],
            'langkah_memasak' => [
                'Siapkan dan cuci bersih semua bahan utama (' . $allBahanStr . '). Potong sesuai selera dengan ukuran seragam agar matang merata.',
                'Haluskan atau cincang bumbu dapur yang tersedia (' . $allBumbuStr . ').',
                'Panaskan 1-2 sendok makan minyak di wajan dengan api sedang.',
                'Tumis bumbu hingga mengeluarkan aroma harum dan sedikit layu.',
                'Masukkan bahan utama (' . $allBahanStr . ') satu per satu mulai dari bahan yang membutuhkan waktu matang lebih lama.',
                'Aduk rata hingga semua bumbu meresap sempurna. Tambahkan sedikit air jika perlu.',
                'Koreksi rasa, angkat dan sajikan Tumis Kreasi ' . $primaryBahan . ' selagi hangat!'
            ]
        ];
    }
}
