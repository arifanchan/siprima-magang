<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Filament\Resources;

use App\Filament\Resources\InternshipApplicationResource\Pages;
use App\Models\InternshipApplication;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Forms\Components\FileUpload;

class InternshipApplicationResource extends Resource
{
    protected static ?string $model = InternshipApplication::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationGroup = 'Applications';
    protected static ?int $navigationSort = 1;


    public static function form(Form $form): Form
    {
        $getDirectory = function ($folder, $record = null) {
            $userId = null;
            $studentId = request()->input('student_id');
            if ($studentId) {
                $student = \App\Models\Student::find($studentId);
                $userId = $student?->user_id;
            }
            if (!$userId && $record && isset($record->student) && $record->student) {
                $userId = $record->student->user_id;
            }
            if (!$userId) {
                $userId = auth()->id();
            }
            return "users/{$userId}/internship/{$folder}";
        };
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
                        FileUpload::make('application_letter')
                            ->label('Application Letter')
                            ->disk('public')
                            ->directory(fn ($get, $state, $record = null) => 'users/' . ($record?->student?->user_id ?? auth()->id()) . '/internship/application_letters')
                            ->previewable(true)
                            ->downloadable(true)
                            ->getUploadedFileNameForStorageUsing(function ($file, $get, $set, $record) {
                                $userId = $record?->student?->user_id ?? auth()->id();
                                return now()->format('Y-m-d') . '_' . $file->getClientOriginalName();
                            })
                            ->preserveFilenames()
                            ->maxSize(2048),
                        FileUpload::make('cv_file')
                            ->label('CV')
                            ->disk('public')
                            ->directory(fn ($get, $state, $record = null) => 'users/' . ($record?->student?->user_id ?? auth()->id()) . '/internship/cv')
                            ->previewable(true)
                            ->downloadable(true)
                            ->getUploadedFileNameForStorageUsing(function ($file, $get, $set, $record) {
                                $userId = $record?->student?->user_id ?? auth()->id();
                                return now()->format('Y-m-d') . '_' . $file->getClientOriginalName();
                            })
                            ->preserveFilenames()
                            ->maxSize(2048),
                        FileUpload::make('other_supporting_documents')
                            ->label('Other Supporting Documents')
                            ->disk('public')
                            ->directory(fn ($get, $state, $record = null) => 'users/' . ($record?->student?->user_id ?? auth()->id()) . '/internship/supporting_documents')
                            ->previewable(true)
                            ->downloadable(true)
                            ->multiple()
                            ->getUploadedFileNameForStorageUsing(function ($file, $get, $set, $record) {
                                $userId = $record?->student?->user_id ?? auth()->id();
                                return now()->format('Y-m-d') . '_' . $file->getClientOriginalName();
                            })
                            ->preserveFilenames()
                            ->maxSize(2048),
                        // ...existing code...
                    ]),
                // ...existing code...
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

    /**
     * Helper untuk mendapatkan path file publik dokumen magang
     */
    public static function getPublicFilePath($userId, $folder, $file)
    {
        if (!$file) return '';
        // Jika sudah path absolut (http/https) atau sudah mengandung /storage/, kembalikan apa adanya
        if (str_starts_with($file, 'http') || str_starts_with($file, '/storage/')) return $file;
        // Jika sudah mengandung users/ di depannya, tambahkan slash jika belum ada
        if (str_starts_with($file, 'users/')) return "/storage/{$file}";
        // Jika file mengandung slash di awal
        if (str_starts_with($file, '/users/')) return "/storage" . $file;
        // Default: nama file saja
        return "/storage/users/{$userId}/internship/{$folder}/{$file}";
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
