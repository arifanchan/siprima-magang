<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Http\Controllers;

use App\Models\InternshipActivity;
use App\Models\InternshipApplication;
use App\Models\Mentor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;

class InternshipManagementActionController extends Controller
{
    public function approve($id)
    {
        $activity = InternshipActivity::findOrFail($id);
        $application = $activity->internshipApplication;
        $application->status = 'approved';
        $application->save();
        // Otomasi: buat InternshipActivity jika belum ada (mirip ListInternshipApplications)
        if (!$activity) {
            $activity = InternshipActivity::create([
                'internship_application_id' => $application->id,
                'start_date' => $application->start_date,
                'end_date' => $application->end_date,
            ]);
        }
        // OTOMASI LANJUTAN: Jika status activity diubah ke 'active', jalankan workflow otomatis
        if ($activity->status === 'active') {
            // Assignment pertama
            $firstAssignment = $activity->assignments()->first();
            if (!$firstAssignment) {
                $firstAssignment = $activity->assignments()->create([
                    'title' => 'Follow & Like Media Sosial Institusi',
                    'description' => '1. Follow seluruh akun media sosial institusi.\n2. Like minimal 3 postingan terakhir di setiap akun.\n3. Upload screenshot sebagai bukti sudah follow dan like.\n\nCatatan: Daftar akun media sosial dapat dilihat di halaman profil atau website institusi.',
                    'due_date' => $activity->start_date,
                    'status' => 'pending',
                ]);
            }
            // Notifikasi
            \App\Models\User::find(optional($activity->internshipApplication->student)->user_id)?->notify(new \App\Notifications\InternshipActivatedNotification($activity));
            \App\Models\User::find(optional($activity->mentor)->user_id)?->notify(new \App\Notifications\InternshipMentorAssignedNotification($activity));
            // Audit log
            \Log::info('Aktivitas magang diaktifkan', [
                'internship_activity_id' => $activity->id,
                'admin_id' => auth()->id(),
                'mentor_id' => $activity->mentor_id,
                'student_id' => optional($activity->internshipApplication->student)->id,
            ]);
            // Presensi & logbook
            $start = \Carbon\Carbon::parse($activity->start_date);
            $end = \Carbon\Carbon::parse($activity->end_date);
            for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
                if (in_array($date->dayOfWeek, [1, 2, 3, 4, 5])) {
                    $dateStr = $date->toDateString();
                    $activity->presences()->firstOrCreate([
                        'date' => $dateStr
                    ]);
                    $activity->logbooks()->firstOrCreate([
                        'date' => $dateStr
                    ]);
                }
            }
        }
        return back()->with('success', 'Application approved and activity created/updated.');
    }

    public function assignMentor(Request $request, $id)
    {
        $activity = InternshipActivity::findOrFail($id);
        $mentorId = $request->input('mentor_id');
        if ($mentorId) {
            $activity->mentor_id = $mentorId;
            $activity->save();
            return back()->with('success', 'Mentor assigned successfully.');
        }
        $mentors = Mentor::with('user')->get();
        return view('filament.resources.internship-management.assign-mentor', [
            'activity' => $activity,
            'mentors' => $mentors,
        ]);
    }

    public function uploadLetter(Request $request, $id)
    {
        $activity = InternshipActivity::findOrFail($id);
        $userId = optional(optional($activity->internshipApplication)->student)->user_id ?? 'unknown';
        if ($request->hasFile('completion_letter')) {
            $file = $request->file('completion_letter');
            $folder = 'users/' . $userId . '/internship/completion_letters';
            $filename = now()->format('Y-m-d') . '_' . $file->getClientOriginalName();
            $path = $file->storeAs($folder, $filename, 'public');
            $activity->completion_letter = $path;
            $activity->save();
        }
        return back()->with('success', 'Completion letter uploaded.');
    }

    public function uploadCertificate(Request $request, $id)
    {
        $activity = InternshipActivity::findOrFail($id);
        $userId = optional(optional($activity->internshipApplication)->student)->user_id ?? 'unknown';
        if ($request->hasFile('completion_certificate')) {
            $file = $request->file('completion_certificate');
            $folder = 'users/' . $userId . '/internship/completion_certificates';
            $filename = now()->format('Y-m-d') . '_' . $file->getClientOriginalName();
            $path = $file->storeAs($folder, $filename, 'public');
            $activity->completion_certificate = $path;
            $activity->save();
        }
        return back()->with('success', 'Certificate uploaded.');
    }

    public function edit($id)
    {
        $record = InternshipActivity::with([
            'internshipApplication.student.user',
            'mentor.user',
        ])->findOrFail($id);
        return view('filament.resources.internship-management.edit', compact('record'));
    }

    public function update(Request $request, $id)
    {
        $activity = InternshipActivity::findOrFail($id);
        $activity->status = $request->input('status');
        $activity->start_date = $request->input('start_date');
        $activity->end_date = $request->input('end_date');
        $activity->mentor_id = $request->input('mentor_id');
        $activity->feedback = $request->input('feedback');
        // Handle file upload for completion_letter
        if ($request->hasFile('completion_letter')) {
            $userId = optional(optional($activity->internshipApplication)->student)->user_id ?? 'unknown';
            $file = $request->file('completion_letter');
            $folder = 'users/' . $userId . '/internship/completion_letters';
            $filename = now()->format('Y-m-d') . '_' . $file->getClientOriginalName();
            $path = $file->storeAs($folder, $filename, 'public');
            $activity->completion_letter = $path;
        }
        // Handle file upload for completion_certificate
        if ($request->hasFile('completion_certificate')) {
            $userId = optional(optional($activity->internshipApplication)->student)->user_id ?? 'unknown';
            $file = $request->file('completion_certificate');
            $folder = 'users/' . $userId . '/internship/completion_certificates';
            $filename = now()->format('Y-m-d') . '_' . $file->getClientOriginalName();
            $path = $file->storeAs($folder, $filename, 'public');
            $activity->completion_certificate = $path;
        }
        $activity->save();
        return redirect()->route('internship-management.edit', $activity->id)->with('success', 'Internship updated successfully.');
    }
}
