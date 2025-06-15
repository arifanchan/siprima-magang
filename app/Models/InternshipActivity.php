<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InternshipActivity extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'internship_application_id',
        'mentor_id',
        'start_date',
        'end_date',
        'final_report',
        'completion_letter',
        'completion_certificate',
        'status',
        'feedback',
        'dss_status',
        'dss_score',
        'dss_recommendation',
        'dss_notes',
    ];

    public function internshipApplication()
    {
        return $this->belongsTo(InternshipApplication::class);
    }

    public function mentor()
    {
        return $this->belongsTo(Mentor::class);
    }

    public function presences()
    {
        return $this->hasMany(Presence::class);
    }

    public function logbooks()
    {
        return $this->hasMany(Logbook::class);
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    public function finalAssessment()
    {
        return $this->hasOne(FinalAssessment::class);
    }
}
