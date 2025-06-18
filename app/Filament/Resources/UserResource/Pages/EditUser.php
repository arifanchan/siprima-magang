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
        $data['profile'] = $user->profile ? $user->profile->toArray() : [];

        // Media Sosial
        $data['mediaSosial'] = $user->mediaSosial ? $user->mediaSosial->toArray() : [];

        // Student
        if (in_array($user->role, ['student', 'user'])) {
            $data['student'] = $user->student ? $user->student->toArray() : [];
        }

        // Mentor
        if ($user->role === 'mentor') {
            $data['mentor'] = $user->mentor ? $user->mentor->toArray() : [];
        }

        // Admin
        if ($user->role === 'admin') {
            $data['admin'] = $user->admin ? $user->admin->toArray() : [];
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
