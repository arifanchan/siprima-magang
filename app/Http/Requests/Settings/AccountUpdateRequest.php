<?php
// AccountUpdateRequest moved from ProfileUpdateRequest
// ...existing code from ProfileUpdateRequest now in AccountUpdateRequest...

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\User;

class AccountUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'phone' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            // role tidak perlu divalidasi di sini, hanya admin yang boleh mengubah role
        ];
    }
}
