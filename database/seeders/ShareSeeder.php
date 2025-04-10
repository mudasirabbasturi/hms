<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Share;
use App\Models\User;
use App\Models\Procedure;
use Illuminate\Support\Facades\DB;

class ShareSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $doctors = User::where('role', 'doctor')->get();
        foreach ($doctors as $doctor) {
            $procedures = Procedure::inRandomOrder()->limit(rand(5, 10))->get();
            $shares = [];
            foreach ($procedures as $procedure) {
                $shares[] = [
                    'user_id'   => $doctor->id,
                    'procedure_id'  => $procedure->id,
                    'procedure_name'  => $procedure->name,
                    'type'      => ['percent', 'value'][array_rand(['percent', 'value'])],
                    'value'     => rand(1, 100),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            Share::insert($shares);
        }
    }
}
