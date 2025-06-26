<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Http\Controllers;

use App\Models\Logbook;
use Illuminate\Http\Request;

class LogbookController extends Controller
{
    // Edit logbook
    public function update(Request $request, $id, $logbookId)
    {
        $logbook = Logbook::findOrFail($logbookId);
        $activityDate = $logbook->date;
        $today = now()->toDateString();
        $internship = $logbook->internshipActivity;
        $start = $internship ? $internship->start_date : null;
        $end = $internship ? $internship->end_date : null;

        // Validasi tanggal logbook
        if (!$start || !$end) {
            return redirect()->back()->withErrors(['date' => 'Periode magang tidak ditemukan.']);
        }
        if ($activityDate < $start || $activityDate > $end) {
            return redirect()->back()->withErrors(['date' => 'Tanggal logbook harus dalam periode magang.']);
        }
        if ($activityDate > $today) {
            return redirect()->back()->withErrors(['date' => 'Logbook tidak dapat diisi untuk tanggal ke depan.']);
        }

        // Handle file upload for evidence_harian
        if ($request->hasFile('evidence_harian')) {
            $user = $request->user();
            if ($logbook->evidence_harian) {
                \Storage::delete('public/' . $logbook->evidence_harian);
            }
            $filename = now()->format('Y-m-d') . '_' . $request->file('evidence_harian')->getClientOriginalName();
            $relativePath = 'users/' . $user->id . '/internship/logbooks/' . $filename;
            $request->file('evidence_harian')->storeAs('users/' . $user->id . '/internship/logbooks', $filename, 'public');
            $logbook->evidence_harian = $relativePath;
        }
        $logbook->update($request->only(['activity', 'description', 'progress', 'status']));
        $logbook->save();
        return redirect()->back()->with('status', 'Logbook berhasil diupdate.');
    }

    // Hapus logbook
    public function destroy($id)
    {
        $logbook = Logbook::findOrFail($id);
        $logbook->delete();
        return redirect()->back()->with('status', 'Logbook berhasil dihapus.');
    }

    // Menampilkan logbook berdasarkan aktivitas magang
    public function activityLogbooks($id)
    {
        $internshipActivity = \App\Models\InternshipActivity::with(['logbooks' => function($q) {
            $q->orderBy('date', 'desc');
        }])->findOrFail($id);
        $logbooks = $internshipActivity->logbooks;
        return inertia('internship-activities/[id]/logbook', [
            'internshipActivity' => $internshipActivity,
            'logbooks' => $logbooks,
        ]);
    }

    // Menampilkan detail logbook untuk edit/show
    public function show($id, $logbookId)
    {
        $logbook = \App\Models\Logbook::findOrFail($logbookId);
        $internshipActivity = $logbook->internshipActivity;
        // Convert evidence_harian to URL if exists
        if ($logbook->evidence_harian) {
            $logbook->evidence_harian = \Storage::url($logbook->evidence_harian);
        }
        return inertia('internship-activities/[id]/logbook/[logbookId]', [
            'logbook' => $logbook,
            'internshipActivity' => $internshipActivity,
        ]);
    }

    // Tambahkan method untuk mentor mengupdate status dan feedback logbook
    public function feedbackByMentor(Request $request, $activityId, $logbookId)
    {
        $mentor = $request->user()->mentor;
        $logbook = \App\Models\Logbook::findOrFail($logbookId);
        $activity = $logbook->internshipActivity;
        // Validasi hanya mentor pembimbing yang boleh update
        if (!$mentor || !$activity || $activity->mentor_id !== $mentor->id) {
            abort(403, 'Akses tidak diizinkan');
        }
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'feedback' => 'nullable|string',
        ]);
        $logbook->status = $validated['status'];
        $logbook->feedback = $validated['feedback'];
        $logbook->save();
        return redirect()->back()->with('status', 'Feedback logbook berhasil disimpan.');
    }
}
