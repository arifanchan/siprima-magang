<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class LoggingService
{
    /**
     * Log an informational message
     *
     * @param string $message The message to log
     * @param array $context Additional context data
     * @return void
     */
    public static function info(string $message, array $context = []): void
    {
        Log::info($message, $context);
    }

    /**
     * Log a debug message
     *
     * @param string $message The message to log
     * @param array $context Additional context data
     * @return void
     */
    public static function debug(string $message, array $context = []): void
    {
        Log::debug($message, $context);
    }

    /**
     * Log a warning message
     *
     * @param string $message The message to log
     * @param array $context Additional context data
     * @return void
     */
    public static function warning(string $message, array $context = []): void
    {
        Log::warning($message, $context);
    }

    /**
     * Log an error message
     *
     * @param string $message The message to log
     * @param array $context Additional context data
     * @return void
     */
    public static function error(string $message, array $context = []): void
    {
        Log::error($message, $context);
    }

    /**
     * Log a critical message
     *
     * @param string $message The message to log
     * @param array $context Additional context data
     * @return void
     */
    public static function critical(string $message, array $context = []): void
    {
        Log::critical($message, $context);
    }

    /**
     * Log user authentication events
     *
     * @param string $action The authentication action (login, logout, etc.)
     * @param mixed $user The user being authenticated
     * @param array $additionalContext Additional context data
     * @return void
     */
    public static function authEvent(string $action, $user, array $additionalContext = []): void
    {
        $context = [
            'user_id' => $user->id ?? null,
            'email' => $user->email ?? null,
            'action' => $action,
        ];

        if (!empty($additionalContext)) {
            $context = array_merge($context, $additionalContext);
        }

        Log::info("Authentication: {$action}", $context);
    }

    /**
     * Log database operations
     *
     * @param string $action The database action (create, update, delete)
     * @param string $model The model being operated on
     * @param mixed $id The ID of the record
     * @param array $data The data being saved
     * @param array $additionalContext Additional context data
     * @return void
     */
    public static function dbOperation(string $action, string $model, $id, array $data = [], array $additionalContext = []): void
    {
        $context = [
            'model' => $model,
            'id' => $id,
            'action' => $action,
            'data' => $data,
        ];

        if (!empty($additionalContext)) {
            $context = array_merge($context, $additionalContext);
        }

        Log::info("Database: {$action} {$model}", $context);
    }

    /**
     * Log internship application events
     *
     * @param string $action The action being performed
     * @param mixed $applicationId The application ID
     * @param mixed $userId The user ID
     * @param array $additionalContext Additional context data
     * @return void
     */
    public static function internshipEvent(string $action, $applicationId, $userId, array $additionalContext = []): void
    {
        $context = [
            'application_id' => $applicationId,
            'user_id' => $userId,
            'action' => $action,
        ];

        if (!empty($additionalContext)) {
            $context = array_merge($context, $additionalContext);
        }

        Log::info("Internship: {$action}", $context);
    }
}
