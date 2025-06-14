<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InternshipApplication extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id',
        'status',
        'start_date',
        'end_date',
        'description',
        'application_letter',
        'cv_file',
        'other_supporting_documents',
        'rejection_reason',
        'admin_notes',
        'dss_status',
        'dss_score',
        'dss_recommendation',
        'dss_notes',
    ];

    protected $casts = [
        'other_supporting_documents' => 'array',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function internshipActivity()
    {
        return $this->hasOne(\App\Models\InternshipActivity::class);
    }

    public function getOtherSupportingDocumentsAttribute($value)
    {
        if (is_null($value)) {
            return [];
        }
        $decoded = json_decode($value, true);
        if (is_array($decoded)) {
            // Jika array asosiatif, kembalikan array value saja
            return array_values($decoded);
        }
        // Jika sudah array list atau null
        return $decoded ?: [];
    }
}
