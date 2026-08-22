<?php

namespace Tests\Feature;

use Tests\TestCase;

class RecipeGenerationTest extends TestCase
{
    public function test_welcome_page_is_accessible(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_recipe_generation_success_with_valid_ingredients(): void
    {
        $response = $this->postJson('/generate-recipe', [
            'bahan_utama' => ['Telur', 'Nasi', 'Wortel'],
            'bumbu_dapur' => ['Bawang Putih', 'Garam', 'Kecap'],
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'nama_resep',
                    'alat_masak',
                    'bahan_tambahan_opsional',
                    'langkah_memasak',
                ],
            ]);
    }

    public function test_recipe_generation_fails_when_no_ingredients(): void
    {
        $response = $this->postJson('/generate-recipe', [
            'bahan_utama' => [],
            'bumbu_dapur' => ['Garam'],
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['bahan_utama']);
    }

    public function test_recipe_generation_fails_when_exceeding_max_ingredients(): void
    {
        $response = $this->postJson('/generate-recipe', [
            'bahan_utama' => ['1', '2', '3', '4', '5', '6', '7', '8'], // 8 items > 7 max
            'bumbu_dapur' => [],
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['bahan_utama']);
    }

    public function test_recipe_generation_fails_when_exceeding_max_spices(): void
    {
        $response = $this->postJson('/generate-recipe', [
            'bahan_utama' => ['Telur'],
            'bumbu_dapur' => ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'], // 11 items > 10 max
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['bumbu_dapur']);
    }
}
