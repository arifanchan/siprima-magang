<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Filament\Resources\InternshipManagementResource\Pages;

use App\Filament\Resources\InternshipManagementResource;
use Filament\Resources\Pages\EditRecord;

class EditInternshipManagement extends EditRecord
{
    protected static string $resource = InternshipManagementResource::class;
    protected static string $view = 'filament.resources.internship-management.edit';

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

