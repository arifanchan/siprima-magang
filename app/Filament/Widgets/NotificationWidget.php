<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Filament\Widgets;

use Filament\Widgets\Widget;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Auth;

class NotificationWidget extends Widget
{
    protected static string $view = 'filament.widgets.notification-widget';

    public function getNotifications()
    {
        return DatabaseNotification::query()
            ->where('notifiable_id', Auth::id())
            ->where('notifiable_type', Auth::user()::class)
            ->latest()
            ->limit(10)
            ->get();
    }
}

