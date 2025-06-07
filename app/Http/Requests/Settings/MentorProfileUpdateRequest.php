<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MentorProfileUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'nip' => ['required', 'string', 'max:255', Rule::unique('mentors', 'nip')->ignore(optional($this->user()->mentor)->id)],
            'division' => ['required', 'string', 'max:255'],
            'expertise' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
        ];
    }
}

