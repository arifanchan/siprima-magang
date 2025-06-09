<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('internship_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->date('start_date');
            $table->date('end_date');
            $table->text('description')->nullable();
            $table->string('application_letter')->nullable(); // Surat Pengantar
            $table->string('cv_file')->nullable(); // Added field for CV
            $table->json('other_supporting_documents')->nullable(); // Added field for other documents
            $table->text('rejection_reason')->nullable(); // Added field for rejection reason
            $table->text('admin_notes')->nullable(); // Added field for admin notes
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
        Schema::dropIfExists('internship_applications');
    }
};
