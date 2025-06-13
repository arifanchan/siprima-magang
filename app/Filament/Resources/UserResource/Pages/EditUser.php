<?php
namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Resources\Pages\EditRecord;

class EditUser extends EditRecord
{
    protected static string $resource = UserResource::class;

    protected function fillForm(): void
    {
        parent::fillForm();
        $user = $this->record->fresh(['profile', 'mediaSosial', 'student', 'mentor', 'admin']);
        $data = [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role,
        ];
        // Profile
        foreach ([
            'gender', 'birth_date', 'address', 'occupation', 'identity_number', 'photo_file',
            'dss_status', 'dss_score', 'dss_recommendation', 'dss_notes',
        ] as $field) {
            $data['profile'][$field] = $user->profile->{$field} ?? '';
        }
        // Media Sosial
        foreach ([
            'instagram', 'facebook', 'x', 'youtube', 'linkedin', 'tiktok', 'thread',
        ] as $field) {
            $data['mediaSosial'][$field] = $user->mediaSosial->{$field} ?? '';
        }
        // Student
        foreach ([
            'student_number', 'study_program', 'faculty', 'university', 'entry_year', 'semester_or_grade',
            'latest_academic_score', 'bio', 'ktp_file', 'ktm_or_student_card_file', 'transcript_file',
            'advisor_name', 'advisor_phone', 'dss_status', 'dss_score', 'dss_recommendation', 'dss_notes',
        ] as $field) {
            $data['student'][$field] = $user->student->{$field} ?? '';
        }
        // Mentor
        foreach ([
            'nip', 'division', 'expertise', 'position', 'bio', 'dss_status', 'dss_score', 'dss_recommendation', 'dss_notes',
        ] as $field) {
            $data['mentor'][$field] = $user->mentor->{$field} ?? '';
        }
        // Admin
        foreach ([
            'nip', 'division', 'position', 'bio',
        ] as $field) {
            $data['admin'][$field] = $user->admin->{$field} ?? '';
        }
        $this->form->fill($data);
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $fillable = (new \App\Models\User())->getFillable();
        $filtered = [];
        foreach ($fillable as $key) {
            if (array_key_exists($key, $data)) {
                // Special handling: if password is empty/null, do not update password
                if ($key === 'password' && (empty($data[$key]) || $data[$key] === null)) {
                    continue;
                }
                $filtered[$key] = $data[$key];
            }
        }
        return $filtered;
    }

    public function save(bool $shouldRedirect = true, bool $shouldSendSavedNotification = true): void
    {
        $data = $this->form->getState();
        $fillable = (new \App\Models\User())->getFillable();
        $userData = [];
        foreach ($fillable as $key) {
            if (array_key_exists($key, $data)) {
                // Special handling: if password is empty/null, do not update password
                if ($key === 'password' && (empty($data[$key]) || $data[$key] === null)) {
                    continue;
                }
                $userData[$key] = $data[$key];
            }
        }
        $this->record->update($userData);
        // Simpan relasi
        if (!empty($data['profile'])) {
            $this->record->profile()->updateOrCreate([], $data['profile']);
        }
        if (!empty($data['mediaSosial'])) {
            $this->record->mediaSosial()->updateOrCreate([], $data['mediaSosial']);
        }
        if (!empty($data['student']) && in_array($this->record->role, ['student', 'user'])) {
            $this->record->student()->updateOrCreate([], $data['student']);
        }
        if (!empty($data['mentor']) && $this->record->role === 'mentor') {
            $this->record->mentor()->updateOrCreate([], $data['mentor']);
        }
        if (!empty($data['admin']) && $this->record->role === 'admin') {
            $this->record->admin()->updateOrCreate([], $data['admin']);
        }
        parent::save($shouldRedirect, $shouldSendSavedNotification);
    }
}
