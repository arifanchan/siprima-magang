<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

use App\Http\Controllers\DocumentEditController;
use App\Http\Controllers\InternshipActivityController;
use App\Http\Controllers\InternshipApplicationController;
use App\Http\Controllers\MediaSosialEditController;
use App\Http\Controllers\StudentEditController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfileEditController;
use App\Http\Controllers\PresenceController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\FinalAssessmentController;
use App\Http\Controllers\InternshipManagementActionController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', \App\Http\Middleware\RedirectIfMentor::class, 'can:isStudent'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileEditController::class, 'edit'])->name('profile.edit');
    Route::post('/profile/edit', [ProfileEditController::class, 'update'])->name('profile.update');
    Route::get('/profile/student/edit', [StudentEditController::class, 'edit'])->name('profile.student.edit');
    Route::post('/profile/student/edit', [StudentEditController::class, 'update'])->name('profile.student.update');
    Route::get('/profile/medsos/edit', [MediaSosialEditController::class, 'edit'])->name('profile.medsos.edit');
    Route::post('/profile/medsos/edit', [MediaSosialEditController::class, 'update'])->name('profile.medsos.update');
    Route::get('/profile/documents/edit', [DocumentEditController::class, 'edit'])->name('profile.documents.edit');
    Route::post('/profile/documents/edit', [DocumentEditController::class, 'update'])->name('profile.documents.update');
    Route::resource('internship-applications', InternshipApplicationController::class)->only(['index', 'show', 'create', 'store']);
    Route::resource('internship-activities', InternshipActivityController::class)->only(['index', 'show']);
    Route::resource('assignments', AssignmentController::class);
    Route::resource('final-assessments', \App\Http\Controllers\FinalAssessmentController::class);
    Route::post('/presences/check-in', [PresenceController::class, 'checkIn'])->name('presences.check-in');
    Route::post('/presences/check-out', [PresenceController::class, 'checkOut'])->name('presences.check-out');
    // Sub-routes for internship-activities detail navigation
    Route::get('/internship-activities/{id}/presence', function ($id) {
        $activity = \App\Models\InternshipActivity::with(['mentor.user'])->findOrFail($id);
        $presences = \App\Models\Presence::where('internship_activity_id', $id)->orderByDesc('date')->get();
        return Inertia::render('internship-activities/[id]/presence', [
            'internshipActivity' => $activity,
            'presences' => $presences,
        ]);
    })->name('internship-activities.presence');
    Route::get('/internship-activities/{id}/assignments', [AssignmentController::class, 'activityAssignments'])->name('internship-activities.assignments');
    Route::get('/internship-activities/{activity}/assignments/{assignment}', [AssignmentController::class, 'show'])
        ->name('internship-activities.assignments.show');
    Route::get('/internship-activities/{id}/logbook', [\App\Http\Controllers\LogbookController::class, 'activityLogbooks'])->name('internship-activities.logbook');
    Route::get('/internship-activities/{id}/logbook/{logbookId}', [\App\Http\Controllers\LogbookController::class, 'show'])->name('internship-activities.logbook.show');
    Route::post('/internship-activities/{id}/logbook/{logbookId}/update', [\App\Http\Controllers\LogbookController::class, 'update'])->name('internship-activities.logbook.update');
    // Route laporan akhir (final report)
    Route::get('/internship-activities/{id}/report', [InternshipActivityController::class, 'report'])->name('internship-activities.report');
    Route::post('/internship-activities/{id}/report', [InternshipActivityController::class, 'updateReport'])->name('internship-activities.report.update');
    // Route penilaian akhir (final assessment)
    Route::get('/internship-activities/{id}/final-assessment', [InternshipActivityController::class, 'finalAssessment'])->name('internship-activities.final-assessment');
});

