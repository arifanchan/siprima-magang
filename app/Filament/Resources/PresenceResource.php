<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PresenceResource\Pages;
use App\Models\Presence;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PresenceResource extends Resource
{
    protected static ?string $model = Presence::class;

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
                Forms\Components\DatePicker::make('date')->label('Date')->required(),
                // Field day dihilangkan dari input manual, bisa ditampilkan sebagai info jika perlu
                Forms\Components\TextInput::make('day')
                    ->label('Day')
                    ->disabled()
                    ->dehydrated(false)
                    ->formatStateUsing(fn ($state, $record) => $record ? ucfirst($record->day) : null)
                    ->visible(fn ($record) => !empty($record)),
                Forms\Components\TimePicker::make('check_in')->label('Check In'),
                Forms\Components\TimePicker::make('check_out')->label('Check Out'),
                Forms\Components\Textarea::make('notes')->label('Notes'),
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
                Tables\Columns\TextColumn::make('date')->label('Date')->searchable(),
                Tables\Columns\TextColumn::make('day')->label('Day'),
                Tables\Columns\TextColumn::make('check_in')->label('Check In'),
                Tables\Columns\TextColumn::make('check_out')->label('Check Out'),
                Tables\Columns\TextColumn::make('notes')->label('Notes')->limit(20),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('day')
                    ->options([
                        'monday' => 'Monday',
                        'tuesday' => 'Tuesday',
                        'wednesday' => 'Wednesday',
                        'thursday' => 'Thursday',
                        'friday' => 'Friday',
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
            'index' => Pages\ListPresences::route('/'),
            'create' => Pages\CreatePresence::route('/create'),
            'edit' => Pages\EditPresence::route('/{record}/edit'),
        ];
    }
}
