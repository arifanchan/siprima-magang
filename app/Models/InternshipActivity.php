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

class InternshipActivity extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'internship_application_id',
        'mentor_id',
        'start_date',
        'end_date',
        'final_presentation',
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

    // Progress persentase kehadiran
    public function getPresencePercentAttribute()
    {
        $totalDays = 0;
        $presenceDays = 0;
        if ($this->start_date && $this->end_date) {
            $start = \Carbon\Carbon::parse($this->start_date);
            $end = \Carbon\Carbon::parse($this->end_date);
            $period = \Carbon\CarbonPeriod::create($start, $end);
            foreach ($period as $date) {
                if ($date->isWeekday()) {
                    $totalDays++;
                    $presence = $this->presences()->where('date', $date->toDateString())->first();
                    if ($presence && $presence->check_in && $presence->check_out) {
                        $presenceDays++;
                    }
                }
            }
        }
        return $totalDays > 0 ? round(($presenceDays / $totalDays) * 100) : 0;
    }

    // Progress persentase logbook
    public function getLogbookPercentAttribute()
    {
        $totalDays = 0;
        $logbookDays = 0;
        if ($this->start_date && $this->end_date) {
            $start = \Carbon\Carbon::parse($this->start_date);
            $end = \Carbon\Carbon::parse($this->end_date);
            $period = \Carbon\CarbonPeriod::create($start, $end);
            foreach ($period as $date) {
                if ($date->isWeekday()) {
                    $totalDays++;
                    $logbook = $this->logbooks()->where('date', $date->toDateString())->first();
                    if ($logbook) {
                        $logbookDays++;
                    }
                }
            }
        }
        return $totalDays > 0 ? round(($logbookDays / $totalDays) * 100) : 0;
    }

    // Progress persentase tugas
    public function getAssignmentPercentAttribute()
    {
        $totalAssignments = $this->assignments()->count();
        $completedAssignments = $this->assignments()->where('status', 'completed')->count();
        return $totalAssignments > 0 ? round(($completedAssignments / $totalAssignments) * 100) : 0;
    }
}
