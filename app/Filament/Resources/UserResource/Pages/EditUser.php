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

    // Tambahkan logic agar saat edit user, data relasi (profile, media sosial, student, mentor) ikut terupdate
    // EditUser.php
    protected function mutateFormDataBeforeSave(array $data): array
    {
        $profile = $data['profile'] ?? [];
        $mediaSosial = $data['mediaSosial'] ?? [];
        $student = $data['student'] ?? [];
        $mentor = $data['mentor'] ?? [];
        unset($data['profile'], $data['mediaSosial'], $data['student'], $data['mentor']);
        $data['__profile'] = $profile;
        $data['__mediaSosial'] = $mediaSosial;
        $data['__student'] = $student;
        $data['__mentor'] = $mentor;
        return $data;
    }

    protected function afterSave(): void
    {
        $user = $this->record;
        $data = $this->data;
        // Update or create profile
        if (!empty($data['__profile'])) {
            $user->profile()->updateOrCreate(['user_id' => $user->id], $data['__profile']);
        }
        // Update or create media sosial
        if (!empty($data['__mediaSosial'])) {
            $user->mediaSosial()->updateOrCreate(['user_id' => $user->id], $data['__mediaSosial']);
        }
        // Update or create student
        if (!empty($data['__student'])) {
            $user->student()->updateOrCreate(['user_id' => $user->id], $data['__student']);
        }
        // Update or create mentor
        if (!empty($data['__mentor'])) {
            $user->mentor()->updateOrCreate(['user_id' => $user->id], $data['__mentor']);
        }
        // Update or create admin
        if (!empty($data['__admin'])) {
            $user->admin()->updateOrCreate(['user_id' => $user->id], $data['__admin']);
        }
    }
}
