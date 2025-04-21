<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'show',
        'choices',
    ];

    public function getChoicesAttribute($value)
    {
        return json_decode($value ?? '[]');
    }

    public function setChoicesAttribute($value)
    {
        $this->attributes['choices'] = json_encode($value ?? []);
    }
    
}