<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Filament\Resources;

use App\Filament\Resources\InternshipActivityResource\Pages;
use App\Filament\Resources\InternshipActivityResource\RelationManagers;
use App\Models\InternshipActivity;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class InternshipActivityResource extends Resource
{
    protected static ?string $model = InternshipActivity::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationGroup = 'Internship';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Placeholder::make('student_name')
                    ->label('Student')
                    ->content(fn ($record) => $record && $record->internshipApplication && $record->internshipApplication->student && $record->internshipApplication->student->user ? $record->internshipApplication->student->user->name : '-'),
                Forms\Components\Placeholder::make('university')
                    ->label('University')
                    ->content(fn ($record) => $record && $record->internshipApplication && $record->internshipApplication->student ? $record->internshipApplication->student->university : '-'),
                Forms\Components\Select::make('status')
                    ->label('Status')
                    ->options([
                        'pending' => 'Pending',
                        'active' => 'Active',
                        'canceled' => 'Canceled',
                        'completed' => 'Completed',
                    ])
                    ->required(),
                Forms\Components\Select::make('mentor_id')
                    ->label('Mentor')
                    ->options(fn () => \App\Models\Mentor::with('user')->get()->pluck('user.name', 'id'))
                    ->searchable()
                    ->required(),
                Forms\Components\DatePicker::make('start_date')->label('Start Date')->required(),
                Forms\Components\DatePicker::make('end_date')->label('End Date')->required(),
                Forms\Components\FileUpload::make('final_presentation')
                    ->label('Final Presentation')
                    ->disk('public')
                    ->directory(fn ($get, $state, $record = null) =>
                        $record && $record->internshipApplication && $record->internshipApplication->student
                            ? 'users/' . $record->internshipApplication->student->user_id . '/internship/final_presentations'
                            : 'users/unknown/internship/final_presentations'
                    )
                    ->getUploadedFileNameForStorageUsing(function ($file, $get, $set, $record) {
                        return now()->format('Y-m-d') . '_' . $file->getClientOriginalName();
                    })
                    ->preserveFilenames()
                    ->maxSize(10240)
                    ->downloadable(true)
                    ->previewable(true),
                Forms\Components\FileUpload::make('final_report')
                    ->label('Final Report')
                    ->disk('public')
                    ->directory(fn ($get, $state, $record = null) =>
                        $record && $record->internshipApplication && $record->internshipApplication->student
                            ? 'users/' . $record->internshipApplication->student->user_id . '/internship/final_reports'
                            : 'users/unknown/internship/final_reports'
                    )
                    ->getUploadedFileNameForStorageUsing(function ($file, $get, $set, $record) {
                        return now()->format('Y-m-d') . '_' . $file->getClientOriginalName();
                    })
                    ->downloadable(true)
                    ->previewable(true),
                Forms\Components\FileUpload::make('completion_letter')
                    ->label('Completion Letter')
                    ->disk('public')
                    ->directory(fn ($get, $state, $record = null) =>
                        $record && $record->internshipApplication && $record->internshipApplication->student
                            ? 'users/' . $record->internshipApplication->student->user_id . '/internship/completion_letters'
                            : 'users/unknown/internship/completion_letters'
                    )
                    ->getUploadedFileNameForStorageUsing(function ($file, $get, $set, $record) {
                        return now()->format('Y-m-d') . '_' . $file->getClientOriginalName();
                    })
                    ->downloadable(true)
                    ->previewable(true),
                Forms\Components\FileUpload::make('completion_certificate')
                    ->label('Completion Certificate')
                    ->disk('public')
                    ->directory(fn ($get, $state, $record = null) =>
                        $record && $record->internshipApplication && $record->internshipApplication->student
                            ? 'users/' . $record->internshipApplication->student->user_id . '/internship/completion_certificates'
                            : 'users/unknown/internship/completion_certificates'
                    )
                    ->getUploadedFileNameForStorageUsing(function ($file, $get, $set, $record) {
                        return now()->format('Y-m-d') . '_' . $file->getClientOriginalName();
                    })
                    ->downloadable(true)
                    ->previewable(true),
                Forms\Components\Textarea::make('feedback')->label('Feedback'),
                // DSS fields (hidden for now, for future DSS system)
                Forms\Components\TextInput::make('dss_status')->label('DSS Status')->visible(false),
                Forms\Components\TextInput::make('dss_score')->label('DSS Score')->visible(false),
                Forms\Components\TextInput::make('dss_recommendation')->label('DSS Recommendation')->visible(false),
                Forms\Components\Textarea::make('dss_notes')->label('DSS Notes')->visible(false),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('internshipApplication.student.user.name')->label('Student')->searchable(),
                Tables\Columns\TextColumn::make('mentor.user.name')->label('Mentor')->searchable(),
                Tables\Columns\TextColumn::make('status')->label('Status')->badge()->searchable(),
                Tables\Columns\TextColumn::make('start_date')->label('Start Date')->searchable(),
                Tables\Columns\TextColumn::make('end_date')->label('End Date')->searchable(),
                Tables\Columns\TextColumn::make('completion_letter')->label('Completion Letter')->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('completion_certificate')->label('Completion Certificate')->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'active' => 'Active',
                        'canceled' => 'Canceled',
                        'completed' => 'Completed',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListInternshipActivities::route('/'),
            'create' => Pages\CreateInternshipActivity::route('/create'),
            'edit' => Pages\EditInternshipActivity::route('/{record}/edit'),
        ];
    }
}
