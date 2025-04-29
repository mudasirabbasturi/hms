<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function Index()
    {
        $invoices = DB::table('invoices')
        ->leftJoin('patients', 'invoices.patient_id', '=', 'patients.id')
        ->select(
            'invoices.*',
            'patients.name as patient_name',
        )
        ->orderByDesc('created_at')
        ->orderByDesc('id')
        ->cursor();
        $patients = DB::table('patients')->cursor();
        $appointments = DB::table('appointments')->cursor();
        return inertia('Components/Invoice/Index', [
            'invoices' => $invoices,
            'patients' => $patients,
        ]);
    }
}
