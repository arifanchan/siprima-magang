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

    // Store a new final assessment (usually not used, created automatically)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'internship_activity_id' => 'required|exists:internship_activities,id|unique:final_assessments,internship_activity_id',
            'assessment_date' => 'nullable|date',
            'discipline' => 'nullable|integer|min:0|max:100',
            'responsibility' => 'nullable|integer|min:0|max:100',
            'teamwork' => 'nullable|integer|min:0|max:100',
            'initiative' => 'nullable|integer|min:0|max:100',
            'communication' => 'nullable|integer|min:0|max:100',
            'technical_skill' => 'nullable|integer|min:0|max:100',
            'final_score' => 'nullable|integer|min:0|max:100',
            'comment' => 'nullable|string',
        ]);
        $assessment = FinalAssessment::create($validated);
        return response()->json($assessment, 201);
    }

    // Update an existing final assessment
    public function update(Request $request, $id)
    {
        $assessment = FinalAssessment::findOrFail($id);
        $validated = $request->validate([
            'assessment_date' => 'nullable|date',
            'discipline' => 'nullable|integer|min:0|max:100',
            'responsibility' => 'nullable|integer|min:0|max:100',
            'teamwork' => 'nullable|integer|min:0|max:100',
            'initiative' => 'nullable|integer|min:0|max:100',
            'communication' => 'nullable|integer|min:0|max:100',
            'technical_skill' => 'nullable|integer|min:0|max:100',
            'final_score' => 'nullable|integer|min:0|max:100',
            'comment' => 'nullable|string',
        ]);
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