// Mentor dashboard & pages
Route::middleware(['auth', \App\Http\Middleware\RedirectIfStudent::class, 'can:isMentor'])->group(function () {
    Route::get('/mentor/dashboard', [\App\Http\Controllers\MentorDashboardController::class, 'index'])->name('mentor.dashboard');
    Route::get('/mentor/profile', [\App\Http\Controllers\MentorProfileController::class, 'show'])->name('mentor.profile.show');
    Route::get('/mentor/profile/edit', [\App\Http\Controllers\ProfileEditController::class, 'edit'])->name('mentor.profile.edit');
    Route::post('/mentor/profile/edit', [\App\Http\Controllers\ProfileEditController::class, 'update'])->name('mentor.profile.update');
    Route::get('/mentor/mentor/edit', [\App\Http\Controllers\MentorEditController::class, 'edit'])->name('mentor.mentor.edit');
    Route::post('/mentor/mentor/edit', [\App\Http\Controllers\MentorEditController::class, 'update'])->name('mentor.mentor.update');
    Route::get('/mentor/medsos/edit', [\App\Http\Controllers\MediaSosialEditController::class, 'edit'])->name('mentor.medsos.edit');
    Route::post('/mentor/medsos/edit', [\App\Http\Controllers\MediaSosialEditController::class, 'update'])->name('mentor.medsos.update');
    // Daftar bimbingan aktif
    Route::get('/mentor/activities', function () {
        $mentor = auth()->user()->mentor;
        $activities = $mentor
            ? $mentor->internshipActivities()
                ->with([
                    'internshipApplication',
                    'internshipApplication.student',
                    'internshipApplication.student.user',
                    'internshipApplication.student.profile',
                ])
                ->whereIn('status', ['aktif', 'berjalan', 'active', 'ongoing'])
                ->orderByDesc('start_date')->get()
            : collect();
        // Paksa akses relasi dan konversi ke array agar relasi ikut di-serialize
        $activitiesArr = $activities->map(function ($activity) {
            $internshipApplication = $activity->internshipApplication;
            $student = $internshipApplication?->student;
            $user = $student?->user;
            $profile = $student?->profile;
            // return struktur lengkap
            return [
                ...$activity->toArray(),
                'internshipApplication' => $internshipApplication ? [
                    ...$internshipApplication->toArray(),
                    'student' => $student ? [
                        ...$student->toArray(),
                        'user' => $user ? $user->toArray() : null,
                        'profile' => $profile ? $profile->toArray() : null,
                    ] : null,
                ] : null,
            ];
        });
        return Inertia::render('mentor/activities/index', [
            'activities' => $activitiesArr,
        ]);
    })->name('mentor.activities.index');
    // Riwayat bimbingan
    Route::get('/mentor/activities/history', function () {
        $mentor = auth()->user()->mentor;
        $activities = $mentor
            ? $mentor->internshipActivities()
                ->with([
                    'internshipApplication',
                    'internshipApplication.student',
                    'internshipApplication.student.user',
                    'internshipApplication.student.profile',
                ])
                ->whereIn('status', ['selesai', 'batal', 'ditolak', 'finished', 'cancelled', 'rejected'])
                ->orderByDesc('start_date')->get()
            : collect();
        // Paksa akses relasi agar ikut di-serialize
        $activities->each(function ($activity) {
            $activity->internshipApplication;
            $activity->internshipApplication?->student;
            $activity->internshipApplication?->student?->user;
            $activity->internshipApplication?->student?->profile;
        });
        return Inertia::render('mentor/activities/history', [
            'activities' => $activities,
        ]);
    })->name('mentor.activities.history');
    // Detail aktivitas bimbingan untuk mentor
    Route::get('/mentor/activities/{id}', function ($id) {
        $mentor = auth()->user()->mentor;
        $activity = \App\Models\InternshipActivity::with([
            'internshipApplication',
            'internshipApplication.student',
            'internshipApplication.student.user',
            'internshipApplication.student.profile',
            'presences',
            'logbooks',
            'assignments',
            'finalAssessment',
        ])->findOrFail($id);
        // Pastikan hanya mentor yang berhak bisa akses
        if (!$mentor || $activity->mentor_id !== $mentor->id) {
            abort(403, 'Akses tidak diizinkan');
        }
        $student = $activity->internshipApplication?->student;
        // Statistik presensi
        $presence_summary = [
            'present' => $activity->presences->where('status', 'hadir')->count(),
            'leave' => $activity->presences->where('status', 'izin')->count(),
            'absent' => $activity->presences->where('status', 'alpa')->count(),
        ];
        // Statistik logbook
        $logbook_summary = [
            'filled_days' => $activity->logbooks->count(),
            'total_days' => $activity->presences->count(),
        ];
        // Statistik tugas
        $assignment_summary = [
            'completed' => $activity->assignments->where('status', 'selesai')->count(),
            'pending' => $activity->assignments->where('status', '!=', 'selesai')->count(),
        ];
        // Status laporan dan penilaian
        $report_status = $activity->final_report ? 'Sudah diunggah' : 'Belum diunggah';
        $final_assessment_status = $activity->finalAssessment ? 'Sudah dinilai' : 'Belum dinilai';
        return Inertia::render('mentor/activities/[id]', [
            'activity' => array_merge($activity->toArray(), [
                'presence_summary' => $presence_summary,
                'logbook_summary' => $logbook_summary,
                'assignment_summary' => $assignment_summary,
                'report_status' => $report_status,
                'final_assessment_status' => $final_assessment_status,
            ]),
            'student' => $student,
            'mentor' => $mentor,
        ]);
    })->name('mentor.activities.show');
    // Profil lengkap mahasiswa pada aktivitas magang (untuk mentor)
    Route::get('/mentor/activities/{id}/profile', [
        App\Http\Controllers\InternshipActivityController::class,
        'studentProfile'
    ])->middleware(['auth'])->name('mentor.activities.student-profile');
    // Presensi untuk mentor: detail presensi aktivitas
    Route::get('/mentor/activities/{id}/presence', function ($id) {
        $mentor = auth()->user()->mentor;
        $activity = \App\Models\InternshipActivity::with([
            'presences',
        ])->findOrFail($id);
        if (!$mentor || $activity->mentor_id !== $mentor->id) {
            abort(403, 'Akses tidak diizinkan');
        }
        $presences = $activity->presences()->orderBy('date')->get();
        return Inertia::render('mentor/activities/[id]/presence', [
            'activity' => $activity,
            'presences' => $presences,
        ]);
    })->name('mentor.activities.presence');
    // Logbook untuk mentor: detail logbook aktivitas
    Route::get('/mentor/activities/{id}/logbook', function ($id) {
        $mentor = auth()->user()->mentor;
        $activity = \App\Models\InternshipActivity::with([
            'logbooks',
            'internshipApplication.student.user',
        ])->findOrFail($id);
        if (!$mentor || $activity->mentor_id !== $mentor->id) {
            abort(403, 'Akses tidak diizinkan');
        }
        $logbooks = $activity->logbooks()->orderByDesc('date')->get();
        $student = $activity->internshipApplication?->student;
        return Inertia::render('mentor/activities/[id]/logbook', [
            'activity' => $activity,
            'logbooks' => $logbooks,
            'student' => $student,
        ]);
    })->name('mentor.activities.logbook');
    // Assignment routes for mentor
    Route::middleware(['auth', 'can:isMentor'])->prefix('mentor/activities/{activity}')->group(function () {
        Route::get('/assignments/create', [\App\Http\Controllers\MentorAssignmentController::class, 'create'])->name('mentor.activities.assignments.create');
        Route::post('/assignments', [\App\Http\Controllers\MentorAssignmentController::class, 'store'])->name('mentor.activities.assignments.store');
        Route::get('/assignments', [\App\Http\Controllers\MentorAssignmentController::class, 'activityAssignments'])->name('mentor.activities.assignments');
        Route::get('/assignments/{assignment}', [\App\Http\Controllers\MentorAssignmentController::class, 'show'])->name('mentor.activities.assignments.show');
        Route::get('/assignments/{assignment}/edit', [\App\Http\Controllers\MentorAssignmentController::class, 'edit'])->name('mentor.activities.assignments.edit');
        Route::put('/assignments/{assignment}', [\App\Http\Controllers\MentorAssignmentController::class, 'update'])->name('mentor.activities.assignments.update');
        Route::delete('/assignments/{assignment}', [\App\Http\Controllers\MentorAssignmentController::class, 'destroy'])->name('mentor.activities.assignments.destroy');
    });
    // Route PATCH untuk feedback mentor pada logbook
    Route::patch('/mentor/activities/{activity}/logbook/{logbook}/feedback', [\App\Http\Controllers\LogbookController::class, 'feedbackByMentor'])
        ->middleware(['auth', 'can:isMentor'])
        ->name('mentor.activities.logbook.feedback');
    // Route detail logbook mentor
    Route::get('/mentor/activities/{activity}/logbook/{logbook}', function ($activity, $logbook) {
        $mentor = auth()->user()->mentor;
        $logbookModel = \App\Models\Logbook::findOrFail($logbook);
        $activityModel = $logbookModel->internshipActivity;
        if (!$mentor || !$activityModel || $activityModel->mentor_id !== $mentor->id) {
            abort(403, 'Akses tidak diizinkan');
        }
        $student = $activityModel->internshipApplication?->student;
        return Inertia::render('mentor/activities/[id]/logbook/[logbookId]', [
            'logbook' => $logbookModel,
            'activity' => $activityModel,
            'student' => $student,
        ]);
    })->middleware(['auth', 'can:isMentor'])->name('mentor.activities.logbook.show');
    // Route untuk mentor mengisi feedback laporan akhir
    Route::post('/mentor/activities/{id}/report/feedback', [\App\Http\Controllers\InternshipActivityController::class, 'updateReportFeedback'])->name('mentor.activities.report.feedback');
    // Route GET untuk halaman report mentor
    Route::get('/mentor/activities/{id}/report', function ($id) {
        $mentor = auth()->user()->mentor;
        $activity = \App\Models\InternshipActivity::with([
            'internshipApplication.student.user',
            'mentor.user',
        ])->findOrFail($id);
        if (!$mentor || $activity->mentor_id !== $mentor->id) {
            abort(403, 'Akses tidak diizinkan');
        }
        $student = $activity->internshipApplication?->student;
        // Debug: log data yang dikirim ke frontend
        \Log::info('Mentor Report Data', $activity->toArray());
        // Pastikan data yang dikirim ke frontend sudah array (bukan Eloquent model)
        return Inertia::render('mentor/activities/[id]/report', [
            'activity' => $activity->toArray(),
            'student' => $student ? $student->toArray() : null,
        ]);
    })->middleware(['auth', 'can:isMentor'])->name('mentor.activities.report');
    // Route untuk mentor mengisi penilaian akhir
    Route::middleware(['auth', 'can:isMentor'])->prefix('mentor/activities/{id}')->group(function () {
        Route::post('/final-assessment', [\App\Http\Controllers\FinalAssessmentController::class, 'store']);
        Route::put('/final-assessment', [\App\Http\Controllers\FinalAssessmentController::class, 'update']);
    });
    // Route GET untuk halaman final assessment mentor
    Route::get('/mentor/activities/{id}/final-assessment', function ($id) {
        $mentor = auth()->user()->mentor;
        $activity = \App\Models\InternshipActivity::with([
            'internshipApplication.student.user',
            'mentor.user',
            'finalAssessment',
        ])->findOrFail($id);
        if (!$mentor || $activity->mentor_id !== $mentor->id) {
            abort(403, 'Akses tidak diizinkan');
        }
        $finalAssessment = $activity->finalAssessment;
        return Inertia::render('mentor/activities/[id]/final-assessment', [
            'activity' => $activity,
            'finalAssessment' => $finalAssessment,
        ]);
    })->middleware(['auth', 'can:isMentor'])->name('mentor.activities.final-assessment');
    // TODO: Tambahkan route lain untuk mentor jika diperlukan
});

