<?php

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
        return Inertia::render('internship-activities/[id]', [
            'internshipActivity' => $activity,
            'today_assignments' => $todayAssignments,
        ]);
    }

    public function update(Request $request, $id)
    {
        $activity = InternshipActivity::findOrFail($id);
        $activity->update($request->only(['status', 'mentor_id', 'start_date', 'end_date']));

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
}
