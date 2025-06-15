<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FinalAssessment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'internship_activity_id',
        'discipline',
        'responsibility',
        'teamwork',
        'initiative',
        'communication',
        'technical_skill',
        'final_score',
        'comment',
        'assessment_date',
        'dss_score',
        'dss_recommendation',
        'dss_notes',
        'dss_status',
    ];

    public function internshipActivity()
    {
        return $this->belongsTo(InternshipActivity::class);
    }
}

