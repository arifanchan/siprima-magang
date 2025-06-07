<?php

namespace App\Http\Controllers\Settings;

use App\Http\Requests\Settings\AdminProfileUpdateRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminProfileController extends \App\Http\Controllers\Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $admin = $user->admin;
        return Inertia::render('settings/admin-profile', [
            'admin' => $admin,
        ]);
    }

    public function update(AdminProfileUpdateRequest $request)
    {
        $user = $request->user();
        $admin = $user->admin;
        if (!$admin) {
            // Jika belum ada, buat data admin profile baru
            $admin = $user->admin()->create($request->validated());
        } else {
            $admin->update($request->validated());
        }
        return redirect()->route('admin-profile.edit')->with('status', 'Admin profile updated successfully.');
    }
}
