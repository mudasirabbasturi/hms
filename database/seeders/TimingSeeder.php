<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Timing;
use Illuminate\Support\Facades\DB;
class TimingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::take(20)->get();
        $days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $shifts = ["Morning", "Afternoon", "Evening", "Night"];
        foreach ($users as $user) {
            $unavailableDay = $days[array_rand($days)];
            foreach ($days as $day) {
                $isAvailable = $day !== $unavailableDay;
                $startHour = rand(6, 20);
                $startMinute = rand(0, 59);
                $startTime = sprintf('%02d:%02d:00', $startHour, $startMinute);
                $duration = rand(1, 30);
                $endHour = $startHour + 1; 
                $endMinute = rand(0, 59);
                $endTime = sprintf('%02d:%02d:00', $endHour, $endMinute);
                Timing::create([
                    'user_id'    => $user->id,
                    'day'        => $day,
                    'start_time' => $startTime,
                    'end_time'   => $endTime,
                    'duration'   => $duration,
                    'is_available' => $isAvailable,
                    'shift'      => $shifts[array_rand($shifts)],
                ]);
            }
        }
    }
}
