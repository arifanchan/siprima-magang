<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    // Tampilkan daftar assignment
    public function index()
    {
        $assignments = Assignment::with('internshipActivity')->latest()->get();
        return inertia('assignments/index', [
            'assignments' => $assignments,
        ]);
    }

    // Tampilkan form tambah assignment
    public function create()
    {
        // Anda bisa menambahkan data lain jika perlu (misal: daftar internshipActivity)
        return inertia('assignments/create');
    }

    // Simpan assignment baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'internship_activity_id' => 'required|exists:internship_activities,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'required|date',
            'status' => 'nullable|string',
            'evidence_file' => 'nullable|file|max:8192',
        ]);

        if ($request->hasFile('evidence_file')) {
            $user = $request->user();
            $filename = now()->format('Y-m-d') . '_' . $request->file('evidence_file')->getClientOriginalName();
            $relativePath = 'users/' . $user->id . '/internship/assignments/' . $filename;
            $request->file('evidence_file')->storeAs('users/' . $user->id . '/internship/assignments', $filename, 'public');
            $validated['evidence_file'] = $relativePath;
        }

        Assignment::create($validated);
        return redirect()->route('assignments.index')->with('status', 'Tugas berhasil ditambahkan.');
    }

    // Tampilkan detail assignment
    public function show($id)
    {
        $assignment = Assignment::with('internshipActivity')->findOrFail($id);
        return inertia('assignments/show', [
            'assignment' => $assignment,
        ]);
    }

    // Edit assignment
    public function update(Request $request, $id)
    {
        $assignment = Assignment::findOrFail($id);
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
        } else {
            $validated['evidence_file'] = $assignment->evidence_file;
        }
        $assignment->update($validated);
        return redirect()->back()->with('status', 'Tugas berhasil diupdate.');
    }

    // Hapus assignment
    public function destroy($id)
    {
        $assignment = Assignment::findOrFail($id);
        $assignment->delete();
        return redirect()->back()->with('status', 'Tugas berhasil dihapus.');

    }

    // Tampilkan daftar assignment berdasarkan aktivitas magang (mirip presensi)
    public function activityAssignments($id)
    {
        $activity = \App\Models\InternshipActivity::with(['mentor.user'])->findOrFail($id);
        $assignments = \App\Models\Assignment::where('internship_activity_id', $id)->orderByDesc('due_date')->get();
        return inertia('internship-activities/[id]/assignments', [
            'internshipActivity' => $activity,
            'assignments' => $assignments,
        ]);
    }
}
