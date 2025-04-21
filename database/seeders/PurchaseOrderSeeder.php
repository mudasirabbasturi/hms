<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class PurchaseOrderSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Get existing purchase_requisition and supplier IDs
        $purchaseRequisitions = DB::table('purchase_requisitions')->pluck('id')->toArray();
        $suppliers = DB::table('suppliers')->pluck('id')->toArray();

        // Check if purchase requisitions and suppliers exist
        if (empty($purchaseRequisitions)) {
            $this->command->warn('No purchase requisitions found. Seed PurchaseRequisition table first.');
            return;
        }
        if (empty($suppliers)) {
            $this->command->warn('No suppliers found. Seed Suppliers table first.');
            return;
        }

        // Generate 10 random purchase orders
        for ($i = 0; $i < 10; $i++) {
            $purchaseRequisitionId = $faker->randomElement($purchaseRequisitions);
            $supplierId = $faker->randomElement($suppliers);
            $orderDate = $faker->date();

            DB::table('purchase_orders')->insert([
                'purchase_requisition_id' => $purchaseRequisitionId,
                'supplier_id' => $supplierId,
                'order_date' => $orderDate,
                'status' => $faker->randomElement(['pending', 'approved', 'shipped', 'delivered']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
