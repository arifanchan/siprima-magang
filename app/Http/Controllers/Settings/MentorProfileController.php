<?php

namespace App\Http\Controllers\Settings;

use App\Http\Requests\Settings\MentorProfileUpdateRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MentorProfileController extends \App\Http\Controllers\Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $mentor = $user->mentor;
        return Inertia::render('settings/mentor-profile', [
            'mentor' => $mentor,
        ]);
    }

    public function update(MentorProfileUpdateRequest $request)
    {
        $user = $request->user();
        $mentor = $user->mentor;
        if (!$mentor) {
            $mentor = $user->mentor()->create($request->validated());
        } else {
            $mentor->update($request->validated());
        }
        return redirect()->route('mentor-profile.edit')->with('status', 'Mentor profile updated successfully.');
    }
}

