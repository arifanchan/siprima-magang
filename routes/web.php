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
    Route::get('/mentor/dashboard', function () {
        $mentor = auth()->user()->mentor;
        $students = $mentor ? $mentor->internshipActivities()->with(['internshipApplication.student.user'])->get()->map(function ($activity) {
            $student = $activity->internshipApplication->student;
            return [
                'id' => $student->id,
                'user' => $student->user,
                'university' => $student->university,
                'study_program' => $student->study_program,
                'internship_period' => $activity->start_date . ' - ' . $activity->end_date,
            ];
        }) : collect();
        return Inertia::render('mentor/dashboard', [
            'students' => $students,
        ]);
    })->name('mentor.dashboard');
    Route::get('/mentor/profile', [\App\Http\Controllers\MentorProfileController::class, 'show'])->name('mentor.profile.show');
    Route::get('/mentor/profile/edit', [\App\Http\Controllers\ProfileEditController::class, 'edit'])->name('mentor.profile.edit');
    Route::post('/mentor/profile/edit', [\App\Http\Controllers\ProfileEditController::class, 'update'])->name('mentor.profile.update');
    Route::get('/mentor/mentor/edit', [\App\Http\Controllers\MentorEditController::class, 'edit'])->name('mentor.mentor.edit');
    Route::post('/mentor/mentor/edit', [\App\Http\Controllers\MentorEditController::class, 'update'])->name('mentor.mentor.update');
    Route::get('/mentor/medsos/edit', [\App\Http\Controllers\MediaSosialEditController::class, 'edit'])->name('mentor.medsos.edit');
    Route::post('/mentor/medsos/edit', [\App\Http\Controllers\MediaSosialEditController::class, 'update'])->name('mentor.medsos.update');
    // TODO: Tambahkan route lain untuk mentor jika diperlukan
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
