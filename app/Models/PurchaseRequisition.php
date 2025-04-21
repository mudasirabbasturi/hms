<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class PurchaseRequisition extends Model
{
    use HasFactory;
    protected $fillable = [
        "item_id",
        "supplier_id",
        "requested_qty",
        "notes",
    ];
}