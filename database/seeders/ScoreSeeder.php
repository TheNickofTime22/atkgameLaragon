<?php

namespace Database\Seeders;

use App\Models\Scores;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ScoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Scores::factory()->count(10)->create();
    }
}
