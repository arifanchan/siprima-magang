<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Http\Controllers;

use App\Models\InternshipApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class InternshipApplicationController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $profile = $user->profile;
        $student = $user->student;
        $applications = [];
        if ($student) {
            $applications = InternshipApplication::where('student_id', $student->id)
                ->orderByDesc('created_at')
                ->get();
        }
        return Inertia::render('internship-applications/index', [
            'user' => $user,
            'profile' => $profile,
            'student' => $student,
            'applications' => $applications,
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        $profile = $user->profile;
        $student = $user->student;
        return Inertia::render('internship-applications/create', [
            'user' => $user,
            'profile' => $profile,
            'student' => $student,
        ]);
    }

    public function show($id)
    {
        $user = Auth::user();
        $profile = $user->profile;
        $student = $user->student;
        $application = InternshipApplication::where('id', $id)
            ->where('student_id', $student ? $student->id : null)
            ->first();
        return Inertia::render('internship-applications/show', [
            'user' => $user,
            'profile' => $profile,
            'student' => $student,
            'application' => $application,
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        // Validasi apakah user sudah memiliki pengajuan aktif
        $existingApplication = InternshipApplication::where('student_id', $user->student->id)
            ->whereIn('status', ['pending', 'approved'])
            ->where(function ($query) use ($request) {
                $query->whereBetween('start_date', [$request->start_date, $request->end_date])
                      ->orWhereBetween('end_date', [$request->start_date, $request->end_date]);
            })
            ->first();

        if ($existingApplication) {
            return redirect()->back()->withErrors(['error' => 'Anda sudah memiliki pengajuan aktif dalam periode ini.']);
        }

        // Lanjutkan menyimpan pengajuan baru
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'description' => 'nullable|string',
            'application_letter' => 'nullable|file|mimes:pdf|max:2048',
            'cv_file' => 'nullable|file|mimes:pdf|max:2048',
            'other_supporting_documents.*' => 'nullable|file|mimes:pdf|max:2048',
        ]);

        // Handle file uploads per user
        $letterFilename = now()->format('Y-m-d') . '_' . $request->file('letter_file')->getClientOriginalName();
        $letterRelativePath = 'users/' . $user->id . '/internship/application_letters/' . $letterFilename;
        $request->file('letter_file')->storeAs('users/' . $user->id . '/internship/application_letters', $letterFilename, 'public');
        $cvFilename = null;
        $cvRelativePath = null;
        if ($request->file('cv_file')) {
            $cvFilename = now()->format('Y-m-d') . '_' . $request->file('cv_file')->getClientOriginalName();
            $cvRelativePath = 'users/' . $user->id . '/internship/cv/' . $cvFilename;
            $request->file('cv_file')->storeAs('users/' . $user->id . '/internship/cv', $cvFilename, 'public');
        }
        $otherDocs = [];
        if ($request->hasFile('other_supporting_documents')) {
            foreach ($request->file('other_supporting_documents') as $file) {
                $filename = now()->format('Y-m-d') . '_' . $file->getClientOriginalName();
                $relativePath = 'users/' . $user->id . '/internship/supporting_documents/' . $filename;
                $file->storeAs('users/' . $user->id . '/internship/supporting_documents', $filename, 'public');
                $otherDocs[] = $relativePath;
            }
        }

        $application = new \App\Models\InternshipApplication();
        $application->student_id = $user->student?->id;
        $application->start_date = $validated['start_date'];
        $application->end_date = $validated['end_date'];
        $application->application_letter = $letterRelativePath;
        $application->cv_file = $cvRelativePath;
        $application->other_supporting_documents = $otherDocs;
        $application->description = $validated['description'] ?? null;
        $application->status = 'pending';
        $application->save();

        return redirect()->route('internship-applications.index')->with('status', 'Pengajuan magang berhasil dikirim.');
    }

    // ...other methods (update, destroy, etc.)
}
