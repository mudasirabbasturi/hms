<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Patient>
 */
class PatientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'patient_id' => 'HMS' . strtoupper(Str::random(5)),
            'name' => $this->faker->name(),
            'gender' => $this->faker->randomElement(['Male', 'Female', 'Other']),
            'dob' => $this->faker->date('Y-m-d', '2005-12-31'),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->unique()->numerify('03#########'),
            'cnic' => $this->faker->unique()->numerify('#####-#######-#'),
            'blood_group' => $this->faker->randomElement(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
            'symptoms' => $this->faker->sentence(6),
            'visit_purpose' => $this->faker->randomElement(['General Checkup', 'Follow-up', 'Emergency', 'Consultation']),
            'patient_father_name' => $this->faker->name('male'),
            'patient_mother_name' => $this->faker->name('female'),
            'patient_address' => $this->faker->address(),
            'profile' => null,
            'insurance_name' => $this->faker->company(),
            'insurance_number' => $this->faker->numerify('INS-####-####'),
            'insurance_holder' => $this->faker->randomElement(['Self', 'Father', 'Mother', 'Spouse']),
            'insurance_type' => $this->faker->randomElement(['Public', 'Private', 'Company']),
        ];
    }
}
