<?php

namespace App\Http\Controllers\Settings;

use App\Http\Requests\Settings\StudentProfileUpdateRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentProfileController extends \App\Http\Controllers\Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $student = $user->student;
        return Inertia::render('settings/student-profile', [
            'student' => $student,
        ]);
    }

    public function update(StudentProfileUpdateRequest $request)
    {
        $user = $request->user();
        $student = $user->student;
        if (!$student) {
            $student = $user->student()->create($request->validated());
        } else {
            $student->update($request->validated());
        }
        return redirect()->route('student-profile.edit')->with('status', 'Student profile updated successfully.');
    }
}

