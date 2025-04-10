<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\User;
use App\Models\Patient;
use App\Models\Appointment;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // For appointment
        $doctors = User::where('type', 'doctor')->get();
        $patients = Patient::all();
        foreach ($patients as $patient) {
            $doctor = $doctors->random();
            Appointment::factory()->create([
                'user_id' => $doctor->id,
                'patient_id' => $patient->id,
                'appointment_type' => 'token',
                'token_number' => $this->generateUniqueToken($patient->id)
            ]);
        }
    }

    private function generateUniqueToken($patientId): string
    {
        do {
            $random = random_int(1000, 99999);
            $token = $patientId . '-' . $random;
        } while (Appointment::where('patient_id', $patientId)
                            ->where('token_number', $token)
                            ->exists());
        return $token;
    }
}
