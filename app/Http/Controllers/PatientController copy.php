<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\User;
use App\Models\Department;
use App\Models\Appointment;
use App\Models\Prescription;
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
        $patients = Patient::cursor();
        $patient = Patient::findOrFail($id);
        $profile = Storage::url($patient->profile);
        $departments = Department::cursor();
        $doctors = User::select('id', 'name')->where('type', 'doctor')->cursor();
        return Inertia::render('Components/Patient/Show', [
            'patient' => $patient,
            'profile' => $profile,
        ]);
    }

    // Update Patient Single Column Data 
    public function updateSingleColumn(Request $request, $id) {
        $patient = Patient::findOrFail($id);
        $validationRules = [];
        $value = [];
        if ($request->has('name')) {
            $validationRules['name'] = 'required|string|max:255';
            $value = "Name";
        }
        if ($request->has('gender')) {
            $validationRules['gender'] = 'required|string|in:Male,Female,Other';
            $value = "Gender";
        }
        if ($request->has('dob')) {
            $validationRules['dob'] = 'required|date';
            $value = "Date Of Birth";
        }
        if ($request->has('email')) {
            $validationRules['email'] = 'nullable|string|email|max:255|unique:patients,email,' . $patient->id;
            $value = "Email";
        }
        if ($request->has('phone')) {
            $validationRules['phone'] = 'nullable|string|min:8|max:20';
            $value = "Phone";
        }
        if ($request->has('cnic')) {
            $validationRules['cnic'] = 'nullable|string|unique:patients,cnic,' . $patient->id;
            $value = "CNIC Number";
        }
        if ($request->has('departments')) {
            $validationRules['departments'] = 'nullable|string';
            $value = "Departments";
        }
        if ($request->has('blood_group')) {
            $validationRules['blood_group'] = 'nullable|string|max:5';
            $value = "Blood Group";
        }
        if ($request->has('symptoms')) {
            $validationRules['symptoms'] = 'nullable|string';
            $value = "Symptoms";
        }
        if ($request->has('visit_purpose')) {
            $validationRules['visit_purpose'] = 'nullable|string|max:255';
            $value = "Purpose Of Visit";
        }
        if ($request->has('patient_father_name')) {
            $validationRules['patient_father_name'] = 'nullable|string|max:255';
            $value = "Patient Father Name";
        }
        if ($request->has('patient_mother_name')) {
            $validationRules['patient_mother_name'] = 'nullable|string|max:255';
            $value = "Patient Mother Name";
        }
        if ($request->has('patient_address')) {
            $validationRules['patient_address'] = 'nullable|string';
            $value = "Patient Address";
        }
        if ($request->has('insurance_name')) {
            $validationRules['insurance_name'] = 'nullable|string|max:255';
            $value = "Insurance Name";
        }
        if ($request->has('insurance_number')) {
            $validationRules['insurance_number'] = 'nullable|string|max:50';
            $value = "Insurance Number";
        }
        if ($request->has('insurance_holder')) {
            $validationRules['insurance_holder'] = 'nullable|string|max:255';
            $value = "Insurance Holder";
        }
        if ($request->has('insurance_type')) {
            $validationRules['insurance_type'] = 'nullable|string|max:255';
            $value = "Insurance Type";
        }
        if ($request->has('profile')) {
            $validationRules['profile'] = 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048';
            $value = "Profile";
        }
        $validatedData = $request->validate($validationRules);
        $patient->update($validatedData);
        return back()->with('message', $value . ' updated successfully!');
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