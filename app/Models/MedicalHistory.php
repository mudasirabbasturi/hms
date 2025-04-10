<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MedicalHistory extends Model
{
    use HasFactory;
    protected $fillable = [
        'patient_id',
        'condition',
        'notes',
        'diagnosed_at',
        'resolved_at',
        'is_chronic',
    ];
}
