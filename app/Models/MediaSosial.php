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

class MediaSosial extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'instagram',
        'facebook',
        'x',
        'youtube',
        'linkedin',
        'tiktok',
        'thread',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
