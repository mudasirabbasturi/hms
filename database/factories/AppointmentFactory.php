<?php

namespace Database\Factories;
use App\Models\User;
use App\Models\Patient;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Appointment>
 */
class AppointmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'status' => 'Scheduled',
            'appointment_type' => 'token',
            'appointment_date' => $this->faker->date(),
            'start_time' => now(),
            'end_time' => now()->addHour(),
            'comment' => $this->faker->sentence,
        ];
    }
}
