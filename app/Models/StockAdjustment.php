<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class StockAdjustment extends Model
{
    use HasFactory;
    protected $fillable = [
        "item_stock_id",
        "adjusted_qty",
        "reason",
    ]; 
}