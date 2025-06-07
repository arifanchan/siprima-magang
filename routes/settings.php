<?php

use App\Http\Controllers\Settings\AccountController;
use App\Http\Controllers\Settings\AdminProfileController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\MentorProfileController;
use App\Http\Controllers\Settings\StudentProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', 'settings/account');

    Route::get('settings/account', [AccountController::class, 'edit'])->name('account.edit');
    Route::patch('settings/account', [AccountController::class, 'update'])->name('account.update');
    Route::delete('settings/account', [AccountController::class, 'destroy'])->name('account.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');

    Route::get('settings/social-media', [\App\Http\Controllers\Settings\MediaSosialController::class, 'edit'])->name('media-sosial.edit');
    Route::patch('settings/social-media', [\App\Http\Controllers\Settings\MediaSosialController::class, 'update'])->name('media-sosial.update');

    Route::get('settings/admin-profile', [AdminProfileController::class, 'edit'])->name('admin-profile.edit');
    Route::patch('settings/admin-profile', [AdminProfileController::class, 'update'])->name('admin-profile.update');

    Route::get('settings/mentor-profile', [MentorProfileController::class, 'edit'])->name('mentor-profile.edit');
    Route::patch('settings/mentor-profile', [MentorProfileController::class, 'update'])->name('mentor-profile.update');

    Route::get('settings/student-profile', [StudentProfileController::class, 'edit'])->name('student-profile.edit');
    Route::patch('settings/student-profile', [StudentProfileController::class, 'update'])->name('student-profile.update');
});
