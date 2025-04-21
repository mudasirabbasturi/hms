<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Item extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "barcode",
        "category_id",
        "manufacturer_id",
        "unit",
        "reorder_level",
    ];
}