<?php

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
            $table->string('faculty');
            $table->integer('entry_year');
            $table->text('bio')->nullable();
            $table->string('ktp_file')->nullable();
            $table->string('ktm_file')->nullable();
            $table->string('other_identity_file')->nullable();
            $table->string('transcript_file')->nullable();
            $table->string('advisor_name')->nullable();
            $table->string('advisor_phone')->nullable();
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

