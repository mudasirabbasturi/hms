<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Get existing item, patient, doctor (user), and appointment IDs
        $items = DB::table('items')->pluck('id')->toArray();
        $patients = DB::table('patients')->pluck('id')->toArray();
        $doctors = DB::table('users')->pluck('id')->toArray();
        $appointments = DB::table('appointments')->pluck('id')->toArray();

        // Check if necessary data exists
        if (empty($items)) {
            $this->command->warn('No items found. Seed Items table first.');
            return;
        }
        if (empty($patients)) {
            $this->command->warn('No patients found. Seed Patients table first.');
            return;
        }
        if (empty($appointments)) {
            $this->command->warn('No appointments found. Seed Appointments table first.');
            return;
        }

        // Generate 10 random invoices
        for ($i = 0; $i < 10; $i++) {
            $itemId = $faker->randomElement($items);
            $patientId = $faker->randomElement($patients);
            $doctorId = $faker->optional()->randomElement($doctors);
            $appointmentId = $faker->optional()->randomElement($appointments);
            
            // Random calculations for invoice details
            $subtotal = $faker->randomFloat(2, 100, 1000);  // Random subtotal between 100 and 1000
            $discount = $faker->randomFloat(2, 0, 100);  // Random discount between 0 and 100
            $tax = $subtotal * 0.10;  // 10% tax
            $total = $subtotal - $discount + $tax;  // Total calculation

            DB::table('invoices')->insert([
                'invoice_number' => strtoupper($faker->bothify('INV-####-#####')),
                'item_id' => $itemId,
                'patient_id' => $patientId,
                'doctor_id' => $doctorId,
                'appointment_id' => $appointmentId,
                'invoice_date' => $faker->date(),
                'subtotal' => $subtotal,
                'discount' => $discount,
                'tax' => $tax,
                'total' => $total,
                'status' => $faker->randomElement(['unpaid', 'paid', 'partially paid', 'cancelled']),
                'payment_method' => $faker->randomElement(['credit card', 'cash', 'insurance', 'bank transfer']),
                'notes' => $faker->optional()->sentence,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
