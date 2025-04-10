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
        Schema::create('medical_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained(table: 'patients', indexName: 'medical_histories_patient_id')->onDelete('cascade');
            $table->string('condition');
            $table->text('notes')->nullable();
            $table->date('diagnosed_at')->nullable();
            $table->date('resolved_at')->nullable();
            $table->boolean('is_chronic')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_histories');
    }
};
