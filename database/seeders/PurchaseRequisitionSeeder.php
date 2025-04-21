<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class PurchaseRequisitionSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Get existing item and supplier IDs
        $items = DB::table('items')->pluck('id')->toArray();
        $suppliers = DB::table('suppliers')->pluck('id')->toArray();

        // Check if items and suppliers exist
        if (empty($items)) {
            $this->command->warn('No items found. Seed items table first.');
            return;
        }
        if (empty($suppliers)) {
            $this->command->warn('No suppliers found. Seed suppliers table first.');
            return;
        }

        // Generate 10 random purchase requisitions
        for ($i = 0; $i < 10; $i++) {
            $itemId = $faker->randomElement($items);
            $supplierId = $faker->randomElement($suppliers);
            $requestedQty = $faker->numberBetween(1, 100);

            DB::table('purchase_requisitions')->insert([
                'item_id' => $itemId,
                'supplier_id' => $supplierId,
                'requested_qty' => $requestedQty,
                'notes' => $faker->optional()->sentence,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
