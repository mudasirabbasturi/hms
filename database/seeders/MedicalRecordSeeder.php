<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MedicalRecordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sample medical record templates
        $records = [
            [
                'complaint'    => 'Persistent headache and dizziness.',
                'examination'  => 'Vitals normal, mild tension in neck muscles.',
                'treatment'    => 'Advised rest, hydration, and neck exercises.',
                'prescription' => 'Paracetamol 500mg twice daily for 3 days.',
                'medical_history' => 'Patient reports frequent episodes of stress-induced headaches over the past 3 months. No signs of neurological deficits.',
            ],
            [
                'complaint'    => 'Chronic cough and difficulty breathing.',
                'examination'  => 'Wheezing and shortness of breath noted.',
                'treatment'    => 'Inhaler and respiratory therapy recommended.',
                'prescription' => 'Salbutamol Inhaler as needed.',
                'medical_history' => 'Diagnosed with asthma since childhood. Episodes triggered by dust and cold weather. No recent hospitalization.',
            ],
            [
                'complaint'    => 'Sharp abdominal pain and nausea.',
                'examination'  => 'Tenderness in lower right quadrant.',
                'treatment'    => 'Referred for surgical evaluation.',
                'prescription' => 'Antibiotics and pain relief provided.',
                'medical_history' => 'Acute onset abdominal pain with suspicion of appendicitis. Patient has no prior abdominal surgeries or allergies.',
            ],
            [
                'complaint'    => 'Fatigue and weight gain.',
                'examination'  => 'Thyroid palpation normal, TSH elevated.',
                'treatment'    => 'Started thyroid hormone therapy.',
                'prescription' => 'Levothyroxine 50 mcg daily.',
                'medical_history' => 'Patient reports low energy levels, cold intolerance, and hair thinning. Family history of thyroid dysfunction.',
            ]
        ];

        // Only doctors
        $doctorIds = DB::table('users')
            ->where('type', 'doctor')
            ->pluck('id');

        // All patients
        $patientIds = DB::table('patients')->pluck('id');

        foreach ($patientIds as $patientId) {
            // Assign a random doctor for this patient
            $doctorId = $doctorIds->random();

            // Take 1 or 2 records randomly
            $selectedRecords = collect($records)->shuffle()->take(rand(1, 2));

            foreach ($selectedRecords as $record) {
                DB::table('medical_records')->insert([
                    'user_id'         => $doctorId,
                    'patient_id'      => $patientId,
                    'complaint'       => $record['complaint'],
                    'examination'     => $record['examination'],
                    'treatment'       => $record['treatment'],
                    'prescription'    => $record['prescription'],
                    'medical_history' => $record['medical_history'],
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ]);
            }
        }
    }
}
