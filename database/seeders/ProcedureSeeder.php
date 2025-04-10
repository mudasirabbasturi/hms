<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $baseDepartments = [
            "OPD", "IPD", "Cardiology", "Neurology", "Orthopedics", "Pediatrics",
            "Oncology", "Gastroenterology", "Pulmonology", "Endocrinology", "Nephrology",
            "Dermatology", "Urology", "Hematology", "Ophthalmology", "Radiology",
            "Anesthesiology", "Rheumatology", "Gynecology", "Obstetrics", "Psychiatry",
            "Emergency Medicine", "General Surgery", "Plastic Surgery", "Vascular Surgery",
            "Thoracic Surgery", "Neurosurgery", "Palliative Care", "Infectious Diseases",
            "Geriatrics", "Rehabilitation Medicine", "Sports Medicine", "Pain Management",
            "Allergy and Immunology", "Pathology", "Otolaryngology (ENT)", "Clinical Pharmacology",
            "Nuclear Medicine", "Sleep Medicine", "Occupational Medicine", "Forensic Medicine",
            "Family Medicine", "Internal Medicine", "Critical Care Medicine", "Sexual Health",
            "Genetics", "Diabetes and Metabolism", "Toxicology", "Hyperbaric Medicine",
            "Podiatry", "Community Medicine", "Transplant Medicine",
        ];
        while (count($baseDepartments) < 150) {
            $baseDepartments[] = ucfirst($faker->word) . " Department";
        }
        $departments = array_slice($baseDepartments, 0, 150);
        $data = [];
        $counter = 1;
        foreach ($departments as $name) {
            $data[] = [
                'department_id' => 'DEP-' . str_pad($counter++, 3, '0', STR_PAD_LEFT),
                'name' => $name,
                'description' => $faker->sentence(),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('departments')->insert($data);
        $opdId = DB::table('departments')->where('name', 'OPD')->value('id');
        $ipdId = DB::table('departments')->where('name', 'IPD')->value('id');
        $updatedData = [];
        $departmentsWithoutParents = DB::table('departments')
            ->whereNotIn('name', ['OPD', 'IPD'])
            ->get();

        foreach ($departmentsWithoutParents as $department) {
            $randomParent = random_int(1, 3) === 1 ? $opdId : ($random_int(1, 3) === 2 ? $ipdId : null);
            $updatedData[] = [
                'id' => $department->id,
                'parent_id' => $randomParent,
            ];
        }
        foreach ($updatedData as $update) {
            DB::table('departments')->where('id', $update['id'])->update(['parent_id' => $update['parent_id']]);
        }
    }
}
