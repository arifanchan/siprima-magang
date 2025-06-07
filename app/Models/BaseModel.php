<?php

namespace App\Models;

use App\Services\LoggingService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

abstract class BaseModel extends Model
{
    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
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
