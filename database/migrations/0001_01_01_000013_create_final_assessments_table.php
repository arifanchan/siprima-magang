<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('final_assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('internship_activity_id')->constrained('internship_activities')->onDelete('cascade');
            $table->unsignedTinyInteger('discipline')->nullable();
            $table->unsignedTinyInteger('responsibility')->nullable();
            $table->unsignedTinyInteger('teamwork')->nullable();
            $table->unsignedTinyInteger('initiative')->nullable();
            $table->unsignedTinyInteger('communication')->nullable();
            $table->unsignedTinyInteger('technical_skill')->nullable();
            $table->unsignedTinyInteger('final_score')->nullable();
            $table->text('comment')->nullable();
            $table->date('assessment_date')->nullable();
            $table->decimal('dss_score', 5, 2)->nullable();
            $table->string('dss_recommendation')->nullable();
            $table->text('dss_notes')->nullable();
            $table->string('dss_status')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('final_assessments');
    }
};

