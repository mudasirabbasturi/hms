<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Appointment extends Model
{
    use HasFactory;
    protected $fillable = [
        "user_id",
        "patient_id",
        "status",
        "token_number",
        "appointment_date",
        "start_time",
        "end_time",
        "appointment_type",
        "comment"
    ];
}