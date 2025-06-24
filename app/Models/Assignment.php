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

class Assignment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'internship_activity_id',
        'title',
        'description',
        'due_date',
        'status',
        'evidence_file',
        'output',
        'dss_status',
        'dss_score',
        'dss_recommendation',
        'dss_notes',
    ];

    public function internshipActivity()
    {
        return $this->belongsTo(InternshipActivity::class);
    }

    public function logbooks()
    {
        return $this->hasMany(Logbook::class);
    }
}

