<?php

namespace App\Models\Traits;

use App\Services\LoggingService;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    /**
     * Boot the trait.
     */
    public static function bootLogsActivity(): void
    {
        static::created(function ($model) {
            LoggingService::dbOperation(
                'create',
                class_basename($model),
                $model->id,
                $model->getAttributes(),
                ['user_id' => Auth::id()]
            );
        });

        static::updated(function ($model) {
            LoggingService::dbOperation(
                'update',
                class_basename($model),
                $model->id,
                $model->getDirty(),
                ['user_id' => Auth::id()]
            );
        });

        static::deleted(function ($model) {
            LoggingService::dbOperation(
                'delete',
                class_basename($model),
                $model->id,
                [],
                ['user_id' => Auth::id()]
            );
        });
    }
}
