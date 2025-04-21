<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class ManufacturerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $total = rand(10, 20);

        for ($i = 0; $i < $total; $i++) {
            DB::table('manufacturers')->insert([
                'name' => $faker->company,
                'address' => $faker->address,
                'contact_email' => $faker->companyEmail,
                'contact_phone' => $faker->phoneNumber,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
