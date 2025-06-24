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
use App\Models\MediaSosial;

class MediaSosialEditController extends Controller
{
    public function edit()
    {
        $user = Auth::user();
        $mediaSosial = $user->mediaSosial;
        if ($user->role === 'mentor') {
            return Inertia::render('mentor/medsos/edit', [
                'mediaSosial' => $mediaSosial,
            ]);
        }
        return Inertia::render('profile/medsos/edit', [
            'mediaSosial' => $mediaSosial,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        $mediaSosial = $user->mediaSosial;
        $validated = $request->validate([
            'instagram' => 'nullable|string|max:255',
            'facebook' => 'nullable|string|max:255',
            'x' => 'nullable|string|max:255',
            'youtube' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'tiktok' => 'nullable|string|max:255',
            'thread' => 'nullable|string|max:255',
        ]);
        if ($mediaSosial) {
            $mediaSosial->update($validated);
        } else {
            $user->mediaSosial()->create($validated);
        }
        // Redirect sesuai role
        if ($user->role === 'mentor') {
            return redirect()->route('mentor.profile.show')->with('success', 'Data media sosial berhasil diperbarui');
        }
        return redirect()->route('profile.show')->with('success', 'Data media sosial berhasil diperbarui');
    }
}
