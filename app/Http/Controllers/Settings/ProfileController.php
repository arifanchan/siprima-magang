<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $profile = $user->profile;
        return Inertia::render('settings/profile', [
            'profile' => $profile,
        ]);
    }

    public function update(ProfileUpdateRequest $request)
    {
        $user = $request->user();
        $profile = $user->profile;
        if (!$profile) {
            $profile = $user->profile()->create($request->validated());
        } else {
            $profile->update($request->validated());
        }
        return redirect()->route('profile.edit')->with('status', 'Profile updated successfully.');
    }
}

