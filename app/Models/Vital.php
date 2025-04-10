<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vital extends Model
{
    protected $fillable = [
        'patient_id',
        'appointment_id',
        'pulse',
        'temperature',
        'systolic_bp',
        'diastolic_bp',
        'respiratory_rate',
        'blood_sugar',
        'weight',
        'height',
        'bmi',
        'bsa',
        'oxygen_saturation',
    ];
}