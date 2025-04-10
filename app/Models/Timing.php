<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Timing extends Model
{
    use HasFactory;
    protected $fillable = [ 
        'user_id',
        'day',
        'start_time',
        'end_time',
        'duration',
        'is_available',
        'shift'
    ];
}
