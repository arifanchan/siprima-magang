<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Http\Controllers;

use App\Models\FinalAssessment;
use App\Models\InternshipActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FinalAssessmentController extends Controller
{
    // List all final assessments (admin only or for API)
    public function index()
    {
        $assessments = FinalAssessment::with([
            'internshipActivity.mentor.user',
            'internshipActivity.internshipApplication.student.user',
            'internshipActivity.internshipApplication.student.profile',
        ])->latest()->get();
        return response()->json($assessments);
    }

    // Show a single final assessment
    public function show($id)
    {
        $assessment = FinalAssessment::with([
            'internshipActivity.mentor.user',
            'internshipActivity.internshipApplication.student.user',
            'internshipActivity.internshipApplication.student.profile',
        ])->findOrFail($id);
        return response()->json($assessment);
    }

    // Store a new final assessment (mentor)
    public function store(Request $request, $id)
    {
        $validated = $request->validate([
            'assessment_date' => 'nullable|date',
            'discipline' => 'nullable|integer|min:0|max:100',
            'responsibility' => 'nullable|integer|min:0|max:100',
            'teamwork' => 'nullable|integer|min:0|max:100',
            'initiative' => 'nullable|integer|min:0|max:100',
            'communication' => 'nullable|integer|min:0|max:100',
            'technical_skill' => 'nullable|integer|min:0|max:100',
            'comment' => 'nullable|string',
        ]);
        $fields = [
            $validated['discipline'] ?? 0,
            $validated['responsibility'] ?? 0,
            $validated['teamwork'] ?? 0,
            $validated['initiative'] ?? 0,
            $validated['communication'] ?? 0,
            $validated['technical_skill'] ?? 0,
        ];
        $final_score = round(array_sum($fields) / count($fields));
        $validated['final_score'] = $final_score;
        $validated['internship_activity_id'] = $id;
        // Pastikan belum ada assessment untuk activity ini
        if (\App\Models\FinalAssessment::where('internship_activity_id', $id)->exists()) {
            return response()->json(['message' => 'Penilaian akhir sudah ada untuk aktivitas ini.'], 422);
        }
        $assessment = FinalAssessment::create($validated);
        return response()->json($assessment, 201);
    }

    // Update an existing final assessment (mentor)
    public function update(Request $request, $id)
    {
        $assessment = FinalAssessment::where('internship_activity_id', $id)->firstOrFail();
        $validated = $request->validate([
            'assessment_date' => 'nullable|date',
            'discipline' => 'nullable|integer|min:0|max:100',
            'responsibility' => 'nullable|integer|min:0|max:100',
            'teamwork' => 'nullable|integer|min:0|max:100',
            'initiative' => 'nullable|integer|min:0|max:100',
            'communication' => 'nullable|integer|min:0|max:100',
            'technical_skill' => 'nullable|integer|min:0|max:100',
            'comment' => 'nullable|string',
        ]);
        $fields = [
            $validated['discipline'] ?? $assessment->discipline ?? 0,
            $validated['responsibility'] ?? $assessment->responsibility ?? 0,
            $validated['teamwork'] ?? $assessment->teamwork ?? 0,
            $validated['initiative'] ?? $assessment->initiative ?? 0,
            $validated['communication'] ?? $assessment->communication ?? 0,
            $validated['technical_skill'] ?? $assessment->technical_skill ?? 0,
        ];
        $final_score = round(array_sum($fields) / count($fields));
        $validated['final_score'] = $final_score;
        $assessment->update($validated);
        return response()->json($assessment);
    }

    // Delete a final assessment (admin only)
    public function destroy($id)
    {
        $assessment = FinalAssessment::findOrFail($id);
        $assessment->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
