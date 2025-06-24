<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Http\Controllers;

use App\Models\InternshipActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InternshipActivityController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->student) {
            // Filter activities for the logged-in student
            $activities = InternshipActivity::with(['internshipApplication.student.user', 'mentor.user'])
                ->whereHas('internshipApplication', function ($query) use ($user) {
                    $query->where('student_id', $user->student->id)
                          ->where('status', 'approved');
                })
                ->get();
        } elseif ($user->mentor) {
            // Filter activities for the logged-in mentor
            $activities = InternshipActivity::with(['internshipApplication.student.user', 'mentor.user'])
                ->where('mentor_id', $user->mentor->id)
                ->get();
        } else {
            // Default: show all activities for admin or other roles
            $activities = InternshipActivity::with(['internshipApplication.student.user', 'mentor.user'])->get();
        }

        return Inertia::render('internship-activities/index', [
            'activities' => $activities,
            'debug' => $activities->toArray(), // Debugging: send raw data to frontend
        ]);
    }

    public function show($id)
    {
        $activity = InternshipActivity::with(['internshipApplication.student.user', 'mentor.user'])
            ->findOrFail($id);
        $today = now()->toDateString();
        $todayAssignments = $activity->assignments()->whereDate('due_date', $today)->get();
        $presences = $activity->presences()->orderBy('date', 'desc')->get();
        $todayPresence = $activity->presences()->whereDate('date', $today)->first();
        // Tambahkan pengecekan logbook hari ini
        $todayLogbook = $activity->logbooks()->whereDate('date', $today)->exists();
        return Inertia::render('internship-activities/[id]', [
            'internshipActivity' => $activity,
            'today_assignments' => $todayAssignments,
            'presences' => $presences,
            'today_presence' => $todayPresence,
            'today_logbook' => $todayLogbook, // <-- tambahkan ini
        ]);
    }

    public function update(Request $request, $id)
    {
        $activity = InternshipActivity::findOrFail($id);
        $activity->update($request->only(['status', 'mentor_id', 'start_date', 'end_date']));

        if ($request->hasFile('final_presentation')) {
            $filename = now()->format('Y-m-d') . '_' . $request->file('final_presentation')->getClientOriginalName();
            $path = $request->file('final_presentation')->storeAs('users/' . $activity->internshipApplication->student->user_id . '/internship/final_presentations', $filename, 'public');
            $activity->final_presentation = $path;
            $activity->save();
        }

        if ($request->hasFile('final_report')) {
            $filename = now()->format('Y-m-d') . '_' . $request->file('final_report')->getClientOriginalName();
            $path = $request->file('final_report')->storeAs('users/' . $activity->internshipApplication->student->user_id . '/internship/final_reports', $filename, 'public');
            $activity->final_report = $path;
            $activity->save();
        }

        if ($request->hasFile('completion_letter')) {
            $filename = now()->format('Y-m-d') . '_' . $request->file('completion_letter')->getClientOriginalName();
            $path = $request->file('completion_letter')->storeAs('users/' . $activity->internshipApplication->student->user_id . '/internship/completion_letters', $filename, 'public');
            $activity->completion_letter = $path;
            $activity->save();
        }

        if ($request->hasFile('completion_certificate')) {
            $filename = now()->format('Y-m-d') . '_' . $request->file('completion_certificate')->getClientOriginalName();
            $path = $request->file('completion_certificate')->storeAs('users/' . $activity->internshipApplication->student->user_id . '/internship/completion_certificates', $filename, 'public');
            $activity->completion_certificate = $path;
            $activity->save();
        }

        return redirect()->back()->with('status', 'Internship activity updated successfully.');
    }

    public function destroy($id)
    {
        $activity = InternshipActivity::findOrFail($id);
        $activity->delete();
        return redirect()->back()->with('status', 'Internship activity deleted successfully.');
    }

    public function report($id)
    {
        $activity = InternshipActivity::with(['internshipApplication.student.user', 'mentor.user'])->findOrFail($id);
        $user = auth()->user();
        // Otorisasi: hanya student terkait, mentor terkait, atau admin
        if ($user->role === 'student' && $activity->internshipApplication->student->user_id !== $user->id) {
            abort(403);
        }
        if ($user->role === 'mentor' && $activity->mentor_id !== optional($user->mentor)->id) {
            abort(403);
        }
        return Inertia::render('internship-activities/[id]/report', [
            'internshipActivity' => $activity,
        ]);
    }

    public function updateReport(Request $request, $id)
    {
        $activity = InternshipActivity::findOrFail($id);
        $user = auth()->user();
        // Otorisasi: hanya student terkait, mentor terkait, atau admin
        if ($user->role === 'student' && $activity->internshipApplication->student->user_id !== $user->id) {
            abort(403);
        }
        if ($user->role === 'mentor' && $activity->mentor_id !== optional($user->mentor)->id) {
            abort(403);
        }
        $data = [];
        // Penamaan dan penyimpanan file konsisten per user
        $studentUserId = $activity->internshipApplication->student->user_id;
        if ($request->hasFile('final_report')) {
            // Hapus file lama jika ada
            if ($activity->final_report) {
                \Storage::disk('public')->delete($activity->final_report);
            }
            $filename = now()->format('Y-m-d') . '_' . $request->file('final_report')->getClientOriginalName();
            $relativePath = 'users/' . $studentUserId . '/internship/final_reports/' . $filename;
            $request->file('final_report')->storeAs('users/' . $studentUserId . '/internship/final_reports', $filename, 'public');
            $data['final_report'] = $relativePath;
        }
        if ($request->hasFile('final_presentation')) {
            if ($activity->final_presentation) {
                \Storage::disk('public')->delete($activity->final_presentation);
            }
            $filename = now()->format('Y-m-d') . '_' . $request->file('final_presentation')->getClientOriginalName();
            $relativePath = 'users/' . $studentUserId . '/internship/final_presentations/' . $filename;
            $request->file('final_presentation')->storeAs('users/' . $studentUserId . '/internship/final_presentations', $filename, 'public');
            $data['final_presentation'] = $relativePath;
        }
        // Student hanya boleh update file, mentor/admin boleh update feedback
        if (in_array($user->role, ['mentor', 'admin']) && $request->has('feedback')) {
            $data['feedback'] = $request->input('feedback');
        }
        $activity->update($data);
        return redirect()->back()->with('status', 'Laporan akhir berhasil diperbarui.');
    }

    public function finalAssessment($id)
    {
        $activity = \App\Models\InternshipActivity::with([
            'mentor.user',
            'finalAssessment',
            'internshipApplication.student.user',
            'internshipApplication.student.profile',
        ])->findOrFail($id);
        return \Inertia\Inertia::render('internship-activities/[id]/final-assessment', [
            'internshipActivity' => $activity,
            'finalAssessment' => $activity->finalAssessment,
        ]);
    }
}
