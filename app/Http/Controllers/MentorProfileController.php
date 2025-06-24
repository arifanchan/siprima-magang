<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MentorProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $profile = $user->profile;
        $mentor = $user->mentor;
        $mediaSosial = $user->mediaSosial;
        $documents = [];
        if ($profile) {
            $documents = [
                ['id' => 'ktp', 'name' => 'KTP', 'url' => $profile->ktp_file ? asset('storage/' . $profile->ktp_file) : null],
            ];
        }
        return Inertia::render('mentor/profile', [
            'user' => $user,
            'profile' => $profile,
            'mentor' => $mentor,
            'mediaSosial' => $mediaSosial,
            'documents' => $documents,
        ]);
    }
}

