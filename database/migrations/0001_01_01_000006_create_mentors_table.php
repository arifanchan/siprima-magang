<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mentors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nip')->unique();
            $table->string('division');
            $table->string('expertise');
            $table->string('position');
            $table->text('bio')->nullable();
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
        Schema::dropIfExists('mentors');
    }
};

