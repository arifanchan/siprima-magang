<?php

namespace App\Filament\Resources\InternshipApplicationResource\Pages;

use App\Filament\Resources\InternshipApplicationResource;
use App\Models\InternshipActivity;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditInternshipApplication extends EditRecord
{
    protected static string $resource = InternshipApplicationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Remove mentor_id from main table, handle in afterSave
        unset($data['mentor_id']);
        return $data;
    }

    protected function afterSave(): void
    {
        $record = $this->record;
        $mentorId = $this->form->getState()['mentor_id'] ?? null;
        if ($record->status === 'approved' && $mentorId) {
            $activity = $record->internshipActivity;
            if (!$activity) {
                $activity = new InternshipActivity();
                $activity->internship_application_id = $record->id;
            }
            $activity->mentor_id = $mentorId;
            $activity->start_date = $record->start_date;
            $activity->end_date = $record->end_date;
            $activity->status = 'active';
            $activity->save();
        }
    }
}
