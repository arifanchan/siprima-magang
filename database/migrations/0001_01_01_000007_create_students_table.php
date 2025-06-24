<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('student_number')->unique();
            $table->string('study_program');
            $table->string('faculty')->nullable(); // Made nullable
            $table->string('university');
            $table->integer('entry_year');
            $table->string('semester_or_grade')->nullable(); // Added field
            $table->decimal('latest_academic_score', 5, 2)->nullable(); // Added field
            $table->text('bio')->nullable();
            $table->string('ktp_file')->nullable();
            $table->string('ktm_or_student_card_file')->nullable(); // Renamed from ktm_file
            $table->string('transcript_file')->nullable();
            $table->string('advisor_name')->nullable();
            $table->string('advisor_phone')->nullable();
            $table->string('emergency_contact')->nullable();
            $table->string('dss_status')->nullable();
            $table->decimal('dss_score', 5, 2)->nullable();
            $table->string('dss_recommendation')->nullable();
            $table->text('dss_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
