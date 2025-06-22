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
        if ($this->start_date && $this->end_date) {
            $start = \Carbon\Carbon::parse($this->start_date);
            $end = \Carbon\Carbon::parse($this->end_date);
            $totalDays = $start->diffInWeekdays($end) + 1; // Hanya hari kerja (Senin-Jumat)
        }
        $presenceCount = $this->presences()->count();
        return $totalDays > 0 ? round(($presenceCount / $totalDays) * 100) : 0;
    }

    // Progress persentase logbook
    public function getLogbookPercentAttribute()
    {
        $totalDays = 0;
        if ($this->start_date && $this->end_date) {
            $start = \Carbon\Carbon::parse($this->start_date);
            $end = \Carbon\Carbon::parse($this->end_date);
            $totalDays = $start->diffInWeekdays($end) + 1;
        }
        $logbookCount = $this->logbooks()->count();
        return $totalDays > 0 ? round(($logbookCount / $totalDays) * 100) : 0;
    }

    // Progress persentase tugas
    public function getAssignmentPercentAttribute()
    {
        $totalAssignments = $this->assignments()->count();
        $completedAssignments = $this->assignments()->where('status', 'completed')->count();
        return $totalAssignments > 0 ? round(($completedAssignments / $totalAssignments) * 100) : 0;
    }
}
