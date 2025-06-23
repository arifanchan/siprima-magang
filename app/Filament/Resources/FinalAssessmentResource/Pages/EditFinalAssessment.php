<?php
namespace App\Filament\Resources\FinalAssessmentResource\Pages;

use App\Filament\Resources\FinalAssessmentResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditFinalAssessment extends EditRecord
{
    protected static string $resource = FinalAssessmentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}

