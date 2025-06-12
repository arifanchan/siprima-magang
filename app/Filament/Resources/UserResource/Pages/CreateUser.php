<?php
namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    protected static string $resource = UserResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Pisahkan data relasi
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

    protected function afterCreate(): void
    {
        $user = $this->record;
        $data = $this->data;
        // Simpan profile
        if (!empty($data['__profile'])) {
            $user->profile()->create(array_merge($data['__profile'], ['user_id' => $user->id]));
        }
        // Simpan media sosial
        if (!empty($data['__mediaSosial'])) {
            $user->mediaSosial()->create(array_merge($data['__mediaSosial'], ['user_id' => $user->id]));
        }
        // Simpan student
        if (!empty($data['__student'])) {
            $user->student()->create(array_merge($data['__student'], ['user_id' => $user->id]));
        }
        // Simpan mentor
        if ($user->role === 'mentor' && !empty($data['__mentor'])) {
            $user->mentor()->create(array_merge($data['__mentor'], ['user_id' => $user->id]));
        }
    }
}
