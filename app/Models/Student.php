<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'student_number',
        'study_program',
        'faculty',
        'university',
        'entry_year',
        'semester_or_grade',
        'latest_academic_score',
        'bio',
        'ktp_file',
        'ktm_or_student_card_file',
        'transcript_file',
        'advisor_name',
        'advisor_phone',
        'emergency_contact',
        'dss_status',
        'dss_score',
        'dss_recommendation',
        'dss_notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function profile()
    {
        return $this->hasOne(\App\Models\Profile::class, 'user_id', 'user_id');
    }
}
