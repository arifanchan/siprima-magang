<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mentor extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'nip',
        'division',
        'expertise',
        'position',
        'bio',
        'dss_status',
        'dss_score',
        'dss_recommendation',
        'dss_notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function internshipActivities()
    {
        return $this->hasMany(\App\Models\InternshipActivity::class);
    }

    public function profile()
    {
        return $this->hasOneThrough(
            \App\Models\Profile::class,
            \App\Models\User::class,
            'id',        // Foreign key on users table...
            'user_id',   // Foreign key on profiles table...
            'user_id',   // Local key on mentors table...
            'id'         // Local key on users table...
        );
    }
}
