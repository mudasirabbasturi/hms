<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class PurchaseOrder extends Model
{
    use HasFactory;
    protected $fillable = [
        "purchase_requisition_id",
        "supplier_id",
        "order_date",
        "status",
    ]; 
}