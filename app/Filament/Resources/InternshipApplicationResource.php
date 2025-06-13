<?php

namespace App\Filament\Resources;

use App\Filament\Resources\InternshipApplicationResource\Pages;
use App\Filament\Resources\InternshipApplicationResource\RelationManagers;
use App\Models\InternshipApplication;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class InternshipApplicationResource extends Resource
{
    protected static ?string $model = InternshipApplication::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Grid::make(2)
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->label('Status')
                            ->options([
                                'pending' => 'Pending',
                                'approved' => 'Approved',
                                'rejected' => 'Rejected',
                            ])
                            ->required(),
                        Forms\Components\Textarea::make('rejection_reason')
                            ->label('Rejection Reason')
                            ->visible(fn ($get) => $get('status') === 'rejected'),
                        Forms\Components\Textarea::make('admin_notes')
                            ->label('Admin Notes'),
                        Forms\Components\Select::make('mentor_id')
                            ->label('Mentor')
                            ->relationship('internshipActivity.mentor', 'user.name')
                            ->options(fn () => \App\Models\Mentor::with('user')->get()->pluck('user.name', 'id'))
                            ->visible(fn ($get) => $get('status') === 'approved')
                            ->searchable(),
                        Forms\Components\Select::make('student_id')
                            ->label('Student')
                            ->options(\App\Models\Student::with('user')->get()->pluck('user.name', 'id'))
                            ->searchable()
                            ->required(),
                        Forms\Components\DatePicker::make('start_date')->label('Start Date')->required(),
                        Forms\Components\DatePicker::make('end_date')->label('End Date')->required(),
                        Forms\Components\Textarea::make('description')->label('Description'),
                        Forms\Components\FileUpload::make('application_letter')->label('Application Letter')
                            ->previewable(true)
                            ->downloadable(true)
                            ->preserveFilenames()
                            ->getUploadedFileNameForStorageUsing(fn ($file) => $file->getClientOriginalName())
                            ->dehydrateStateUsing(fn ($state) => $state)
                            ->default(fn ($record) => is_array($record?->application_letter) ? array_values($record->application_letter)[0] ?? null : $record?->application_letter),
                        Forms\Components\FileUpload::make('cv_file')->label('CV File')
                            ->previewable(true)
                            ->downloadable(true)
                            ->preserveFilenames()
                            ->getUploadedFileNameForStorageUsing(fn ($file) => $file->getClientOriginalName())
                            ->dehydrateStateUsing(fn ($state) => $state)
                            ->default(fn ($record) => is_array($record?->cv_file) ? array_values($record->cv_file)[0] ?? null : $record?->cv_file),
                        Forms\Components\FileUpload::make('other_supporting_documents')->label('Other Supporting Documents')
                            ->previewable(true)
                            ->downloadable(true)
                            ->preserveFilenames()
                            ->multiple()
                            ->getUploadedFileNameForStorageUsing(fn ($file) => $file->getClientOriginalName())
                            ->dehydrateStateUsing(fn ($state) => $state)
                            ->default(fn ($record) => is_array($record?->other_supporting_documents) ? array_values($record->other_supporting_documents) : []),
                    ]),
                // ...tambahkan field lain sesuai kebutuhan...
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('student.user.name')->label('Student')->searchable(),
                Tables\Columns\TextColumn::make('status')->label('Status')->badge()->searchable(),
                Tables\Columns\TextColumn::make('start_date')->label('Start Date')->searchable(),
                Tables\Columns\TextColumn::make('end_date')->label('End Date')->searchable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
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
            'index' => Pages\ListInternshipApplications::route('/'),
            'create' => Pages\CreateInternshipApplication::route('/create'),
            'edit' => Pages\EditInternshipApplication::route('/{record}/edit'),
        ];
    }
}
