<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class ItemSupplierSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Get existing item and supplier IDs
        $items = DB::table('items')->pluck('id')->toArray();
        $suppliers = DB::table('suppliers')->pluck('id')->toArray();

        // Check if necessary data exists
        if (empty($items)) {
            $this->command->warn('No items found. Seed Items table first.');
            return;
        }
        if (empty($suppliers)) {
            $this->command->warn('No suppliers found. Seed Suppliers table first.');
            return;
        }

        // Generate random Item-Supplier combinations
        for ($i = 0; $i < 20; $i++) {  // Adjust the number (20) as needed
            $itemId = $faker->randomElement($items);
            $supplierId = $faker->randomElement($suppliers);

            DB::table('item_suppliers')->insert([
                'item_id' => $itemId,
                'supplier_id' => $supplierId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
