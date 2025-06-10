<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DocumentEditController extends Controller
{
    public function edit()
    {
        $user = Auth::user();
        $student = $user->student;
        return Inertia::render('profile/documents/edit', [
            'profile' => $student,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        $student = $user->student;
        $validated = $request->validate([
            'ktp_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'ktm_or_student_card_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'transcript_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);
        if ($request->hasFile('ktp_file')) {
            $validated['ktp_file'] = $request->file('ktp_file')->store('documents', 'public');
        }
        if ($request->hasFile('ktm_or_student_card_file')) {
            $validated['ktm_or_student_card_file'] = $request->file('ktm_or_student_card_file')->store('documents', 'public');
        }
        if ($request->hasFile('transcript_file')) {
            $validated['transcript_file'] = $request->file('transcript_file')->store('documents', 'public');
        }
        if ($student) {
            $student->update($validated);
        }
        return redirect()->route('profile.show')->with('success', 'Dokumen berhasil diperbarui');
    }
}
