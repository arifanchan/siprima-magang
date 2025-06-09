<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('internship_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('internship_application_id')->constrained()->onDelete('cascade');
            $table->foreignId('mentor_id')->nullable()->constrained('mentors')->onDelete('set null');
            $table->date('start_date')->nullable(); // Added start_date for activity
            $table->date('end_date')->nullable();   // Added end_date for activity
            $table->text('final_report')->nullable();
            $table->string('completion_letter')->nullable();
            $table->string('completion_certificate')->nullable();
            $table->enum('status', ['pending', 'active', 'canceled', 'completed'])->default('pending');
            $table->text('feedback')->nullable();
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
        Schema::dropIfExists('internship_activities');
    }
};
