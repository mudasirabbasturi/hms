<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class StockRequestSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $departments = DB::table('departments')->pluck('id')->toArray();
        $items = DB::table('items')->pluck('id')->toArray();

        // Check if there are any departments or items available
        if (empty($departments)) {
            $this->command->warn('No departments found. Seed departments table first.');
            return;
        }
        if (empty($items)) {
            $this->command->warn('No items found. Seed items table first.');
            return;
        }

        // Seed 10 random stock requests
        for ($i = 0; $i < 10; $i++) {
            $departmentId = $faker->randomElement($departments);
            $itemId = $faker->randomElement($items);
            $requestedQty = $faker->numberBetween(1, 100);

            DB::table('stock_requests')->insert([
                'requested_by' => $faker->name,
                'department_id' => $departmentId,
                'item_id' => $itemId,
                'requested_qty' => $requestedQty,
                'status' => $faker->randomElement(['pending', 'approved', 'rejected', 'returned']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
