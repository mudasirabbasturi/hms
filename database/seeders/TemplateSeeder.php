<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Template;
use App\Models\User;

class TemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users with type 'doctor'
        $doctors = User::where('type', 'doctor')->get();

        foreach ($doctors as $doctor) {
            Template::create([
                'user_id'   => $doctor->id,
                'type'      => 'prescription',
                'title'     => 'General Prescription Template',
                'content'   => 'This is a general template for prescriptions. Please fill in the necessary details such as medicine, dosage, and duration.',
            ]);

            Template::create([
                'user_id'   => $doctor->id,
                'type'      => 'diagnosis',
                'title'     => 'General Diagnosis Template',
                'content'   => 'This template is for documenting diagnosis. Fill in the diagnosis description, tests performed, and relevant information.',
            ]);

            Template::create([
                'user_id'   => $doctor->id,
                'type'      => 'note',
                'title'     => 'General Medical Note',
                'content'   => 'This template is used for writing medical notes for consultations and check-ups.',
            ]);
        }
    }
}
