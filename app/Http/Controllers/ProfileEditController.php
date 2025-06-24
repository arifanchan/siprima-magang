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
        // Render halaman edit sesuai role
        if ($user->role === 'mentor') {
            return Inertia::render('mentor/profile/edit', [
                'user' => $user,
                'profile' => $profile,
            ]);
        }
        // Default: student/user
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
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'gender' => 'nullable|in:male,female',
            'birth_date' => 'nullable|date',
            'address' => 'nullable|string|max:255',
            'occupation' => 'nullable|string|max:255',
            'identity_number' => 'nullable|string|max:32',
            'photo_file' => 'nullable|image|max:2048',
        ]);
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'];
        $user->save();
        if ($profile) {
            $profile->gender = $validated['gender'];
            $profile->birth_date = $validated['birth_date'];
            $profile->address = $validated['address'];
            $profile->occupation = $validated['occupation'];
            $profile->identity_number = $validated['identity_number'];
            if ($request->hasFile('photo_file')) {
                $file = $request->file('photo_file');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('users/' . $user->id . '/profile_photos', $filename, 'public');
                $profile->photo_file = $path;
            }
            $profile->save();
        }
        // Redirect sesuai role
        if ($user->role === 'mentor') {
            return redirect()->route('mentor.profile.show')->with('status', 'Data pribadi berhasil diperbarui.');
        }
        return redirect()->route('profile.show')->with('status', 'Data pribadi berhasil diperbarui.');
    }
}
