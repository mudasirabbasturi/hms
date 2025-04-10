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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('patient_id')->unique();
            $table->text('departments')->nullable();
            $table->string('name');
            $table->enum('gender', ['Male', 'Female', 'Other']);
            $table->date('dob');
            $table->string('email')->unique()->nullable();
            $table->string('phone')->nullable();
            $table->string('cnic')->unique()->nullable();
            $table->string('blood_group')->nullable();
            $table->text('symptoms')->nullable();
            $table->string('visit_purpose')->nullable();
            $table->string('patient_father_name')->nullable();
            $table->string('patient_mother_name')->nullable();
            $table->text('patient_address')->nullable();
            $table->string('profile')->nullable();
            $table->string('insurance_name')->nullable();
            $table->string('insurance_number')->nullable();
            $table->string('insurance_holder')->nullable();
            $table->string('insurance_type')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
