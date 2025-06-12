<?php

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
}
