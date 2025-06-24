<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Gate untuk validasi role mentor
        Gate::define('isMentor', function (\App\Models\User $user) {
            \Log::info('Gate isMentor check', [
                'user_id' => $user->id,
                'role' => $user->role,
                'mentor_exists' => $user->mentor !== null,
            ]);
            return $user->role === 'mentor' && $user->mentor !== null;
        });

        // Gate untuk validasi role student/user
        Gate::define('isStudent', function (\App\Models\User $user) {
            return in_array($user->role, ['student', 'user']);
        });

        // Gate untuk validasi role user saja (bukan student, bukan mentor)
        Gate::define('isUser', function (\App\Models\User $user) {
            return $user->role === 'user';
        });
    }
}