// Halaman legal dan persetujuan
Route::get('/consent', function () {
    return Inertia::render('consent');
})->name('consent');
Route::get('/terms', function () {
    return Inertia::render('terms');
})->name('terms');
Route::get('/privacy', function () {
    return Inertia::render('privacy');
})->name('privacy');
Route::get('/license', function () {
    return Inertia::render('license');
})->name('license');
Route::get('/disclaimer', function () {
    return Inertia::render('disclaimer');
})->name('disclaimer');

// Internship management routes for admin
Route::prefix('admin/internship-managements')->middleware(['web', 'auth'])->group(function () {
    Route::post('{id}/approve', [InternshipManagementActionController::class, 'approve'])->name('internship-managements.approve');
    Route::match(['get', 'post'], '{id}/assign-mentor', [InternshipManagementActionController::class, 'assignMentor'])->name('internship-managements.assign-mentor');
    Route::post('{id}/upload-letter', [InternshipManagementActionController::class, 'uploadLetter'])->name('internship-managements.upload-letter');
    Route::post('{id}/upload-certificate', [InternshipManagementActionController::class, 'uploadCertificate'])->name('internship-managements.upload-certificate');
    Route::get('{id}/edit', [InternshipManagementActionController::class, 'edit'])->name('internship-management.edit');
    Route::put('{id}', [InternshipManagementActionController::class, 'update'])->name('internship-management.update');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
