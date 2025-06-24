<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\Student;
use App\Models\MediaSosial;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $profile = $user->profile;
        $student = $user->student;
        $mediaSosial = $user->mediaSosial;
        $documents = [];
        if ($profile) {
            $documents = [
                ['id' => 'ktp', 'name' => 'KTP', 'url' => $profile->ktp_file ? asset('storage/' . $profile->ktp_file) : null],
                ['id' => 'ktm', 'name' => 'KTM/Kartu Siswa', 'url' => $profile->ktm_or_student_card_file ? asset('storage/' . $profile->ktm_or_student_card_file) : null],
                ['id' => 'transkrip', 'name' => 'Transkrip', 'url' => $profile->transcript_file ? asset('storage/' . $profile->transcript_file) : null],
            ];
        }
        return Inertia::render('profile/show', [
            'user' => $user,
            'profile' => $profile,
            'student' => $student,
            'mediaSosial' => $mediaSosial,
            'documents' => $documents,
        ]);
    }
}
