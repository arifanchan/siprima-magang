<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\InternshipActivity;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::unguard(); // Disable mass assignment protection globally

        Inertia::share('activeInternshipActivityId', function () {
            $user = Auth::user();
            if (!$user) return null;
            if ($user->student) {
                $activity = InternshipActivity::whereHas('internshipApplication', function ($q) use ($user) {
                    $q->where('student_id', $user->student->id)
                      ->where('status', 'approved');
                })->where('status', 'active')->first();
                return $activity?->id;
            }
            if ($user->mentor) {
                $activity = InternshipActivity::where('mentor_id', $user->mentor->id)
                    ->where('status', 'active')->first();
                return $activity?->id;
            }
            return null;
        });
    }
}
