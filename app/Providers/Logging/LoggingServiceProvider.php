<?php

namespace App\Providers\Logging;

use Illuminate\Support\ServiceProvider;
use App\Services\LoggingService;

class LoggingServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(LoggingService::class, function ($app) {
            return new LoggingService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Create logs directory if it doesn't exist
        if (!file_exists(storage_path('logs'))) {
            mkdir(storage_path('logs'), 0755, true);
        }
    }
}
