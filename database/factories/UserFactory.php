<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $counter = 1; 
        $type = ['admin', 'doctor', 'receptionist', 'accountant', 'nurse'];
        $typeIndex = ($counter - 1) % count($type);
        return [
            'user_id' => 'HMS-' . str_pad($counter++, 5, '0', STR_PAD_LEFT),
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'gender' => $this->faker->randomElement(['male', 'female', 'other']),
            'phone' => $this->faker->phoneNumber(),
            'departments' => $this->faker->randomElement(['Cardiology', 'Neurology', 'Dermatology', 'Oncology', 'Orthopedics']),
            'designation' => $this->faker->randomElement(['Consultant', 'Senior Surgeon', 'Medical Director', 'Specialist']),
            
            'qualification' => implode(', ', [
                'MBBS - Completed on July 10, 2010',
                'FCPS (Cardiology) - Completed on August 15, 2015',
                'MD (Neurology) - Completed on June 20, 2017',
                'FRCS (Surgery) - Completed on December 5, 2012'
            ]),

            'service' => implode(', ', [
                'General Checkup',
                'Surgery',
                'Specialist Consultation',
                'Emergency Care',
                'Pediatric Care',
                'Cardiac Treatment'
            ]),
            'awards' => implode(', ', [
                'Best Cardiologist of the Year (2022)',
                'Excellence in Pediatric Surgery Award (2020)',
                'Best Medical Research Contribution (2019)',
                'Outstanding Service in Oncology (2021)'
            ]),

            'expertise' => implode(', ', [
                'Cardiovascular Surgery',
                'Pediatric Neurology',
                'Orthopedic Trauma',
                'Dermatology and Aesthetic Medicine',
                'Oncology and Chemotherapy'
            ]),

            'registrations' => implode(', ', [
                'Pakistan Medical and Dental Council (PMDC) - Reg No: 12345678',
                'General Medical Council (GMC) UK - Reg No: 987654',
                'American Board of Internal Medicine - Reg No: ABIM20201234',
                'Dubai Health Authority (DHA) - Reg No: DHA-45678'
            ]),

            'professional_memberships' => implode(', ', [
                'Member of the American Medical Association (AMA)',
                'Fellow of the Royal College of Surgeons (FRCS)',
                'Member of the European Society of Cardiology (ESC)',
                'Member of the Pakistan Society of Neurology'
            ]),

            'languages' => implode(', ', $this->faker->randomElements(['English', 'Urdu', 'Arabic', 'French', 'Spanish'], 2)),

            'experience' => implode(', ', [
                '10+ years as a Consultant Cardiologist at XYZ Hospital',
                '5 years as a Neurosurgeon at ABC Medical Center',
                '8 years of private practice in Dermatology and Aesthetic Medicine',
                '15 years of experience in Pediatric Surgery'
            ]),

            'degree_completion_date' => implode(', ', [
                'MBBS - Completed on July 10, 2010',
                'FCPS (Cardiology) - Completed on August 15, 2015',
                'MD (Neurology) - Completed on June 20, 2017'
            ]),

            'summary_pmdc' => implode(', ', [
                'PMDC Reg No: 56789-ABC',
                'PMDC Reg No: 98765-XYZ',
                'PMDC Reg No: 12345-PQR'
            ]),
            'type' => $type[$typeIndex],
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
