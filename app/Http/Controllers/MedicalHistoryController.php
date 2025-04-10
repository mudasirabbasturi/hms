<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\MedicalHistory;
use App\Models\Patient;
use Inertia\Inertia;

class MedicalHistoryController extends Controller
{

    public function Index()
    {
        $histories = DB::table('medical_histories')
            ->select(
                'medical_histories.*',
                'patients.name as patient_name',
            )
            ->join('patients', 'medical_histories.patient_id', '=', 'patients.id')
            ->orderBy('medical_histories.created_at', 'desc')
            ->orderBy('medical_histories.id', 'desc')
            ->cursor();
        $patients = Patient::cursor();
        return inertia('Components/PatientRecord/MedicalHistory/Index', [
            'histories' => $histories,
            'patients' => $patients,
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'condition' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'diagnosed_at' => 'nullable|date',
            'resolved_at' => 'nullable|date',
            'is_chronic' => 'required|boolean',
        ]);
    
        MedicalHistory::create($validatedData);
        return back()->with('message', 'Medical history added successfully!');
    }    

    public function Update(Request $request, $id ) {
        $history = MedicalHistory::findOrFail($id);
        $validatedData = $request->validate([
            'condition' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'diagnosed_at' => 'nullable|date',
            'resolved_at' => 'nullable|date',
            'is_chronic' => 'required|boolean',
        ]);
        $history->update($validatedData);
        return back()->with('message', ' Medical history Updated Successfully!.');
    }

    public function Destroy($id) {
        $history = MedicalHistory::findOrFail($id);
        $history->delete();
        return back()->with('message', 'Medical history Deleted Successfully!.');
    }
}
