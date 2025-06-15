<?php

namespace App\Filament\Resources\InternshipActivityResource\Pages;

use App\Filament\Resources\InternshipActivityResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditInternshipActivity extends EditRecord
{
    protected static string $resource = InternshipActivityResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}

