<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'emailOrPhone' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if (!filter_var($value, FILTER_VALIDATE_EMAIL) && !preg_match('/^08[0-9]{8,13}$/', $value)) {
                        $fail('The :attribute must be a valid email address or phone number (starting with 08).');
                    }
                },
                function ($attribute, $value, $fail) {
                    if (filter_var($value, FILTER_VALIDATE_EMAIL)) {
                        if (\App\Models\User::where('email', $value)->exists()) {
                            $fail('The email has already been taken.');
                        }
                    } elseif (preg_match('/^08[0-9]{8,13}$/', $value)) {
                        if (\App\Models\User::where('phone', $value)->exists()) {
                            $fail('The phone number has already been taken.');
                        }
                    }
                },
            ],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $email = null;
        $phone = null;
        if (filter_var($request->emailOrPhone, FILTER_VALIDATE_EMAIL)) {
            $email = $request->emailOrPhone;
        } elseif (preg_match('/^08[0-9]{8,13}$/', $request->emailOrPhone)) {
            $phone = $request->emailOrPhone;
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $email,
            'phone' => $phone,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
