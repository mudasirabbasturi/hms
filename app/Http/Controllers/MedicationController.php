<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Patient;
use App\Models\User;
use App\Models\Department;
use App\Models\Appointment;
use App\Models\Prescription;
use App\Models\Medication;
use Inertia\Inertia;

class MedicationController extends Controller
{
    // public function Index()
    // {
    //     $medications = DB::table('medications')
    //         ->select(
    //             'medications.*',
    //             'patients.name as patient_name',
    //             'users.name as doctor_name',
    //             'appointments.token_number as token_number'
    //         )
    //         ->join('prescriptions', 'medications.prescription_id', '=', 'prescriptions.id')
    //         ->join('patients', 'prescriptions.patient_id', '=', 'patients.id')
    //         ->join('users', 'prescriptions.doctor_id', '=', 'users.id')
    //         ->leftJoin('appointments', 'prescriptions.appointment_id', '=', 'appointments.id')
    //         ->orderBy('medications.created_at', 'desc')
    //         ->orderBy('medications.id', 'desc')
    //         ->cursor();
    
    //     $doctors = User::select('id', 'name')->where('type', 'doctor')->cursor();
    //     $patients = Patient::cursor();
    
    //     return inertia('Components/PatientRecord/Medication/Index', [
    //         'medications' => $medications,
    //         'doctors' => $doctors,
    //         'patients' => $patients,
    //     ]);
    // }
    public function Index()
    {
        $medications = DB::table('medications')
            ->select(
                'medications.*',
                'patients.name as patient_name',
                'users.name as doctor_name',
                'appointments.token_number as token_number',
                'prescriptions.diagnosis'  // Include the diagnosis field from the prescriptions table
            )
            ->join('prescriptions', 'medications.prescription_id', '=', 'prescriptions.id')
            ->join('patients', 'prescriptions.patient_id', '=', 'patients.id')
            ->join('users', 'prescriptions.doctor_id', '=', 'users.id')
            ->leftJoin('appointments', 'prescriptions.appointment_id', '=', 'appointments.id')
            ->orderBy('medications.created_at', 'desc')
            ->orderBy('medications.id', 'desc')
            ->cursor();

        $doctors = User::select('id', 'name')->where('type', 'doctor')->cursor();
        $patients = Patient::cursor();

        return inertia('Components/PatientRecord/Medication/Index', [
            'medications' => $medications,
            'doctors' => $doctors,
            'patients' => $patients,
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'prescription_id' => 'required|exists:prescriptions,id',
            'medicine_name' => 'required|string|max:255',
            'dosage' => 'nullable|string|max:255',
            'frequency' => 'nullable|string|max:255',
            'duration' => 'nullable|string|max:255',
            'instructions' => 'nullable|string',
        ]);
    
        Medication::create($validatedData);
        return back()->with('message', 'Medication added successfully!');
    }    

    public function Update(Request $request, $id ) {
        $medications = Medication::findOrFail($id);
        $validatedData = $request->validate([
            'medicine_name' => 'required|string|max:255',
            'dosage' => 'nullable|string|max:255',
            'frequency' => 'nullable|string|max:255',
            'duration' => 'nullable|string|max:255',
            'instructions' => 'nullable|string',
        ]);
        $medications->update($validatedData);
        return back()->with('message', ' Medication Updated Successfully!.');
    }

    public function Destroy($id) {
        $medication = Medication::findOrFail($id);
        $medication->delete();
        return back()->with('message', 'Medication Deleted Successfully!.');
    }
    
}
