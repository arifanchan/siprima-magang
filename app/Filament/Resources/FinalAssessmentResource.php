<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Filament\Resources;

use App\Models\FinalAssessment;
use App\Models\InternshipActivity;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use App\Filament\Resources\FinalAssessmentResource\Pages;

class FinalAssessmentResource extends Resource
{
    protected static ?string $model = FinalAssessment::class;
    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-check';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Select::make('internship_activity_id')
                ->label('Internship Activity')
                ->relationship('internshipActivity', 'id')
                ->searchable()
                ->required(),
            Forms\Components\DatePicker::make('assessment_date')->label('Assessment Date'),
            Forms\Components\TextInput::make('discipline')->label('Discipline')->numeric()->minValue(0)->maxValue(100),
            Forms\Components\TextInput::make('responsibility')->label('Responsibility')->numeric()->minValue(0)->maxValue(100),
            Forms\Components\TextInput::make('teamwork')->label('Teamwork')->numeric()->minValue(0)->maxValue(100),
            Forms\Components\TextInput::make('initiative')->label('Initiative')->numeric()->minValue(0)->maxValue(100),
            Forms\Components\TextInput::make('communication')->label('Communication')->numeric()->minValue(0)->maxValue(100),
            Forms\Components\TextInput::make('technical_skill')->label('Technical Skill')->numeric()->minValue(0)->maxValue(100),
            Forms\Components\TextInput::make('final_score')->label('Final Score')->numeric()->minValue(0)->maxValue(100),
            Forms\Components\Textarea::make('comment')->label('Comment'),
            // DSS fields (optional/hidden)
            Forms\Components\TextInput::make('dss_score')->label('DSS Score')->visible(false),
            Forms\Components\TextInput::make('dss_recommendation')->label('DSS Recommendation')->visible(false),
            Forms\Components\Textarea::make('dss_notes')->label('DSS Notes')->visible(false),
            Forms\Components\TextInput::make('dss_status')->label('DSS Status')->visible(false),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('internshipActivity.internshipApplication.student.user.name')->label('Student')->searchable(),
            Tables\Columns\TextColumn::make('assessment_date')->label('Assessment Date')->sortable(),
            Tables\Columns\TextColumn::make('final_score')->label('Final Score')->sortable(),
            Tables\Columns\TextColumn::make('comment')->label('Comment')->limit(30),
        ])
        ->filters([])
        ->actions([
            Tables\Actions\EditAction::make(),
        ])
        ->bulkActions([
            Tables\Actions\BulkActionGroup::make([
                Tables\Actions\DeleteBulkAction::make(),
            ]),
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFinalAssessments::route('/'),
            'create' => Pages\CreateFinalAssessment::route('/create'),
            'edit' => Pages\EditFinalAssessment::route('/{record}/edit'),
        ];
    }
}
