<?php

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TimingController;
use App\Http\Controllers\ProcedureController;
use App\Http\Controllers\ShareController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\VitalController;
use App\Http\Controllers\MedicationController;
use App\Http\Controllers\MedicalHistoryController;

Route::get('/', function () {
    return inertia('Components/Home');
});

// Users
Route::get('/users/{type}', [UserController::class, 'Index'])->name('user.index');
Route::post('/user/store', [UserController::class, 'Store'])->name('user.store');
Route::get('/user/{id}', [UserController::class, 'Show'])->name('user.show');
Route::put('/user/{id}', [UserController::class, 'updateSingleColumn'])->name('user.update.single-column');
Route::put('/user/update/profile/{id}', [UserController::class, 'updateProfile'])->name('user.update.profile');
Route::delete('/user/{id}', [UserController::class, 'Destroy'])->name('user.destroy');

/** Departments Route Start */
Route::get('/departments', [DepartmentController::class, 'Index'])->name('department.index');
Route::post('/department/store', [DepartmentController::class, 'Store'])->name('department.store');
Route::get('/department/{id}', [DepartmentController::class, 'Edit'])->name('department.edit');
Route::put('/department/{id}', [DepartmentController::class, 'Update'])->name('department.update');
Route::delete('/department/{id}', [DepartmentController::class, 'Destroy'])->name('department.destroy');
/** Departments Route End */

// Patients
Route::get('/patients', [PatientController::class, 'Index'])->name('patients.index');
Route::post('/patient/store', [PatientController::class, 'Store'])->name('patient.store');
Route::get('/patient/view/{id}', [PatientController::class, 'View'])->name('patient.view');
Route::put('/patient/upate/column/{id}', [PatientController::class, 'updateSingleColumn'])->name('patient.update.single-column');
Route::delete('/patient/destroy/{id}', [PatientController::class, 'Destroy'])->name('patient.destroy');

// Prescriptions
Route::get('/prescriptions',[PrescriptionController::class, 'Index'])->name('prescriptions.index');
Route::get('/prescriptions/patient/{id}',[PrescriptionController::class, 'ShowPatientPrescriptions'])->name('show.patient.prescriptions');
Route::post('/prescription/store',[PrescriptionController::class, 'Store'])->name('prescription.store');
Route::put('/prescription/update/{id}',[PrescriptionController::class, 'Update'])->name('prescription.update');
Route::delete('/prescription/destroy/{id}',[PrescriptionController::class, 'Destroy'])->name('prescription.destroy');
Route::get('/prescription/by-patient/{id}', [PrescriptionController::class, 'getByPatient']);

// Vitals
Route::get('/vitals',[VitalController::class, 'Index'])->name('vitals.index');
Route::post('/vital/store',[VitalController::class, 'Store'])->name('vital.store');
Route::put('/vital/update/{id}',[VitalController::class, 'Update'])->name('vital.update');
Route::delete('/vital/destroy/{id}',[VitalController::class, 'Destroy'])->name('vital.destroy');

// Medications
Route::get('/medications',[MedicationController::class, 'Index'])->name('medications.index');
Route::post('/medication/store',[MedicationController::class, 'Store'])->name('medication.store');
Route::put('/medication/update/{id}',[MedicationController::class, 'Update'])->name('medication.update');
Route::delete('/medication/destroy/{id}',[MedicationController::class, 'Destroy'])->name('medication.destroy');

// Medical History
Route::get('/medical-histories',[MedicalHistoryController::class, 'Index'])->name('medical-histories.index');
Route::post('/medical-history/store',[MedicalHistoryController::class, 'Store'])->name('medical-history.store');
Route::put('/medical-history/update/{id}',[MedicalHistoryController::class, 'Update'])->name('medical-history.update');
Route::delete('/medical-history/destroy/{id}',[MedicalHistoryController::class, 'Destroy'])->name('medical-history.destroy');

// OPD Token
Route::get('/opd/token', [AppointmentController::class, 'TokenIndex'])->name('token.index');
Route::post('/opd/token/store', [AppointmentController::class, 'TokenStore'])->name('token.store');

Route::put('/opd/token/update/{id}', 
          [AppointmentController::class, 'TokenUpdate'])
          ->name('token.update');

Route::delete('/opd/token_consultation/destroy/{id}', 
             [AppointmentController::class, 'Destroy'])
             ->name('token_consultation.destroy');

Route::get('/appointments/by-patient/{id}', [AppointmentController::class, 'getByPatient']);