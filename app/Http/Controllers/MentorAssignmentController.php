<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\InternshipActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MentorAssignmentController extends Controller
{
    // Daftar assignment untuk aktivitas magang tertentu (khusus mentor)
    public function activityAssignments($activityId)
    {
        $mentor = auth()->user()->mentor;
        $activity = InternshipActivity::with(['internshipApplication', 'internshipApplication.student', 'internshipApplication.student.user'])
            ->findOrFail($activityId);
        if (!$mentor || $activity->mentor_id !== $mentor->id) {
            abort(403, 'Akses tidak diizinkan');
        }
        $assignments = Assignment::where('internship_activity_id', $activityId)->orderByDesc('due_date')->get();
        return Inertia::render('mentor/activities/[id]/assignments', [
            'activity' => $activity,
            'assignments' => $assignments,
        ]);
    }

    // Tampilkan detail assignment
    public function show($activityId, $assignmentId)
    {
        $mentor = auth()->user()->mentor;
        $activity = InternshipActivity::findOrFail($activityId);
        if (!$mentor || $activity->mentor_id !== $mentor->id) {
            abort(403, 'Akses tidak diizinkan');
        }
        $assignment = Assignment::where('internship_activity_id', $activityId)->findOrFail($assignmentId);
        return Inertia::render('mentor/activities/[id]/assignments/[assignmentId]', [
            'activity' => $activity,
            'assignment' => $assignment,
        ]);
    }

    // Tampilkan form tambah assignment
    public function create($activityId)
    {
        $mentor = auth()->user()->mentor;
        $activity = InternshipActivity::with(['internshipApplication.student.user'])->findOrFail($activityId);
        if (!$mentor || $activity->mentor_id !== $mentor->id) {
            abort(403, 'Akses tidak diizinkan');
        }
        return Inertia::render('mentor/activities/[id]/assignments/create', [
            'activity' => $activity,
        ]);
    }

    // Simpan assignment baru
    public function store(Request $request, $activityId)
    {
        $mentor = auth()->user()->mentor;
        $activity = InternshipActivity::findOrFail($activityId);
        if (!$mentor || $activity->mentor_id !== $mentor->id) {
            abort(403, 'Akses tidak diizinkan');
        }
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'required|date',
            'status' => 'nullable|string',
            'evidence_file' => 'nullable|file|max:8192',
        ]);
        $validated['internship_activity_id'] = $activityId;
        if ($request->hasFile('evidence_file')) {
            $user = $request->user();
            $filename = now()->format('Y-m-d') . '_' . $request->file('evidence_file')->getClientOriginalName();
            $relativePath = 'users/' . $user->id . '/internship/assignments/' . $filename;
            $request->file('evidence_file')->storeAs('users/' . $user->id . '/internship/assignments', $filename, 'public');
            $validated['evidence_file'] = $relativePath;
        }
        Assignment::create($validated);
        return redirect()->route('mentor.activities.assignments', $activityId)->with('status', 'Tugas berhasil dibuat.');
    }

    // Tampilkan form edit assignment
    public function edit($activityId, $assignmentId)
    {
        $mentor = auth()->user()->mentor;
        $activity = InternshipActivity::findOrFail($activityId);
        if (!$mentor || $activity->mentor_id !== $mentor->id) {
            abort(403, 'Akses tidak diizinkan');
        }
        $assignment = Assignment::where('internship_activity_id', $activityId)->findOrFail($assignmentId);
        return Inertia::render('mentor/activities/[id]/assignments/edit', [
            'activity' => $activity,
            'assignment' => $assignment,
        ]);
    }

    // Update assignment
    public function update(Request $request, $activityId, $assignmentId)
    {
        $mentor = auth()->user()->mentor;
        $activity = InternshipActivity::findOrFail($activityId);
        if (!$mentor || $activity->mentor_id !== $mentor->id) {
            abort(403, 'Akses tidak diizinkan');
        }
        $assignment = Assignment::where('internship_activity_id', $activityId)->findOrFail($assignmentId);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'required|date',
            'status' => 'nullable|string',
            'evidence_file' => 'nullable|file|max:8192',
        ]);
        if ($request->hasFile('evidence_file')) {
            $user = $request->user();
            if ($assignment->evidence_file) {
                \Storage::delete('public/' . $assignment->evidence_file);
            }
            $filename = now()->format('Y-m-d') . '_' . $request->file('evidence_file')->getClientOriginalName();
            $relativePath = 'users/' . $user->id . '/internship/assignments/' . $filename;
            $request->file('evidence_file')->storeAs('users/' . $user->id . '/internship/assignments', $filename, 'public');
            $validated['evidence_file'] = $relativePath;
        }
        $assignment->update($validated);
        return redirect()->route('mentor.activities.assignments', $activityId)->with('status', 'Tugas berhasil diupdate.');
    }

    // Hapus assignment
    public function destroy($activityId, $assignmentId)
    {
        $mentor = auth()->user()->mentor;
        $activity = InternshipActivity::findOrFail($activityId);
        if (!$mentor || $activity->mentor_id !== $mentor->id) {
            abort(403, 'Akses tidak diizinkan');
        }
        $assignment = Assignment::where('internship_activity_id', $activityId)->findOrFail($assignmentId);
        $assignment->delete();
        return redirect()->route('mentor.activities.assignments', $activityId)->with('status', 'Tugas berhasil dihapus.');
    }
}
