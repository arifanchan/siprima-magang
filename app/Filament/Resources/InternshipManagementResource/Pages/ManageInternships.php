<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Filament\Resources\InternshipManagementResource\Pages;

use App\Filament\Resources\InternshipManagementResource;
use Filament\Resources\Pages\ListRecords;
use Filament\Tables;
use Filament\Tables\Actions\ViewAction;
use Filament\Tables\Actions\ActionGroup;
use Filament\Tables\Actions\Action;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\ViewColumn;
use Filament\Tables\Columns\StackedColumn;
use Filament\Tables\Columns\GridColumn;
use Filament\Tables\Columns\SplitColumn;
use Filament\Tables\Columns\Layout\Section;
use Filament\Tables\Columns\Layout\Panel;

class ManageInternships extends ListRecords
{
    protected static string $resource = InternshipManagementResource::class;

    protected function getTableColumns(): array
    {
        return [
            TextColumn::make('internshipApplication.student.user.name')->label('Student'),
            TextColumn::make('internshipApplication.student.university')->label('University'),
            BadgeColumn::make('internshipApplication.status')
                ->label('Application Status')
                ->colors([
                    'primary' => 'pending',
                    'success' => 'approved',
                    'danger' => 'rejected',
                ]),
            BadgeColumn::make('status')
                ->label('Activity Status')
                ->colors([
                    'primary' => 'pending',
                    'success' => 'active',
                    'danger' => 'canceled',
                    'gray' => 'completed',
                ]),
            TextColumn::make('mentor.user.name')->label('Mentor'),
            TextColumn::make('start_date')->date()->sortable(),
            TextColumn::make('end_date')->date()->sortable(),
            BadgeColumn::make('final_report')
                ->label('Final Report')
                ->colors(fn ($state) => $state ? ['success'] : ['warning'])
                ->formatStateUsing(fn ($state) => $state ? 'Uploaded' : 'Not Uploaded'),
            BadgeColumn::make('completion_certificate')
                ->label('Certificate')
                ->colors(fn ($state) => $state ? ['success'] : ['warning'])
                ->formatStateUsing(fn ($state) => $state ? 'Uploaded' : 'Not Uploaded'),
        ];
    }

    protected function getTableActions(): array
    {
        return [
            ActionGroup::make([
                ViewAction::make('detail')
                    ->label('Detail')
                    ->icon('heroicon-o-eye')
                    ->url(fn ($record) => route('filament.resources.internship-managements.view', $record)),
                Action::make('verifyDocuments')
                    ->label('Verify Documents')
                    ->icon('heroicon-o-check-circle')
                    ->visible(fn ($record) => $record->internshipApplication->status === 'pending')
                    ->action(fn ($record) => $this->verifyDocuments($record)),
                Action::make('assignMentor')
                    ->label('Assign Mentor')
                    ->icon('heroicon-o-user-plus')
                    ->visible(fn ($record) => $record->mentor_id === null && $record->status === 'active')
                    ->action(fn ($record) => $this->assignMentor($record)),
                Action::make('uploadCertificate')
                    ->label('Upload Certificate')
                    ->icon('heroicon-o-arrow-up-tray')
                    ->visible(fn ($record) => $record->status === 'completed')
                    ->action(fn ($record) => $this->uploadCertificate($record)),
                Action::make('edit')
                    ->label('Edit')
                    ->icon('heroicon-o-pencil-square')
                    ->url(fn ($record) => route('internship-management.edit', $record->id))
                    ->openUrlInNewTab(),
            ]),
        ];
    }

    // Contoh implementasi aksi kustom (dummy, sesuaikan dengan kebutuhan sebenarnya)
    protected function verifyDocuments($record)
    {
        // Implementasi verifikasi dokumen
        // ...
        $record->internshipApplication->update(['status' => 'approved']);
        $record->save();
        $this->notify('success', 'Documents verified and application approved.');
    }

    protected function assignMentor($record)
    {
        // Implementasi penunjukan mentor (bisa tampilkan modal pilih mentor)
        // ...
        $this->notify('info', 'Assign mentor feature coming soon.');
    }

    protected function uploadCertificate($record)
    {
        // Implementasi upload sertifikat (bisa tampilkan modal upload file)
        // ...
        $this->notify('info', 'Upload certificate feature coming soon.');
    }
}
