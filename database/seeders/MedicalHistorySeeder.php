<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MedicalHistory;
use App\Models\Patient;
use Faker\Factory as Faker;

class MedicalHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $conditions = [
            'Hypertension', 'Diabetes Mellitus', 'Asthma', 'Migraine', 'Arthritis', 
            'Flu', 'Cold', 'Back Pain', 'Heart Disease', 'Epilepsy'
        ];
        $patients = Patient::all();
        foreach ($patients as $patient) {
            $historyCount = rand(1, 3);
            for ($i = 0; $i < $historyCount; $i++) {
                $condition = $conditions[array_rand($conditions)];
                $isChronic = in_array($condition, ['Hypertension', 'Diabetes Mellitus', 'Asthma', 'Heart Disease']);
                $resolvedAt = $isChronic ? null : $faker->date('Y-m-d', 'now');
                MedicalHistory::create([
                    'patient_id' => $patient->id,
                    'condition' => $condition,
                    'notes' => $faker->paragraph(),
                    'diagnosed_at' => $faker->date('Y-m-d', '5 years ago'),
                    'resolved_at' => $resolvedAt,
                    'is_chronic' => $isChronic,
                ]);
            }
        }
    }
}

