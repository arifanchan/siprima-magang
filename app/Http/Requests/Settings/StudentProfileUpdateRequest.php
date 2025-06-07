<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StudentProfileUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'student_number' => ['required', 'string', 'max:255', Rule::unique('students', 'student_number')->ignore(optional($this->user()->student)->id)],
            'study_program' => ['required', 'string', 'max:255'],
            'faculty' => ['required', 'string', 'max:255'],
            'university' => ['required', 'string', 'max:255'],
            'entry_year' => ['required', 'integer'],
            'bio' => ['nullable', 'string'],
            'ktp_file' => ['nullable', 'string', 'max:255'],
            'ktm_file' => ['nullable', 'string', 'max:255'],
            'other_identity_file' => ['nullable', 'string', 'max:255'],
            'transcript_file' => ['nullable', 'string', 'max:255'],
            'advisor_name' => ['nullable', 'string', 'max:255'],
            'advisor_phone' => ['nullable', 'string', 'max:20'],
        ];
    }
}

