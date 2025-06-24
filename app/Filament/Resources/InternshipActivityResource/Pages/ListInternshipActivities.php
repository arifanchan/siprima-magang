<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Filament\Resources\InternshipActivityResource\Pages;

use App\Filament\Resources\InternshipActivityResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListInternshipActivities extends ListRecords
{
    protected static string $resource = InternshipActivityResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
