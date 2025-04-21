<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Top-level categories
        $categories = [
            'Medical Equipment',
            'Surgical Instruments',
            'Diagnostic Tools',
            'Hospital Furniture',
            'Laboratory Supplies',
            'Pharmaceuticals',
            'Disposable Supplies',
            'Personal Protective Equipment (PPE)',
        ];

        $categoryIds = [];

        foreach ($categories as $name) {
            $categoryIds[$name] = DB::table('categories')->insertGetId([
                'name' => $name,
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        $subcategories = [
            'Surgical Instruments' => ['Scissors', 'Forceps', 'Retractors'],
            'Personal Protective Equipment (PPE)' => ['Gloves', 'Masks', 'Gowns'],
            'Disposable Supplies' => ['Syringes', 'Bandages', 'IV Sets'],
        ];

        foreach ($subcategories as $parent => $children) {
            foreach ($children as $child) {
                DB::table('categories')->insert([
                    'name' => $child,
                    'parent_id' => $categoryIds[$parent],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
