<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Patient extends Model
{
    use HasFactory;
    protected $fillable = [
        'patient_id',
        'departments',
        'name',
        'gender',
        'dob',
        'email',
        'phone',
        'cnic',
        'blood_group',
        'symptoms',
        'visit_purpose',
        'patient_father_name',
        'patient_mother_name',
        'patient_address',
        'profile',
        'insurance_name',
        'insurance_number',
        'insurance_holder',
        'insurance_type',
    ];
      protected static function boot()
      {
          parent::boot();
          static::creating(function ($patient) {
              $patient->patient_id = self::generatePatientId();
          });
      }
      private static function generatePatientId()
      {
          $lastPatient = self::latest('id')->first();
          $nextNumber = $lastPatient ? ((int) str_replace('HMS-P-', '', $lastPatient->patient_id) + 1) : 10001;
          return 'HMS-P-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
      }
      public function appointments(): HasMany
      {
         return $this->hasMany(Appointment::class, 'patient_id');
      }
      public function doctors(): BelongsToMany
      {
        return $this->belongsToMany(User::class, 'appointments', 'patient_id', 'user_id')
                    ->withTimestamps()
                    ->withPivot('token_number', 'status');
      }
}