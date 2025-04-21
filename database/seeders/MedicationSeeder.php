<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MedicationSeeder extends Seeder
{
    public function run(): void
    {
        $medicalRecords = DB::table('medical_records')->get();

        foreach ($medicalRecords as $record) {
            DB::table('medications')->insert([
                [
                    'medical_record_id' => $record->id,
                    'name' => 'Paracetamol',
                    'duration' => '5 days',
                    'morning' => true,
                    'afternoon' => false,
                    'evening' => true,
                    'night' => false,
                    'route' => 'oral',
                    'instructions' => 'Take after meals. Avoid alcohol.',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'medical_record_id' => $record->id,
                    'name' => 'Amoxicillin',
                    'duration' => '7 days',
                    'morning' => true,
                    'afternoon' => true,
                    'evening' => false,
                    'night' => true,
                    'route' => 'oral',
                    'instructions' => 'Complete the full course even if you feel better.',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            ]);
        }
    }
}
