<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Manufacturer extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "address",
        "contact_email",
        "contact_phone",
    ];
}
