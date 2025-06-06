<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('gender')->nullable();
            $table->date('birth_date')->nullable();
            $table->string('address')->nullable();
            $table->string('occupation')->nullable();
            $table->string('identity_number')->unique()->nullable();
            $table->string('photo')->nullable();
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
        Schema::dropIfExists('profiles');
    }
};

