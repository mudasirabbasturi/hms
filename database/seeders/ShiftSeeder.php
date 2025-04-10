<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Shift;
use Illuminate\Support\Facades\DB;

class ShiftSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shifts = [
            'Morning Shift',
            'Afternoon Shift',
            'Evening Shift',
            'Night Shift',
            'Graveyard Shift',
            'Day Shift',
            'Swing Shift',
            'Split Shift',
            'Weekend Shift',
            'On-Call Shift',
            'Rotating Shift',
            'First Shift (8 AM - 4 PM)',
            'Second Shift (4 PM - 12 AM)',
            'Third Shift (12 AM - 8 AM)',
        ];

        foreach ($shifts as $shift) {
            Shift::create(['name' => $shift]);
        }
    }
}
