<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Invoice extends Model
{
    use HasFactory;
    protected $fillable = [
        "invoice_number",
        "patient_id",
        "invoice_date",
        "subtotal",
        "discount",
        "tax",
        "total",
        "total_paid",
        "status",
        "payment_method",
        "notes",
    ];
}