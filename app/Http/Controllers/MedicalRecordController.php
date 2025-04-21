<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MedicalRecord;
use App\Models\User;
use App\Models\Patient;
use App\Models\Template;

class MedicalRecordController extends Controller
{

    public function Index()
    {

        $medicalRecords = MedicalRecord::select(
            'medical_records.*',
            'users.name as user_name',
            'users.type as user_type',
            'patients.name as patient_name')
            ->join('users', 'medical_records.user_id', '=', 'users.id')
            ->join('patients', 'medical_records.patient_id', '=', 'patients.id')
            ->orderBy('medical_records.created_at', 'desc')
            ->orderBy('medical_records.id', 'desc')->cursor();
        $users = User::cursor();
        $doctors = User::where('type', "doctor")->cursor();
        $patients = Patient::cursor();
        $templates = Template::cursor();

        return inertia('Components/MedicalRecord/Index', [
            'medicalRecords' => $medicalRecords,
            'users' => $users,
            'doctors' => $doctors,
            'patients' => $patients,
            'templates' => $templates,
        ]);

    }


    public function Store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'patient_id' => 'required|exists:patients,id',
            'complaint' => 'nullable|string',
            'examination' => 'nullable|string',
            'treatment' => 'nullable|string',
            'prescription' => 'nullable|string',
            'medical_history' => 'nullable|string',
        ]);
    
        MedicalRecord::create($validated);
    
        return redirect()->back()->with('message', 'Medical Record added successfully!');
    }
    
    public function Update(Request $request, $id)
    {
        $medicalRecord = MedicalRecord::findOrFail($id);
        $updateData = $request->all();
        return redirect()->back()->with('message', 'Medical record updated successfully!');
    }
    
    
    public function Destroy($id)
    {
        $medicalRecord = MedicalRecord::findOrFail($id);
        $medicalRecord->delete();
        return redirect()->back()->with('message', 'Medical Record deleted successfully!');
    }
}
