<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminProfileUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'nip' => ['required', 'string', 'max:255', Rule::unique('admins', 'nip')->ignore(optional($this->user()->admin)->id)],
            'division' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
        ];
    }
}

