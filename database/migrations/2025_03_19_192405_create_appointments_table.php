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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained( table: 'users', indexName: 'appointments_user_id')->onDelete('set null');
            $table->foreignId('patient_id')->constrained( table: 'patients', indexName: 'appointments_patient_id')->onDelete('cascade');
            $table->enum('status', ['Scheduled', 'Confirmed', 'Checked In', 'Checked Out', 'No Show'])->default('Scheduled');
            $table->string('token_number')->nullable();
            $table->date('appointment_date')->nullable();
            $table->date('start_time')->nullable();
            $table->date('end_time')->nullable();
            $table->enum('appointment_type', ['token', 'consultation'])->default('token');
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
