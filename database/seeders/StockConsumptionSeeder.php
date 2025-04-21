<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class StockConsumptionSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $itemStocks = DB::table('item_stocks')->get();

        if ($itemStocks->isEmpty()) {
            $this->command->warn('No item stocks found. Seed item_stocks table first.');
            return;
        }

        foreach ($itemStocks->random(10) as $stock) {
            $qty = $faker->numberBetween(1, min(10, $stock->total_qty));
            $totalCost = $qty * $stock->unit_cost;
            $totalRetail = $qty * $stock->retail_price;

            DB::table('stock_consumptions')->insert([
                'item_stock_id' => $stock->id,
                'item_id' => $stock->item_id,
                'consumed_qty' => $qty,
                'consumption_type' => $faker->randomElement(['operation', 'ward use', 'lab test', 'emergency']),
                'template_name' => $faker->optional()->word,
                'added_by' => $faker->name,
                'comment' => $faker->optional()->sentence,
                'total_cost' => $totalCost,
                'total_retail_price' => $totalRetail,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
