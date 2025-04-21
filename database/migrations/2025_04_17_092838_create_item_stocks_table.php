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
        Schema::create('item_stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained()->cascadeOnDelete();
            $table->string('batch_no')->nullable();
            $table->date('expiry_date')->nullable();
            $table->integer('total_qty');
            $table->decimal('unit_cost', 10, 2);
            $table->decimal('total_cost', 10, 2);
            $table->decimal('retail_price', 10, 2);
            $table->decimal('net_retail_price', 10, 2)->nullable();
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('sales_tax', 10, 2)->default(0);
            $table->decimal('net_value', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_stocks');
    }
};
