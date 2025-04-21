<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        $supplierCount = $faker->numberBetween(10, 20);

        for ($i = 0; $i < $supplierCount; $i++) {
            DB::table('suppliers')->insert([
                'name' => $faker->company,
                'email' => $faker->optional()->companyEmail,
                'phone' => $faker->optional()->phoneNumber,
                'address' => $faker->optional()->address,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}

