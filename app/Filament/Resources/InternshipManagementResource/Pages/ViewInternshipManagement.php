<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Filament\Resources\InternshipManagementResource\Pages;

use App\Filament\Resources\InternshipManagementResource;
use Filament\Resources\Pages\ViewRecord;

class ViewInternshipManagement extends ViewRecord
{
    protected static string $resource = InternshipManagementResource::class;
    protected static string $view = 'filament.resources.internship-management.detail';

    protected function getHeaderActions(): array
    {
        return [];
    }

    public function getViewData(): array
    {
        return [
            'record' => $this->getRecord(),
        ];
    }
}
