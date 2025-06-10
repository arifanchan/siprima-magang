<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentEditController extends Controller
{
    public function edit()
    {
        $user = Auth::user();
        $student = $user->student;
        return Inertia::render('profile/student/edit', [
            'student' => $student,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        $student = $user->student;
        $validated = $request->validate([
            'student_number' => 'required|string|max:64|unique:students,student_number,' . ($student ? $student->id : 'NULL'),
            'study_program' => 'required|string|max:255',
            'faculty' => 'nullable|string|max:255',
            'university' => 'required|string|max:255',
            'entry_year' => 'required|integer',
            'semester_or_grade' => 'nullable|string|max:32',
            'latest_academic_score' => 'nullable|numeric',
            'bio' => 'nullable|string',
            'ktp_file' => 'nullable|string',
            'ktm_or_student_card_file' => 'nullable|string',
            'transcript_file' => 'nullable|string',
            'advisor_name' => 'nullable|string|max:255',
            'advisor_phone' => 'nullable|string|max:32',
        ]);
        if ($student) {
            $student->update($validated);
        } else {
            $user->student()->create($validated);
        }
        return redirect()->route('profile.student.edit')->with('success', 'Data mahasiswa berhasil diperbarui');
    }
}

