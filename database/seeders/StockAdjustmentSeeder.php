<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class StockAdjustmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        $itemStockIds = DB::table('item_stocks')->pluck('id');

        foreach ($itemStockIds as $itemStockId) {
            $adjustmentCount = rand(1, 3);

            for ($i = 0; $i < $adjustmentCount; $i++) {
                $adjustedQty = $faker->numberBetween(-10, 10); // negative for decrease, positive for increase

                // Skip if adjustedQty is 0
                if ($adjustedQty === 0) {
                    continue;
                }

                DB::table('stock_adjustments')->insert([
                    'item_stock_id' => $itemStockId,
                    'adjusted_qty' => $adjustedQty,
                    'reason' => $faker->optional()->sentence,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
