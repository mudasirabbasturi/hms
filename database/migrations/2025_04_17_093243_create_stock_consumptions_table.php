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
            // Relations
            $table->foreignId('item_stock_id')->constrained('item_stocks')->cascadeOnDelete(); 
            $table->foreignId('item_id')->constrained('items')->cascadeOnDelete();
            $table->integer('consumed_qty');
            $table->string('consumption_type');
            $table->string('template_name')->nullable();
            $table->string('added_by')->nullable();
            $table->text('comment')->nullable();
            // Costs
            $table->decimal('total_cost', 10, 2)->default(0);
            $table->decimal('total_retail_price', 10, 2)->default(0);
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
