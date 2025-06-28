<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Filament\Pages;

use Filament\Pages\Dashboard as BaseDashboard;
use App\Models\User;
use App\Models\Student;
use App\Models\Mentor;
use App\Models\InternshipApplication;
use App\Models\InternshipActivity;

class AdminDashboard extends BaseDashboard
{
    protected static ?string $navigationIcon = 'heroicon-o-home';
    protected static ?string $title = 'Dashboard';
    protected static ?string $navigationLabel = 'Dashboard';
    protected static ?int $navigationSort = -1;

    public function getWidgets(): array
    {
        return [
            \App\Filament\Widgets\AdminStatsOverview::class,
            \App\Filament\Widgets\NotificationWidget::class,
        ];
    }
}
