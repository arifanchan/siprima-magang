<?php

namespace App\Filament\Resources\InternshipApplicationResource\Pages;

use App\Filament\Resources\InternshipApplicationResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Tables;
use Filament\Tables\Actions\Action;

class ListInternshipApplications extends ListRecords
{
    protected static string $resource = InternshipApplicationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    public function table(\Filament\Tables\Table $table): \Filament\Tables\Table
    {
        return $table
            ->columns([
                \Filament\Tables\Columns\TextColumn::make('student.user.name')->label('Student')->searchable(),
                \Filament\Tables\Columns\TextColumn::make('status')->label('Status')->badge()->searchable(),
                \Filament\Tables\Columns\TextColumn::make('start_date')->label('Start Date')->searchable(),
                \Filament\Tables\Columns\TextColumn::make('end_date')->label('End Date')->searchable(),
            ])
            ->actions([
                Action::make('approve')
                    ->label('Approve')
                    ->color('success')
                    ->icon('heroicon-o-check')
                    ->visible(fn ($record) => $record->status === 'pending')
                    ->action(function ($record) {
                        $record->status = 'approved';
                        $record->save();
                        // Buat InternshipActivity jika belum ada
                        if (!$record->internshipActivity) {
                            \App\Models\InternshipActivity::create([
                                'internship_application_id' => $record->id,
                                'start_date' => $record->start_date,
                                'end_date' => $record->end_date,
                                'status' => 'pending', // mentor belum ditentukan
                            ]);
                        }
                    })
                    ->requiresConfirmation(),
                Action::make('reject')
                    ->label('Reject')
                    ->color('danger')
                    ->icon('heroicon-o-x-mark')
                    ->visible(fn ($record) => $record->status === 'pending')
                    ->action(function ($record) {
                        $record->status = 'rejected';
                        $record->save();
                    })
                    ->requiresConfirmation(),
            ]);
    }
}
