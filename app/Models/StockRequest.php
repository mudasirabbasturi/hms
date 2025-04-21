<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class StockRequest extends Model
{
    use HasFactory;
    protected $fillable = [
        "requested_by",
        "department_id",
        "item_id",
        "requested_qty",
        "status",
    ]; 
}