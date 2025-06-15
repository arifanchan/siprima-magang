<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Logbook extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'internship_activity_id',
        'assignment_id',
        'date',
        'activity',
        'description',
        'progress',
        'evidence_harian',
        'status',
        'feedback',
        'dss_status',
        'dss_score',
        'dss_recommendation',
        'dss_notes',
    ];

    public function internshipActivity()
    {
        return $this->belongsTo(InternshipActivity::class);
    }

    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }
}

