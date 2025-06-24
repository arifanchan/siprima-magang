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

class Presence extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'internship_activity_id',
        'date',
        'day',
        'check_in',
        'check_out',
        'notes',
        'dss_status',
        'dss_score',
        'dss_recommendation',
        'dss_notes',
    ];

    public function internshipActivity()
    {
        return $this->belongsTo(InternshipActivity::class);
    }

    public function setDateAttribute($value)
    {
        $this->attributes['date'] = $value;
        // Set field day otomatis berdasarkan date
        if ($value) {
            $carbon = \Carbon\Carbon::parse($value);
            $this->attributes['day'] = strtolower($carbon->format('l'));
        } else {
            $this->attributes['day'] = null;
        }
    }
}
