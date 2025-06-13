<?php

namespace App\Filament\Resources;

use App\Models\User;
use App\Models\Profile;
use App\Models\MediaSosial;
use App\Models\Student;
use App\Models\Mentor;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use App\Filament\Resources\UserResource\Pages;

class UserResource extends Resource
{
    protected static ?string $model = User::class;
    protected static ?string $navigationIcon = 'heroicon-o-user';
    protected static ?string $navigationGroup = 'Master Data';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Grid::make(2)
                ->schema([
                    Forms\Components\TextInput::make('name')->required(),
                    Forms\Components\TextInput::make('email')->email()->required(),
                    Forms\Components\TextInput::make('phone')->tel(),
                    Forms\Components\TextInput::make('password')
                        ->password()
                        ->dehydrateStateUsing(fn ($state) => $state ? bcrypt($state) : null)
                        ->required(fn (string $context) => $context === 'create'),
                    Forms\Components\Select::make('role')
                        ->options([
                            'admin' => 'Admin',
                            'student' => 'Student',
                            'mentor' => 'Mentor',
                            'user' => 'User',
                        ])
                        ->required()
                        ->reactive(),
                    // Profile fields
                    Forms\Components\Select::make('profile.gender')
                        ->label('Gender')
                        ->options(['male' => 'Male', 'female' => 'Female'])
                        ->required(),
                    Forms\Components\DatePicker::make('profile.birth_date')->label('Birth Date'),
                    Forms\Components\TextInput::make('profile.address')->label('Address'),
                    Forms\Components\TextInput::make('profile.occupation')->label('Occupation'),
                    Forms\Components\TextInput::make('profile.identity_number')->label('Identity Number'),
                    Forms\Components\FileUpload::make('profile.photo_file')->label('Photo')
                        ->previewable(true)
                        ->downloadable(true)
                        ->preserveFilenames()
                        ->getUploadedFileNameForStorageUsing(fn ($file) => $file->getClientOriginalName())
                        ->dehydrateStateUsing(fn ($state) => $state)
                        ->default(fn ($record) => is_array($record?->profile?->photo_file) ? array_values($record->profile->photo_file)[0] ?? null : $record?->profile?->photo_file),
                    // Media Sosial fields
                    Forms\Components\TextInput::make('mediaSosial.instagram')->label('Instagram'),
                    Forms\Components\TextInput::make('mediaSosial.facebook')->label('Facebook'),
                    Forms\Components\TextInput::make('mediaSosial.x')->label('X'),
                    Forms\Components\TextInput::make('mediaSosial.youtube')->label('YouTube'),
                    Forms\Components\TextInput::make('mediaSosial.linkedin')->label('LinkedIn'),
                    Forms\Components\TextInput::make('mediaSosial.tiktok')->label('TikTok'),
                    Forms\Components\TextInput::make('mediaSosial.thread')->label('Thread'),
                    // Student fields (hanya tampil jika role student/user)
                    Forms\Components\Group::make([
                        Forms\Components\TextInput::make('student.student_number')->label('NIM/NIS')->id('student_number'),
                        Forms\Components\TextInput::make('student.study_program')->label('Study Program')->id('student_study_program'),
                        Forms\Components\TextInput::make('student.faculty')->label('Faculty')->id('student_faculty'),
                        Forms\Components\TextInput::make('student.university')->label('University')->id('student_university'),
                        Forms\Components\TextInput::make('student.entry_year')->label('Entry Year')->id('student_entry_year'),
                        Forms\Components\TextInput::make('student.semester_or_grade')->label('Semester/Grade')->id('student_semester_or_grade'),
                        Forms\Components\TextInput::make('student.latest_academic_score')->label('Latest Academic Score')->id('student_latest_academic_score'),
                        Forms\Components\Textarea::make('student.bio')->label('Bio')->id('student_bio'),
                        Forms\Components\FileUpload::make('student.ktp_file')->label('KTP File')
                            ->previewable(true)
                            ->downloadable(true)
                            ->preserveFilenames()
                            ->getUploadedFileNameForStorageUsing(fn ($file) => $file->getClientOriginalName())
                            ->dehydrateStateUsing(fn ($state) => $state)
                            ->default(fn ($record) => is_array($record?->student?->ktp_file) ? array_values($record->student->ktp_file)[0] ?? null : $record?->student?->ktp_file),
                        Forms\Components\FileUpload::make('student.ktm_or_student_card_file')->label('KTM/Student Card')
                            ->previewable(true)
                            ->downloadable(true)
                            ->preserveFilenames()
                            ->getUploadedFileNameForStorageUsing(fn ($file) => $file->getClientOriginalName())
                            ->dehydrateStateUsing(fn ($state) => $state)
                            ->default(fn ($record) => is_array($record?->student?->ktm_or_student_card_file) ? array_values($record->student->ktm_or_student_card_file)[0] ?? null : $record?->student?->ktm_or_student_card_file),
                        Forms\Components\FileUpload::make('student.transcript_file')->label('Transcript')
                            ->previewable(true)
                            ->downloadable(true)
                            ->preserveFilenames()
                            ->getUploadedFileNameForStorageUsing(fn ($file) => $file->getClientOriginalName())
                            ->dehydrateStateUsing(fn ($state) => $state)
                            ->default(fn ($record) => is_array($record?->student?->transcript_file) ? array_values($record->student->transcript_file)[0] ?? null : $record?->student?->transcript_file),
                        Forms\Components\TextInput::make('student.advisor_name')->label('Advisor Name')->id('student_advisor_name'),
                        Forms\Components\TextInput::make('student.advisor_phone')->label('Advisor Phone')->id('student_advisor_phone'),
                    ])->visible(fn ($get) => in_array($get('role'), ['student', 'user'])),
                    // Mentor fields (hanya tampil jika role mentor)
                    Forms\Components\Group::make([
                        Forms\Components\TextInput::make('mentor.nip')->label('NIP')->required(),
                        Forms\Components\TextInput::make('mentor.division')->label('Division'),
                        Forms\Components\TextInput::make('mentor.expertise')->label('Expertise'),
                        Forms\Components\TextInput::make('mentor.position')->label('Position'),
                        Forms\Components\Textarea::make('mentor.bio')->label('Bio'),
                    ])->visible(fn ($get) => $get('role') === 'mentor'),
                    // Admin fields (hanya tampil jika role admin)
                    Forms\Components\Group::make([
                        Forms\Components\TextInput::make('admin.nip')->label('NIP'),
                        Forms\Components\TextInput::make('admin.division')->label('Division'),
                        Forms\Components\TextInput::make('admin.position')->label('Position'),
                        Forms\Components\Textarea::make('admin.bio')->label('Bio'),
                    ])->visible(fn ($get) => $get('role') === 'admin'),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            Tables\Columns\TextColumn::make('name')->searchable()->sortable(),
            Tables\Columns\TextColumn::make('email')->searchable()->sortable(),
            Tables\Columns\TextColumn::make('phone')->sortable(),
            Tables\Columns\TextColumn::make('role')->badge()->sortable(),
        ])
        ->filters([
            Tables\Filters\SelectFilter::make('role')
                ->options([
                    'admin' => 'Admin',
                    'student' => 'Student',
                    'mentor' => 'Mentor',
                    'user' => 'User',
                ]),
        ])
        ->actions([
            Tables\Actions\EditAction::make(),
            Tables\Actions\DeleteAction::make(),
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
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }

    public static function mutateFormDataBeforeCreate(array $data): array
    {
        // Only allow fields that are in the User model's fillable property
        $fillable = (new \App\Models\User())->getFillable();
        $filtered = [];
        foreach ($fillable as $key) {
            if (array_key_exists($key, $data)) {
                $filtered[$key] = $data[$key];
            }
        }
        return $filtered;
    }

    public static function afterCreate(
        \Filament\Resources\Pages\CreateRecord $page,
        \Illuminate\Database\Eloquent\Model $record
    ): void {
        $data = $page->form->getState();
        // Profile
        if (!empty($data['profile'])) {
            $record->profile()->create($data['profile']);
        }
        // Media Sosial
        if (!empty($data['mediaSosial'])) {
            $record->mediaSosial()->create($data['mediaSosial']);
        }
        // Student
        if (!empty($data['student']) && in_array($record->role, ['student', 'user'])) {
            $record->student()->create($data['student']);
        }
        // Mentor
        if (!empty($data['mentor']) && $record->role === 'mentor') {
            $record->mentor()->create(array_merge($data['mentor'], ['user_id' => $record->id]));
        }
        // Admin
        if (!empty($data['admin']) && $record->role === 'admin') {
            $record->admin()->create($data['admin']);
        }
    }

    public static function mutateFormDataBeforeSave(array $data): array
    {
        $fillable = (new \App\Models\User())->getFillable();
        $filtered = [];
        foreach ($fillable as $key) {
            if (array_key_exists($key, $data)) {
                $filtered[$key] = $data[$key];
            }
        }
        return $filtered;
    }

    public static function afterSave(
        \Filament\Resources\Pages\EditRecord $page,
        \Illuminate\Database\Eloquent\Model $record
    ): void {
        $data = $page->form->getState();
        // Profile
        if (!empty($data['profile'])) {
            $record->profile()->updateOrCreate([], $data['profile']);
        }
        // Media Sosial
        if (!empty($data['mediaSosial'])) {
            $record->mediaSosial()->updateOrCreate([], $data['mediaSosial']);
        }
        // Student
        if (!empty($data['student']) && in_array($record->role, ['student', 'user'])) {
            $record->student()->updateOrCreate([], $data['student']);
        }
        // Mentor
        if (!empty($data['mentor']) && $record->role === 'mentor') {
            $record->mentor()->updateOrCreate([], $data['mentor']);
        }
        // Admin
        if (!empty($data['admin']) && $record->role === 'admin') {
            $record->admin()->updateOrCreate([], $data['admin']);
        }
    }
}
