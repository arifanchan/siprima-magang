<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MentorEditController extends Controller
{
    public function edit()
    {
        $user = Auth::user();
        $mentor = $user->mentor;
        return Inertia::render('mentor/mentor/edit', [
            'mentor' => $mentor,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        $mentor = $user->mentor;
        $validated = $request->validate([
            'nip' => 'required|string|max:64',
            'division' => 'required|string|max:128',
            'expertise' => 'required|string|max:128',
            'position' => 'required|string|max:128',
            'bio' => 'nullable|string|max:1024',
        ]);
        if ($mentor) {
            $mentor->nip = $validated['nip'];
            $mentor->division = $validated['division'];
            $mentor->expertise = $validated['expertise'];
            $mentor->position = $validated['position'];
            $mentor->bio = $validated['bio'];
            $mentor->save();
        }
        return redirect()->route('mentor.profile.show')->with('status', 'Data mentor berhasil diperbarui.');
    }
}

