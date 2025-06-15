<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LogbookResource\Pages;
use App\Models\Logbook;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class LogbookResource extends Resource
{
    protected static ?string $model = Logbook::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('internship_activity_id')
                    ->label('Internship Activity')
                    ->relationship('internshipActivity', 'id')
                    ->searchable()
                    ->required(),
                Forms\Components\Select::make('assignment_id')
                    ->label('Assignment')
                    ->relationship('assignment', 'title')
                    ->searchable(),
                Forms\Components\DatePicker::make('date')->label('Date')->required(),
                Forms\Components\TextInput::make('activity')->label('Activity')->required(),
                Forms\Components\Textarea::make('description')->label('Description')->required(),
                Forms\Components\Textarea::make('progress')->label('Progress'),
                Forms\Components\FileUpload::make('evidence_harian')
                    ->label('Daily Evidence')
                    ->disk('public')
                    ->directory(fn ($get, $state, $record = null) =>
                        $record && $record->internshipActivity && $record->internshipActivity->internshipApplication && $record->internshipActivity->internshipApplication->student
                            ? 'users/' . $record->internshipActivity->internshipApplication->student->user_id . '/internship/logbook_evidence'
                            : 'users/unknown/internship/logbook_evidence'
                    )
                    ->getUploadedFileNameForStorageUsing(function ($file, $get, $set, $record) {
                        $userId = $record && $record->internshipActivity && $record->internshipActivity->internshipApplication && $record->internshipActivity->internshipApplication->student
                            ? $record->internshipActivity->internshipApplication->student->user_id
                            : 'unknown';
                        return time() . '_' . $file->getClientOriginalName();
                    })
                    ->downloadable(true)
                    ->previewable(true),
                Forms\Components\Select::make('status')
                    ->label('Status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                    ])
                    ->required(),
                Forms\Components\Textarea::make('feedback')->label('Feedback'),
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
                Tables\Columns\TextColumn::make('assignment.title')->label('Assignment')->searchable(),
                Tables\Columns\TextColumn::make('date')->label('Date')->searchable(),
                Tables\Columns\TextColumn::make('activity')->label('Activity')->searchable(),
                Tables\Columns\TextColumn::make('status')->label('Status')->badge()->searchable(),
                Tables\Columns\TextColumn::make('evidence_harian')->label('Evidence')->toggleable(isToggledHiddenByDefault: true),
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
            'index' => Pages\ListLogbooks::route('/'),
            'create' => Pages\CreateLogbook::route('/create'),
            'edit' => Pages\EditLogbook::route('/{record}/edit'),
        ];
    }
}
