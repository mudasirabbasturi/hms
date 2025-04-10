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
        Schema::create('prescriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')
                  ->constrained( table: 'patients', indexName: 'prescriptions_patient_id')
                  ->onDelete('cascade');
            $table->foreignId('doctor_id')
                  ->constrained(table: 'users', indexName: 'prescriptions_doctor_id')
                  ->onDelete('cascade');
            $table->foreignId('appointment_id')->nullable()
                  ->constrained(table: 'appointments', indexName: 'prescriptions_appointment_id')
                  ->onDelete('set null');
            $table->text('diagnosis')->nullable();
            $table->text('notes')->nullable();
            $table->date('prescribed_at')->default(now());
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prescriptions');
    }
};
