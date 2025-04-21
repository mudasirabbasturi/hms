<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ItemStock extends Model
{
    use HasFactory;
    protected $fillable = [
        "item_id",
        "batch_no",
        "expiry_date",
        "total_qty",
        "unit_cost",
        "total_cost",
        "retail_price",
        "net_retail_price",
        "discount",
        "sales_tax",
        "net_value",
    ];
}