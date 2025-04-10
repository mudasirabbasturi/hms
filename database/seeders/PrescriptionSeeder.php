<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Prescription;
use App\Models\User;
use App\Models\Patient;
use App\Models\Appointment;
use Illuminate\Support\Str;


class PrescriptionSeeder extends Seeder
{
    public function run(): void
    {
        $doctors = User::where('type', 'doctor')->get();
        $patients = Patient::all();

        foreach ($patients as $patient) {
            $doctor = $doctors->random();
            $appointment = Appointment::where('patient_id', $patient->id)->latest()->first();
            Prescription::create([
                'patient_id'     => $patient->id,
                'doctor_id'      => $doctor->id,
                'appointment_id' => $appointment?->id,
                'diagnosis'      => 'General illness or diagnosis for patient #' . $patient->id,
                'notes'          => 'Prescribed by Dr. ' . $doctor->name,
                'prescribed_at'  => now()->subDays(rand(0, 10)), 
            ]);
        }
    }
}
