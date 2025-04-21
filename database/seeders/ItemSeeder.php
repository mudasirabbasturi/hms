<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use App\Models\Category;
use App\Models\Manufacturer;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $units = ['box', 'pack', 'piece', 'litre', 'ml', 'tablet', 'bottle', 'strip'];
        $itemNames = [
            'Stethoscope', 'Surgical Gloves', 'Thermometer', 'Blood Pressure Monitor',
            'IV Drip Set', 'Scalpel', 'Bandage Roll', 'Face Mask', 'Sanitizer Bottle',
            'Syringe 5ml', 'Digital Weighing Scale', 'Examination Table Cover',
            'Medical Waste Bin', 'Disinfectant Solution', 'N95 Respirator',
            'Cotton Roll', 'Surgical Scissors', 'First Aid Box', 'BP Cuff', 'Pulse Oximeter'
        ];

        $categoryIds = \App\Models\Category::pluck('id')->toArray();
        $manufacturerIds = \App\Models\Manufacturer::pluck('id')->toArray();

        foreach ($faker->randomElements($itemNames, rand(15, 25)) as $name) {
            DB::table('items')->insert([
                'name' => $name,
                'barcode' => $faker->unique()->ean13(),
                'category_id' => $faker->optional()->randomElement($categoryIds),
                'manufacturer_id' => $faker->optional()->randomElement($manufacturerIds),
                'unit' => $faker->randomElement($units),
                'reorder_level' => $faker->numberBetween(5, 50),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
