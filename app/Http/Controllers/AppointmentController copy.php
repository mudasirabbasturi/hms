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
    public function Index( Request $request ) {
        $appointments = Appointment::select(
            'appointments.id',
            'appointments.user_id', 
            'appointments.patient_id', 
            'appointments.token_number', 
            'appointments.status',
            /** Vitals Start */
            'appointments.pulse',
            'appointments.temperature',
            'appointments.systolic_bp',
            'appointments.diastolic_bp',
            'appointments.respiratory_rate',
            'appointments.blood_sugar',
            'appointments.weight',
            'appointments.height',
            'appointments.bmi',
            'appointments.bsa',
            'appointments.oxygen_saturation',
            /** Vitals Start end */
            'appointments.created_at as start',
            'appointments.appointment_date',
            'users.name as doctor_name', 
            'patients.name as patient_name'
        )
        ->join('users', 'appointments.user_id', '=', 'users.id')   
        ->join('patients', 'appointments.patient_id', '=', 'patients.id')
        ->get();
        $doctors = User::select('id', 'name')->where('role', '=', 'doctor')->get();
        $patients = Patient::select('id', 'name')->get();
        $procedure = Procedure::select('id','name')->get();
        return Inertia::render('Components/Opd/Index', 
        [
            'appointments' => $appointments,
            'doctors' => $doctors,
            'patients' => $patients,
            'procedure' => $procedure,
        ]);
    }

    public function OpdDoctor(Request $request, $id)
    {
        $doctor = User::where('role', 'doctor')->findOrFail($id);
        $doctors = User::where('role', 'doctor')->select('id', 'name')->get();
        $appointments = Appointment::select(
            'appointments.id',
            'appointments.user_id',
            'appointments.patient_id',
            'appointments.token_number',
            'appointments.appointment_date',
            'appointments.status',
            /** Vitals Start */
            'appointments.pulse',
            'appointments.temperature',
            'appointments.systolic_bp',
            'appointments.diastolic_bp',
            'appointments.respiratory_rate',
            'appointments.blood_sugar',
            'appointments.weight',
            'appointments.height',
            'appointments.bmi',
            'appointments.bsa',
            'appointments.oxygen_saturation',
            /** Vitals Start end */
            'appointments.created_at as start',
            'users.name as doctor_name',
            'patients.name as patient_name'
        )
        ->join('users', 'appointments.user_id', '=', 'users.id') 
        ->join('patients', 'appointments.patient_id', '=', 'patients.id')
        ->where('appointments.user_id', $id)
        ->get();
        return Inertia::render('Components/Opd/Doctor', [
            'doctor' => $doctor,
            'appointments' => $appointments,
            'doctors' => $doctors,
        ]);
    }
    public function  Create( Request $request, $id ) {
        $appoinment = Appointment::find($id);
    }

    public function  Store( Request $request ) {

        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'patient_id' => 'required|exists:patients,id',
            'status' => 'nullable|in:Scheduled,Confirmed,Checked In,Checked Out,No Show',
            'token_number' => 'nullable|required_if:appointment_type,token',
            'appointment_date' => 'nullable|date',
            'start_time' => 'nullable|required_if:appointment_type,consultation|date_format:H:i:s',
            'end_time' => 'nullable|required_if:appointment_type,consultation|date_format:H:i:s|after:start_time',
            'appointment_type' => 'required|in:token,consultation',
            // Vitals
            'pulse' => 'nullable|integer|min:30|max:200',
            'temperature' => 'nullable|numeric|min:30|max:45',
            'systolic_bp' => 'nullable|integer|min:80|max:200',
            'diastolic_bp' => 'nullable|integer|min:40|max:130',
            'respiratory_rate' => 'nullable|integer|min:10|max:50',
            'blood_sugar' => 'nullable|numeric|min:50|max:500',
            'weight' => 'nullable|numeric|min:1|max:500',
            'height' => 'nullable|numeric|min:30|max:250',
            'bmi' => 'nullable|numeric|min:10|max:50',
            'bsa' => 'nullable|numeric|min:0.5|max:3.0',
            'oxygen_saturation' => 'nullable|numeric|min:50|max:100',
    
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
                'token_number.required_if' => 'Token number is required for token-based appointments.',
            ]
        );
        Appointment::create($validatedData);
        return redirect()->back()->with('message', 'Appointment added successfully!');
    }

    public function Edit( Request $request, $id ) {
        $appoinment = Appointment::find($id);
    }

    public function Update( Request $request, $id ) {
        $appoinment = Appointment::find($id);
    }

    public function Destroy( Request $request, $id ) {
        $appoinment = Appointment::find($id);
        if ($appoinment) {
            $appoinment->delete();
            return redirect()->back()->with('message', 'Token deleted successfully!');
        }
        return redirect()->back()->with('message', 'Patient does not found');
    }

}
