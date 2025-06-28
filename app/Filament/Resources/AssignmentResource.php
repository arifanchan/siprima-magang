<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Filament\Resources;

use App\Filament\Resources\AssignmentResource\Pages;
use App\Models\Assignment;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class AssignmentResource extends Resource
{
    protected static ?string $model = Assignment::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationGroup = 'Internship';
    protected static ?int $navigationSort = 4;
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('internship_activity_id')
                    ->label('Internship Activity')
                    ->relationship('internshipActivity', 'id')
                    ->searchable()
                    ->required(),
                Forms\Components\TextInput::make('title')->label('Title')->required(),
                Forms\Components\Textarea::make('description')->label('Description')->required(),
                Forms\Components\DatePicker::make('due_date')->label('Due Date')->required(),
                Forms\Components\Select::make('status')
                    ->label('Status')
                    ->options([
                        'pending' => 'Pending',
                        'in_progress' => 'In Progress',
                        'submitted' => 'Submitted',
                        'reviewed' => 'Reviewed',
                        'completed' => 'Completed',
                    ])
                    ->required(),
                Forms\Components\FileUpload::make('evidence_file')
                    ->label('Evidence File')
                    ->disk('public')
                    ->directory(fn ($get, $state, $record = null) =>
                        $record && $record->internshipActivity && $record->internshipActivity->internshipApplication && $record->internshipActivity->internshipApplication->student
                            ? 'users/' . $record->internshipActivity->internshipApplication->student->user_id . '/internship/assignments'
                            : 'users/unknown/internship/assignments'
                    )
                    ->getUploadedFileNameForStorageUsing(function ($file, $get, $set, $record) {
                        return now()->format('Y-m-d') . '_' . $file->getClientOriginalName();
                    })
                    ->downloadable(true)
                    ->previewable(true),
                Forms\Components\Textarea::make('output')->label('Output'),
                // DSS fields (hidden for now)
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
                Tables\Columns\TextColumn::make('internshipActivity.internshipApplication.student.user.name')->label('Student')->searchable(),
                Tables\Columns\TextColumn::make('title')->label('Title')->searchable(),
                Tables\Columns\TextColumn::make('due_date')->label('Due Date')->searchable(),
                Tables\Columns\TextColumn::make('status')->label('Status')->badge()->searchable(),
                Tables\Columns\TextColumn::make('evidence_file')->label('Evidence')->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'in_progress' => 'In Progress',
                        'submitted' => 'Submitted',
                        'reviewed' => 'Reviewed',
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
            'index' => Pages\ListAssignments::route('/'),
            'create' => Pages\CreateAssignment::route('/create'),
            'edit' => Pages\EditAssignment::route('/{record}/edit'),
        ];
    }
}
