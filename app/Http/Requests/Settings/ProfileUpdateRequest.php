<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'gender' => ['nullable', Rule::in(['male', 'female'])],
            'birth_date' => ['nullable', 'date'],
            'address' => ['nullable', 'string', 'max:255'],
            'occupation' => ['nullable', 'string', 'max:255'],
            'identity_number' => ['nullable', 'string', 'max:255', Rule::unique('profiles', 'identity_number')->ignore(optional($this->user()->profile)->id)],
            'photo_file' => ['nullable', 'string', 'max:255'], // Untuk upload file, validasi bisa disesuaikan jika pakai file upload
            'dss_status' => ['nullable', 'string', 'max:255'],
            'dss_score' => ['nullable', 'numeric'],
            'dss_recommendation' => ['nullable', 'string', 'max:255'],
            'dss_notes' => ['nullable', 'string'],
        ];
    }
}

