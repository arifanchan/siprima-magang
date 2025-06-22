<?php

namespace App\Http\Controllers;

use App\Models\InternshipApplication;
use App\Models\InternshipActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        // Ambil permohonan magang terakhir user
        $internshipApplication = InternshipApplication::with('student')
            ->whereHas('student', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->latest('created_at')
            ->first();

        // Ambil aktivitas magang aktif user
        $internshipActivity = InternshipActivity::with(['mentor.user', 'internshipApplication.student'])
            ->whereHas('internshipApplication.student', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->where('status', 'active')
            ->latest('start_date')
            ->first();

        // Ambil aktivitas magang terkait permohonan magang terakhir (jika ada)
        $relatedActivity = null;
        if ($internshipApplication) {
            $relatedActivity = \App\Models\InternshipActivity::with(['mentor.user'])
                ->where('internship_application_id', $internshipApplication->id)
                ->latest('start_date')
                ->first();
        }

        // Notifikasi dummy, ganti dengan query notifikasi asli jika ada
        $notifications = $user->notifications ? $user->notifications->pluck('data.message')->toArray() : [];

        // Recent activities: ambil 5 aktivitas terbaru dari presensi, logbook, assignment
        $recentActivities = [];
        if ($internshipActivity) {
            $presences = $internshipActivity->presences()->orderByDesc('date')->limit(2)->get();
            foreach ($presences as $presence) {
                $recentActivities[] = 'Presensi: ' . ($presence->date ? date('d-m-Y', strtotime($presence->date)) : '-') . ' (' . ($presence->check_in ? 'Masuk ' . $presence->check_in : '-') . ($presence->check_out ? ', Pulang ' . $presence->check_out : '') . ')';
            }
            $logbooks = $internshipActivity->logbooks()->orderByDesc('date')->limit(2)->get();
            foreach ($logbooks as $logbook) {
                $recentActivities[] = 'Logbook: ' . ($logbook->date ? date('d-m-Y', strtotime($logbook->date)) : '-') . ' - ' . ($logbook->activity ?? '-');
            }
            $assignments = $internshipActivity->assignments()->orderByDesc('created_at')->limit(1)->get();
            foreach ($assignments as $assignment) {
                $recentActivities[] = 'Tugas: ' . ($assignment->title ?? '-') . ' (' . ($assignment->status ?? '-') . ')';
            }
            // Urutkan berdasarkan tanggal terbaru (ambil max tanggal dari masing-masing)
            usort($recentActivities, function($a, $b) {
                // Ekstrak tanggal dari string
                preg_match('/(\d{2}-\d{2}-\d{4})/', $a, $matchA);
                preg_match('/(\d{2}-\d{2}-\d{4})/', $b, $matchB);
                $dateA = isset($matchA[1]) ? \DateTime::createFromFormat('d-m-Y', $matchA[1]) : null;
                $dateB = isset($matchB[1]) ? \DateTime::createFromFormat('d-m-Y', $matchB[1]) : null;
                if ($dateA && $dateB) return $dateB <=> $dateA;
                return 0;
            });
            $recentActivities = array_slice($recentActivities, 0, 5);
        }

        // Jadwal & Kalender Magang: generate otomatis daftar hari kerja magang
        $schedule = [];
        if ($internshipActivity && $internshipActivity->start_date && $internshipActivity->end_date) {
            $start = \Carbon\Carbon::parse($internshipActivity->start_date);
            $end = \Carbon\Carbon::parse($internshipActivity->end_date);
            $period = \Carbon\CarbonPeriod::create($start, $end);
            foreach ($period as $date) {
                if ($date->isWeekday()) {
                    $schedule[] = $date->format('l, d-m-Y');
                }
            }
        }

        // Format data untuk frontend
        return Inertia::render('dashboard', [
            'internshipApplication' => $internshipApplication ? [
                'status' => $internshipApplication->status,
                'start_date' => $internshipApplication->start_date,
                'end_date' => $internshipApplication->end_date,
                'mentor_name' => $relatedActivity && $relatedActivity->mentor && $relatedActivity->mentor->user ? $relatedActivity->mentor->user->name : null,
            ] : null,
            'internshipActivity' => $internshipActivity ? [
                'status' => $internshipActivity->status,
                'start_date' => $internshipActivity->start_date,
                'end_date' => $internshipActivity->end_date,
                'mentor_name' => $internshipActivity->mentor && $internshipActivity->mentor->user ? $internshipActivity->mentor->user->name : null,
                'presence_count' => $internshipActivity->presences()->count(),
                'logbook_count' => $internshipActivity->logbooks()->count(),
                'assignment_count' => $internshipActivity->assignments()->count(),
                'assignment_completed_count' => $internshipActivity->assignments()->where('status', 'completed')->count(),
                'presence_percent' => $internshipActivity->presence_percent ?? 0,
                'logbook_percent' => $internshipActivity->logbook_percent ?? 0,
                'assignment_percent' => $internshipActivity->assignment_percent ?? 0,
                'recent_activities' => $recentActivities,
                'schedule' => $schedule,
                'final_presentation_status' => $internshipActivity->final_presentation ? 'Sudah' : 'Belum',
                'final_report_status' => $internshipActivity->final_report ? 'Sudah' : 'Belum',
                'final_presentation_percent' => $internshipActivity->final_presentation ? 100 : 0,
                'final_report_percent' => $internshipActivity->final_report ? 100 : 0,
            ] : null,
            'notifications' => $notifications,
        ]);
    }
}
