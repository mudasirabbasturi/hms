<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MedicalRecord extends Model
{
    use HasFactory;
    protected $fillable = [
        'patient_id',
        'user_id',
        'complaint',
        'examination',
        'treatment',
        'prescription',
        'medical_history',
    ];
}
