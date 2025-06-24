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
                \Storage::delete('public/' . $student->ktp_file);
            }
            $filename = now()->format('Y-m-d') . '_' . $request->file('ktp_file')->getClientOriginalName();
            $relativePath = 'users/' . $user->id . '/ktp/' . $filename;
            $request->file('ktp_file')->storeAs('users/' . $user->id . '/ktp', $filename, 'public');
            $validated['ktp_file'] = $relativePath;
        } else {
            $validated['ktp_file'] = $student->ktp_file;
        }
        if ($request->hasFile('ktm_or_student_card_file')) {
            if ($student->ktm_or_student_card_file) {
                \Storage::delete('public/' . $student->ktm_or_student_card_file);
            }
            $filename = now()->format('Y-m-d') . '_' . $request->file('ktm_or_student_card_file')->getClientOriginalName();
            $relativePath = 'users/' . $user->id . '/ktm/' . $filename;
            $request->file('ktm_or_student_card_file')->storeAs('users/' . $user->id . '/ktm', $filename, 'public');
            $validated['ktm_or_student_card_file'] = $relativePath;
        } else {
            $validated['ktm_or_student_card_file'] = $student->ktm_or_student_card_file;
        }
        if ($request->hasFile('transcript_file')) {
            if ($student->transcript_file) {
                \Storage::delete('public/' . $student->transcript_file);
            }
            $filename = now()->format('Y-m-d') . '_' . $request->file('transcript_file')->getClientOriginalName();
            $relativePath = 'users/' . $user->id . '/transcript/' . $filename;
            $request->file('transcript_file')->storeAs('users/' . $user->id . '/transcript', $filename, 'public');
            $validated['transcript_file'] = $relativePath;
        } else {
            $validated['transcript_file'] = $student->transcript_file;
        }
        if ($student) {
            $student->update($validated);
        }
        return redirect()->route('profile.show')->with('success', 'Dokumen berhasil diperbarui');
    }
}
