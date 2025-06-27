<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Mentor;
use App\Models\Student;

class MentorDashboardController extends Controller
{
    public function index(Request $request)
    {
        $mentor = auth()->user()->mentor;
        $students = collect();
        if ($mentor) {
            $activities = $mentor->internshipActivities()
                ->where('status', 'active')
                ->with(['internshipApplication.student.user'])
                ->get();
            $students = $activities->map(function ($activity) {
                $student = $activity->internshipApplication?->student;
                return [
                    'id' => $student?->id,
                    'user' => [
                        'name' => $student?->user?->name ?? '-',
                        'email' => $student?->user?->email ?? '-',
                        'phone' => $student?->user?->phone ?? '-',
                    ],
                    'university' => $student?->university,
                    'study_program' => $student?->study_program,
                    'internship_period' => $activity->start_date . ' - ' . $activity->end_date,
                    'start_date' => $activity->start_date,
                    'end_date' => $activity->end_date,
                    'logbook_count' => $activity->logbooks()->count(),
                    'assignment_count' => $activity->assignments()->count(),
                    'presence_count' => $activity->presences()->count(),
                    'presence_percent' => $activity->presence_percent,
                    'logbook_percent' => $activity->logbook_percent,
                    'assignment_percent' => $activity->assignment_percent,
                    'status' => $activity->status,
                    'final_presentation_status' => $activity->final_presentation ? 'Sudah' : 'Belum',
                    'final_report_status' => $activity->final_report ? 'Sudah' : 'Belum',
                    'final_presentation_percent' => $activity->final_presentation ? 100 : 0,
                    'final_report_percent' => $activity->final_report ? 100 : 0,
                ];
            })->filter(fn($s) => $s['id']);
        }
        return Inertia::render('mentor/dashboard', [
            'students' => $students->values(),
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }
}
