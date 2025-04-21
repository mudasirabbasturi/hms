<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Medication extends Model
{
    use HasFactory;
    protected $fillable = [
        'medical_record_id',
        'name',
        'duration',
        'morning',
        'afternoon',
        'evening',
        'night',
        'route',
        'instructions',
    ];
}
