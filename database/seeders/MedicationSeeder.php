<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Medication;
use App\Models\Prescription;

class MedicationSeeder extends Seeder
{
    public function run(): void
    {
        $medicineList = [
            ['Paracetamol', '500mg', 'Twice a day', '5 days', 'After food'],
            ['Ibuprofen', '200mg', 'Three times a day', '7 days', 'After meals'],
            ['Amoxicillin', '250mg', 'Once a day', '3 days', 'Before food'],
            ['Cough Syrup', '10ml', 'Twice a day', '4 days', 'Shake well before use'],
            ['Antacid', '1 tablet', 'After meals', '5 days', 'Avoid spicy food'],
        ];

        $prescriptions = Prescription::all();

        foreach ($prescriptions as $prescription) {
            $medCount = rand(1, 3);
            $selectedMeds = collect($medicineList)->random($medCount);

            foreach ($selectedMeds as $med) {
                Medication::create([
                    'prescription_id' => $prescription->id,
                    'medicine_name'   => $med[0],
                    'dosage'          => $med[1],
                    'frequency'       => $med[2],
                    'duration'        => $med[3],
                    'instructions'    => $med[4],
                ]);
            }
        }
    }
}

