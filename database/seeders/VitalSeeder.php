<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vital;
use App\Models\MedicalRecord;

class VitalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $MedicalRecords = MedicalRecord::all();

        foreach ($MedicalRecords as $MedicalRecord) {
            Vital::create([
                'medical_record_id' => $MedicalRecord->id,
                'pulse'             => rand(60, 100),
                'temperature'       => round(rand(970, 1000) / 10, 1), // 97.0 - 100.0
                'systolic_bp'       => rand(100, 140),
                'diastolic_bp'      => rand(60, 90),
                'respiratory_rate'  => rand(12, 20),
                'blood_sugar'       => round(rand(700, 1400) / 10, 1), // 70.0 - 140.0
                'weight'            => round(rand(500, 1000) / 10, 1), // 50.0 - 100.0 kg
                'height'            => round(rand(1400, 1900) / 10, 1), // 140.0 - 190.0 cm
                'bmi'               => round(rand(180, 300) / 10, 1), // 18.0 - 30.0
                'bsa'               => round(rand(140, 220) / 100, 2), // 1.40 - 2.20
                'oxygen_saturation' => round(rand(940, 1000) / 10, 1), // 94.0 - 100.0
            ]);
        }
    }
}
