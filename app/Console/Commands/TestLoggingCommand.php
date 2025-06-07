<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\LoggingService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class TestLoggingCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-logging';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the logging functionality';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing logging functionality...');

        // Test direct logging
        LoggingService::info('Test info log message');
        LoggingService::debug('Test debug log message');
        LoggingService::warning('Test warning log message');
        LoggingService::error('Test error log message');
        LoggingService::critical('Test critical log message');

        // Skip model logging tests since database tables don't exist
        $this->info('Skipping model logging tests (database tables not created)');

        // Test custom logging
        LoggingService::internshipEvent('test', 1, 1, [
            'test_data' => 'Test internship event'
        ]);

        // Test auth logging
        LoggingService::authEvent('test', (object)['id' => 1, 'email' => 'test@example.com'], [
            'test_data' => 'Test auth event'
        ]);

        $this->info('Logging test completed. Check the log file for results.');
    }
}
