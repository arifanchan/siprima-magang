<?php

use App\Http\Controllers\DocumentEditController;
use App\Http\Controllers\InternshipApplicationController;
use App\Http\Controllers\MediaSosialEditController;
use App\Http\Controllers\StudentEditController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfileEditController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware('auth')->group(function () {
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
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
