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
        // Simpan file baru jika ada, jika tidak gunakan file lama
        if ($request->hasFile('ktp_file')) {
            if ($student->ktp_file) {
                \Storage::delete('public/users/' . $user->id . '/ktp/' . $student->ktp_file);
            }
            $filename = time() . '_' . $request->file('ktp_file')->getClientOriginalName();
            $request->file('ktp_file')->storeAs('users/' . $user->id . '/ktp', $filename, 'public');
            $validated['ktp_file'] = $filename;
        } else {
            $validated['ktp_file'] = $student->ktp_file;
        }
        if ($request->hasFile('ktm_or_student_card_file')) {
            if ($student->ktm_or_student_card_file) {
                \Storage::delete('public/users/' . $user->id . '/ktm/' . $student->ktm_or_student_card_file);
            }
            $filename = time() . '_' . $request->file('ktm_or_student_card_file')->getClientOriginalName();
            $request->file('ktm_or_student_card_file')->storeAs('users/' . $user->id . '/ktm', $filename, 'public');
            $validated['ktm_or_student_card_file'] = $filename;
        } else {
            $validated['ktm_or_student_card_file'] = $student->ktm_or_student_card_file;
        }
        if ($request->hasFile('transcript_file')) {
            if ($student->transcript_file) {
                \Storage::delete('public/users/' . $user->id . '/transcript/' . $student->transcript_file);
            }
            $filename = time() . '_' . $request->file('transcript_file')->getClientOriginalName();
            $request->file('transcript_file')->storeAs('users/' . $user->id . '/transcript', $filename, 'public');
            $validated['transcript_file'] = $filename;
        } else {
            $validated['transcript_file'] = $student->transcript_file;
        }
        if ($student) {
            $student->update($validated);
        }
        return redirect()->route('profile.show')->with('success', 'Dokumen berhasil diperbarui');
    }
}
