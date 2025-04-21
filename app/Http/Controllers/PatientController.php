<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\User;
use App\Models\Department;
use App\Models\Appointment;
use App\Models\MedicalRecord;
use App\Models\Medication;
use App\Models\Template;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;


class PatientController extends Controller
{
    // Patient Main Index
    public function Index( Request $request ) {
        $patients = Patient::orderBy('created_at', 'desc')
                             ->orderBy('id', 'desc')
                             ->cursor();
        $departments = Department::cursor();
        return inertia('Components/Patient/Index', [
            'patients' => $patients,
            'departments' => $departments,
        ]);
    }

    // Store Patient
    public function Store ( Request $request ) {

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'gender' => 'required|string|in:Male,Female,Other',
            'dob' => 'required|date',
            'email' => 'nullable|string|email|max:255|unique:patients,email',
            'phone' => 'nullable|string|min:8|max:20',
            'cnic' => 'nullable|string|unique:patients,cnic',
            'blood_group' => 'nullable|string|max:5',
            'symptoms' => 'nullable|string',
            'visit_purpose' => 'nullable|string|max:255',
            'patient_father_name' => 'nullable|string|max:255',
            'patient_mother_name' => 'nullable|string|max:255',
            'patient_address' => 'nullable|string',
            'insurance_name' => 'nullable|string|max:255',
            'insurance_number' => 'nullable|string|max:50',
            'insurance_holder' => 'nullable|string|max:255',
            'insurance_type' => 'nullable|string|max:255',
            'profile' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        if ($request->hasFile('profile')) {
            $imagePath = $request->file('profile')->store('profiles', 'public'); 
            $validatedData['profile'] = $imagePath; 
        }
        Patient::create($validatedData);
        return redirect()->back()->with('message', 'Patient added successfully!');
        
    }

    // View Single Patient Record
    public function View(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);
        $profile = Storage::url($patient->profile);
        $medicalRecords = MedicalRecord::where('patient_id', $id)
        ->orderByDesc('created_at')
        ->orderByDesc('id')
        ->cursor();
        $doctors = User::where('type', "doctor")->cursor();
        $tokens = Appointment::where('patient_id', $id)->cursor();
        $templates = Template::cursor();
        $departments = Department::cursor();
        return Inertia::render('Components/Patient/Show', [
            'patient' => $patient,
            'profile' => $profile,
            'medicalRecords' => $medicalRecords,
            'doctors' => $doctors,
            'templates' => $templates,
            'departments' => $departments,
            'tokens' => $tokens,
        ]);
    }

    public function Update(Request $request, $id)
    {
        $profile = Patient::findOrFail($id);
        $updateData = $request->all();
        $profile->update($updateData);
        return redirect()->back()->with('message', 'Profile Updated Successfully!');
    }

    // Delete Patient Record
    public function Destroy( Request $request, $id ) {
        $patient = Patient::find($id);
        if ( $patient ) {
            $patient->delete();
            return redirect()->back()->with('message', 'Patient deleted successfully!');
        }
        else {
            return redirect()->back()->with('message', 'Patient Does not found!');
        }
    }
}