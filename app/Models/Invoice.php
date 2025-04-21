<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Invoice extends Model
{
    use HasFactory;
    protected $fillable = [
        "invoice_number",
        "item_id",
        "patient_id",
        "doctor_id",
        "appointment_id",
        "invoice_date",
        "subtotal",
        "discount",
        "tax",
        "total",
        "status",
        "payment_method",
        "notes",
    ];
}