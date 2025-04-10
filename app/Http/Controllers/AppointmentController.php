<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\User;
use App\Models\Procedure;
use App\Models\Share;
use Inertia\Inertia;

class AppointmentController extends Controller
{

    public function TokenIndex() 
    {
        $tokens = Appointment::select(
            'appointments.*',
            'users.name as doctor_name',
            'patients.name as patient_name')
        ->join('users', 'appointments.user_id', '=', 'users.id')
        ->join('patients', 'appointments.patient_id', '=', 'patients.id')
        ->where('appointment_type', 'token')
        ->orderBy('appointments.created_at', 'desc')
        ->orderBy('appointments.id', 'desc')->cursor();
        $doctors = User::select('id', 'name')->where('type', 'doctor')->cursor();
        $patients = Patient::cursor();
        return inertia('Components/Opd/Token/Index', [
            'tokens' => $tokens,
            'doctors' => $doctors,
            'patients' => $patients,
        ]);
    }

    private function generateUniqueToken($patientId)
    {
        do {
            $random = random_int(1000, 99999);
            $token = $patientId . '-' . $random;
        } while (\App\Models\Appointment::where('patient_id', $patientId)
            ->where('token_number', $token)
            ->exists());
        return $token;
    }

    public function TokenStore(Request $request) 
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'patient_id' => 'required|exists:patients,id',
            'status' => 'nullable|in:Scheduled,Confirmed,Checked In,Checked Out,No Show',
            'appointment_date' => 'nullable|date',
            'start_time' => 'nullable|required_if:appointment_type,consultation|date_format:H:i:s',
            'end_time' => 'nullable|required_if:appointment_type,consultation|date_format:H:i:s|after:start_time',
            'appointment_type' => 'required|in:token,consultation',
            ],
            [
                'user_id.required' => 'Please select a doctor.',
                'user_id.exists' => 'The selected doctor does not exist.',
                'patient_id.required' => 'Please select a patient.',
                'patient_id.exists' => 'The selected patient does not exist.',
                'appointment_date.date' => 'Invalid appointment date format.',
                'start_time.required_if' => 'Start time is required for consultation appointments.',
                'end_time.required_if' => 'End time is required for consultation appointments.',
                'end_time.after' => 'End time must be after start time.',
                'appointment_type.required' => 'Please select an appointment type.',
                'appointment_type.in' => 'Invalid appointment type.',
            ]
        );
        if ($validatedData['appointment_type'] === 'token') {
            $validatedData['token_number'] = $this->generateUniqueToken($validatedData['patient_id']);
        }
        Appointment::create($validatedData);
        return redirect()->back()->with('message', 'Token added successfully!');
    }

    public function TokenUpdate(Request $request, $id)
    {
        $validatedData = $request->validate([
            'status' => 'nullable|in:Scheduled,Confirmed,Checked In,Checked Out,No Show',
            'appointment_date' => 'nullable|date',
            'comment' => 'nullable|string|max:1000',
        ], [
            'appointment_date.date' => 'Invalid appointment date format.',
            'status.in' => 'Invalid status selected.',
        ]);
        $appointment = Appointment::findOrFail($id);
        $appointment->update($validatedData);
        return redirect()->back()->with('message', 'Token updated successfully!');
    }

    public function Destroy($id) 
    {
        $token = Appointment::find($id);
        if ($token) {
            $token->delete();
            return redirect()->back()->with('message', 'Token deleted successfully!');
        }
        return redirect()->back()->with('message', 'Token not found');
    }

    public function getByPatient($id)
    {
        return Appointment::where('patient_id', $id)->get();
    }

}
