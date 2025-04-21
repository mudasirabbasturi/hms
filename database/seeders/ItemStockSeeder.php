<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use App\Models\Item;

class ItemStockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Get all item IDs
        $itemIds = Item::pluck('id')->toArray();

        foreach ($itemIds as $itemId) {
            $recordsCount = $faker->numberBetween(1, 5);

            for ($i = 0; $i < $recordsCount; $i++) {
                $qty = $faker->numberBetween(10, 100);
                $unitCost = $faker->randomFloat(2, 10, 500);
                $totalCost = $unitCost * $qty;

                $retailPrice = $unitCost + $faker->randomFloat(2, 5, 100);
                $discount = $faker->randomFloat(2, 0, 20);
                $tax = $faker->randomFloat(2, 0, 15);

                $netRetailPrice = $retailPrice - $discount;
                $netValue = ($netRetailPrice + $tax) * $qty;

                $expiryDate = $faker->optional()->dateTimeBetween('now', '+2 years');

                DB::table('item_stocks')->insert([
                    'item_id' => $itemId,
                    'batch_no' => $faker->optional()->bothify('BATCH-####-??'),
                    'expiry_date' => $expiryDate ? $expiryDate->format('Y-m-d') : null,
                    'total_qty' => $qty,
                    'unit_cost' => $unitCost,
                    'total_cost' => $totalCost,
                    'retail_price' => $retailPrice,
                    'net_retail_price' => $netRetailPrice,
                    'discount' => $discount,
                    'sales_tax' => $tax,
                    'net_value' => $netValue,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
