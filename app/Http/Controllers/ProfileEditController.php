<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileEditController extends Controller
{
    public function edit()
    {
        $user = Auth::user();
        if (!$user instanceof \App\Models\User) {
            abort(403, 'Unauthorized');
        }
        $profile = $user->profile;
        return Inertia::render('profile/edit', [
            'user' => $user,
            'profile' => $profile,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        if (!$user instanceof \App\Models\User) {
            abort(403, 'Unauthorized');
        }
        $profile = $user->profile;
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'required|string|max:20|unique:users,phone,' . $user->id,
            'gender' => 'required|in:male,female',
            'birth_date' => 'required|date',
            'address' => 'required|string|max:255',
            'occupation' => 'nullable|string|max:255',
            'identity_number' => 'required|string|max:32|unique:profiles,identity_number,' . ($profile ? $profile->id : 'NULL'),
            'photo_file' => 'nullable|image|max:2048',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
        ]);

        if (!$profile) {
            $profile = new Profile(['user_id' => $user->id]);
        }
        $profile->gender = $validated['gender'];
        $profile->birth_date = $validated['birth_date'];
        $profile->address = $validated['address'];
        $profile->occupation = $validated['occupation'];
        $profile->identity_number = $validated['identity_number'];
        if ($request->hasFile('photo_file')) {
            if ($profile->photo_file) {
                \Storage::delete('public/' . $profile->photo_file);
            }
            $filename = time() . '_' . $request->file('photo_file')->getClientOriginalName();
            $relativePath = 'users/' . $user->id . '/profile_photos/' . $filename;
            $request->file('photo_file')->storeAs('users/' . $user->id . '/profile_photos', $filename, 'public');
            $profile->photo_file = $relativePath;
        }
        $profile->save();

        return redirect()->route('profile.show')->with('status', 'Data pribadi berhasil diperbarui.');
    }
}
