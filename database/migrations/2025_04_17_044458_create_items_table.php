<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('barcode')->nullable()->unique();
            $table->foreignId('category_id')->nullable()->constrained(table: 'categories')->nullOnDelete();
            $table->foreignId('manufacturer_id')->nullable()->constrained()->nullOnDelete();
            $table->string('unit');
            $table->integer('reorder_level')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};

/**
 
Status	
Name	
Generic Name	
Barcode	
Category	
Manufacturer	
Supplier(s)	
Stocking unit	
Conversion unit	
Unit Cost	
Retail Price	
ReOrdering level	
Available Qty.	
Expired Qty.	
Rack#	
Action
 */