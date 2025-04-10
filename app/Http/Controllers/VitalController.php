<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Patient;
use App\Models\User;
use App\Models\Department;
use App\Models\Appointment;
use App\Models\Prescription;
use App\Models\Vital;
use Inertia\Inertia;

class VitalController extends Controller
{
    public function Index()
    {
        $vitals = Vital::select(
            'vitals.*',
            'patients.name as patient_name',
            'appointments.token_number as token_number'
            )
        ->join('patients', 'vitals.patient_id', '=', 'patients.id')
        ->leftJoin('appointments', 'vitals.appointment_id', '=', 'appointments.id')
        ->orderBy('vitals.created_at', 'desc')
        ->orderBy('vitals.id', 'desc')->cursor();

        $doctors = User::select('id', 'name')->where('type', 'doctor')->cursor();
        $patients = Patient::cursor();

        return inertia('Components/PatientRecord/Vitals/Index', [
        'vitals' => $vitals,
        'doctors' => $doctors,
        'patients' => $patients,
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'patient_id'         => 'required|exists:patients,id',
            'appointment_id'     => 'required|exists:appointments,id',
            'pulse'              => 'nullable|integer|min:0',
            'temperature'        => 'nullable|numeric|min:0|max:120',
            'systolic_bp'        => 'nullable|integer|min:0',
            'diastolic_bp'       => 'nullable|integer|min:0',
            'respiratory_rate'   => 'nullable|integer|min:0',
            'blood_sugar'        => 'nullable|numeric|min:0',
            'weight'             => 'nullable|numeric|min:0',
            'height'             => 'nullable|numeric|min:0',
            'bmi'                => 'nullable|numeric|min:0',
            'bsa'                => 'nullable|numeric|min:0',
            'oxygen_saturation'  => 'nullable|numeric|min:0|max:100',
        ]);
    
        Vital::create($validatedData);
        return back()->with('message', 'Vital added successfully!');
    }    

    public function Update(Request $request, $id ) {
        $vitals = Vital::findOrFail($id);
        $validatedData = $request->validate([
            'pulse'              => 'nullable|integer|min:0',
            'temperature'        => 'nullable|numeric|min:0|max:120',
            'systolic_bp'        => 'nullable|integer|min:0',
            'diastolic_bp'       => 'nullable|integer|min:0',
            'respiratory_rate'   => 'nullable|integer|min:0',
            'blood_sugar'        => 'nullable|numeric|min:0',
            'weight'             => 'nullable|numeric|min:0',
            'height'             => 'nullable|numeric|min:0',
            'bmi'                => 'nullable|numeric|min:0',
            'bsa'                => 'nullable|numeric|min:0',
            'oxygen_saturation'  => 'nullable|numeric|min:0|max:100',
        ]);
        $vitals->update($validatedData);
        return back()->with('message', ' Vital Updated Successfully!.');
    }

    public function Destroy($id) {
        $vitals = Vital::findOrFail($id);
        $vitals->delete();
        return back()->with('message', 'Vitals Deleted Successfully!.');
    }
}
