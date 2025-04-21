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
        Schema::create('stock_consumptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_stock_id')->constrained('item_stocks')->cascadeOnDelete();
            $table->integer('consumed_qty');
            $table->string('used_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_consumptions');
    }
};
