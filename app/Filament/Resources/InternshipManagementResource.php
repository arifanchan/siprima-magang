<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Filament\Resources;

use App\Filament\Resources\InternshipManagementResource\Pages;
use App\Filament\Resources\InternshipManagementResource\Pages\ViewInternshipManagement;
use App\Models\InternshipActivity;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class InternshipManagementResource extends Resource
{
    protected static ?string $model = InternshipActivity::class;
    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-list';
    protected static ?string $navigationGroup = 'Monitoring & Management';
    protected static ?int $navigationSort = 8;
    protected static ?string $label = 'Internship Management';
    protected static ?string $pluralLabel = 'Internship Management';

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('internshipApplication.student.user.name')->label('Student')->searchable(),
                Tables\Columns\TextColumn::make('internshipApplication.student.university')->label('University')->searchable(),
                Tables\Columns\TextColumn::make('internshipApplication.status')->label('Application Status')->badge(),
                Tables\Columns\TextColumn::make('status')->label('Activity Status')->badge(),
                Tables\Columns\TextColumn::make('mentor.user.name')->label('Mentor')->searchable(),
                Tables\Columns\TextColumn::make('start_date')->date()->sortable(),
                Tables\Columns\TextColumn::make('end_date')->date()->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'active' => 'Active',
                        'canceled' => 'Canceled',
                        'completed' => 'Completed',
                    ]),
                Tables\Filters\SelectFilter::make('internshipApplication.status')
                    ->label('Application Status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                    ]),
                Tables\Filters\SelectFilter::make('mentor_id')
                    ->label('Mentor')
                    ->options(fn () => \App\Models\Mentor::with('user')->get()->pluck('user.name', 'id')),
                Tables\Filters\SelectFilter::make('internshipApplication.student.university')
                    ->label('University')
                    ->searchable(),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
//                Tables\Actions\EditAction::make()
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageInternships::route('/'),
            'view' => Pages\ViewInternshipManagement::route('/{record}'),
            'edit' => Pages\EditInternshipManagement::route('/{record}/edit'),
        ];
    }
}
