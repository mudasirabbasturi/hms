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
        Schema::create('vitals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained(table: 'patients', indexName: 'vitals_patient_id')->onDelete('cascade');
            $table->foreignId('appointment_id')->constrained(table: 'appointments', indexName: 'vitals_appointment_id')->onDelete('cascade');
            $table->integer('pulse')->nullable();
            $table->decimal('temperature', 6, 2)->nullable();
            $table->integer('systolic_bp')->nullable();
            $table->integer('diastolic_bp')->nullable();
            $table->integer('respiratory_rate')->nullable();
            $table->decimal('blood_sugar', 5, 2)->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->decimal('height', 6,2)->nullable();
            $table->decimal('bmi', 5, 2)->nullable();
            $table->decimal('bsa', 5, 2)->nullable();
            $table->decimal('oxygen_saturation', 5, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vitals');
    }
};
