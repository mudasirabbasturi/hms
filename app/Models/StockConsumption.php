<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class StockConsumption extends Model
{
    use HasFactory;
    protected $fillable = [
        "item_stock_id",
        "item_id",
        "consumed_qty",
        "consumption_type",
        "template_name",
        "added_by",
        "comment",
        "total_cost",
        "total_retail_price",
    ]; 
}