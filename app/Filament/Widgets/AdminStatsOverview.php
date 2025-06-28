<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\User;
use App\Models\Student;
use App\Models\Mentor;
use App\Models\InternshipApplication;
use App\Models\InternshipActivity;

class AdminStatsOverview extends BaseWidget
{
    protected function getCards(): array
    {
        return [
            Stat::make('Total Users', User::count()),
            Stat::make('Total Students', Student::count()),
            Stat::make('Total Mentors', Mentor::count()),
            Stat::make('Internship Applications', InternshipApplication::count()),
            Stat::make('Internship Activities', InternshipActivity::count()),
            Stat::make('Active Activities', InternshipActivity::where('status', 'active')->count()),
            Stat::make('Completed Activities', InternshipActivity::where('status', 'completed')->count()),
        ];
    }
}
