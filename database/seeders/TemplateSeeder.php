<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Template;
use App\Models\User;

class TemplateSeeder extends Seeder
{
    public function run(): void
    {
        $doctors = User::where('type', 'doctor')->get();
        $templateChoices = [
            'Medical History' => [
                'Hypertension', 'Diabetes', 'Asthma', 'Thyroid disorders', 'Heart disease',
                'Epilepsy', 'Allergies', 'Previous surgeries', 'Chronic infections'
            ],
            'Complaints' => [
                'Headache', 'Fever', 'Back pain', 'Cough', 'Fatigue', 'Joint pain'
            ],
            'Examination' => [
                'Blood Pressure: Normal', 'Pulse: Regular', 'Temperature: Elevated',
                'Breath Sounds: Clear', 'Abdomen: Soft'
            ],
            'Diagnosis' => [
                'Acute maxillary sinusitis', 'Allergic rhinitis', 'Tonsillitis', 'Bronchitis',
                'Gastritis', 'Migraine'
            ],
            'Clinical Notes' => [
                'Patient stable', 'Advised rest', 'Symptoms improving', 'Vital signs normal'
            ],
            'Advice' => [
                'Drink plenty of water', 'Avoid spicy food', 'Take prescribed medications',
                'Follow up in a week'
            ],
            'Investigations' => [
                'Blood Test', 'X-Ray Chest', 'MRI Brain', 'Urine Analysis', 'ECG'
            ],
            'Procedure' => [
                'Incision & Drainage', 'Biopsy', 'Wound dressing', 'Catheterization'
            ],
            'Follow- Up' => [
                '3 days', '1 week', '2 weeks', '1 month', '3 months', '6 months'
            ],
            'Recommendations' => [
                'Refer to specialist', 'Lifestyle changes', 'Routine screening',
                'Annual health checkup'
            ],
            'Referral' => [
                'ENT Specialist', 'Orthopedic Surgeon', 'Neurologist', 'Dermatologist'
            ],
        ];

        $templateNames = array_keys($templateChoices);

        foreach ($doctors as $doctor) {
            // Pick 5–6 random unique template names
            $selectedTemplates = collect($templateNames)->shuffle()->take(rand(5, 6));

            foreach ($selectedTemplates as $name) {
                Template::create([
                    'user_id' => $doctor->id,
                    'name' => $name,
                    'show' => true,
                    'choices' => json_encode(
                        collect($templateChoices[$name])->shuffle()->take(rand(3, 6))->values()
                    ),
                ]);
            }
        }
    }
}
