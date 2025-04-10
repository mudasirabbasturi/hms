<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Patient;
use App\Models\User;
use App\Models\Department;
use App\Models\Appointment;
use App\Models\Prescription;
use Inertia\Inertia;

class PrescriptionController extends Controller
{
    public function Index()
    {
        $prescriptions = Prescription::select(
            'prescriptions.*',
            'users.name as doctor_name',
            'patients.name as patient_name',
            'appointments.token_number as token_number'
            )
        ->join('users', 'prescriptions.doctor_id', '=', 'users.id')
        ->join('patients', 'prescriptions.patient_id', '=', 'patients.id')
        ->leftJoin('appointments', 'prescriptions.appointment_id', '=', 'appointments.id')
        ->orderBy('prescriptions.created_at', 'desc')
        ->orderBy('prescriptions.id', 'desc')->cursor();

        $doctors = User::select('id', 'name')->where('type', 'doctor')->cursor();
        $patients = Patient::cursor();

        return inertia('Components/PatientRecord/Prescription/Index', [
        'prescriptions' => $prescriptions,
        'doctors' => $doctors,
        'patients' => $patients,
        ]);
    }

    public function ShowPatientPrescriptions($id) {
        $prescriptions = Prescription::select(
            'prescriptions.*',
            'users.name as doctor_name',
            'appointments.token_number as token_number'
            )
        ->join('users', 'prescriptions.doctor_id', '=', 'users.id')
        ->leftJoin('appointments', 'prescriptions.appointment_id', '=', 'appointments.id')
        ->orderBy('prescriptions.created_at', 'desc')
        ->orderBy('prescriptions.id', 'desc')->cursor();
        $doctors = User::select('id', 'name')->where('type', 'doctor')->cursor();
        return inertia('Components/PatientRecord/Prescription/ShowPatientPrescription', [
        'prescriptions' => $prescriptions,
        'doctors' => $doctors,
        ]);
    }

    public function Store(Request $request)
    {
        $validatedData = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:users,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'diagnosis' => 'nullable|string',
            'notes' => 'nullable|string',
            'prescribed_at' => 'required|date',
        ]);
        Prescription::create($validatedData);
        return back()->with('message', 'Prescription added successfully!.');
    }

    public function Update(Request $request, $id ) {
        $prescriptions = Prescription::findOrFail($id);
        $validatedData = $request->validate([
            'appointment_id' => 'nullable|exists:appointments,id',
            'diagnosis' => 'nullable|string',
            'notes' => 'nullable|string',
            'prescribed_at' => 'required|date',
        ]);
        $prescriptions->update($validatedData);
        return back()->with('message', ' Prescription Updated Successfully!.');
    }

    public function Destroy($id) {
        $prescription = Prescription::findOrFail($id);
        $prescription->delete();
        return back()->with('message', 'Prescription Deleted Successfully!.');
    }

    public function getByPatient($id)
    {
        return Prescription::where('patient_id', $id)->get();
    }
}
