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

        // Generate additional random departments if needed
        while (count($baseDepartments) < 150) {
            $baseDepartments[] = ucfirst($faker->word) . " Department";
        }

        $departments = array_slice($baseDepartments, 0, 150);
        $data = [];
        $insertedDepartments = []; 
        foreach ($departments as $name) {
            $parentId = null;
            if ($name !== "OPD" && $name !== "IPD" && !empty($insertedDepartments)) {
                $parentId = $faker->randomElement([null, ...array_keys($insertedDepartments)]);
            }

            $departmentId = DB::table('departments')->insertGetId([
                'parent_id'   => $parentId,
                'name'        => $name,
                'description' => $faker->sentence(),
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);

            $insertedDepartments[$departmentId] = $name;
        }
    }
}
