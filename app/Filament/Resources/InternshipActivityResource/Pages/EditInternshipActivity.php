<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Filament\Resources\InternshipActivityResource\Pages;

use App\Filament\Resources\InternshipActivityResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditInternshipActivity extends EditRecord
{
    protected static string $resource = InternshipActivityResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function afterSave(): void
    {
        $record = $this->record;
        // Jika status menjadi 'active', lakukan otomasi
        if ($record->status === 'active') {
            // 1. Kirim notifikasi ke siswa/mahasiswa dan mentor
            // (Contoh: gunakan Notification model atau event, sesuaikan dengan sistem notifikasi Anda)
            \App\Models\User::find(optional($record->internshipApplication->student)->user_id)?->notify(new \App\Notifications\InternshipActivatedNotification($record));
            \App\Models\User::find(optional($record->mentor)->user_id)?->notify(new \App\Notifications\InternshipMentorAssignedNotification($record));

            // 2. Buat assignment pertama jika belum ada
            $firstAssignment = $record->assignments()->first();
            if (!$firstAssignment) {
                $firstAssignment = $record->assignments()->create([
                    'title' => 'Follow & Like Media Sosial Institusi',
                    'description' => '1. Follow seluruh akun media sosial institusi.\n2. Like minimal 3 postingan terakhir di setiap akun.\n3. Upload screenshot sebagai bukti sudah follow dan like.\n\nCatatan: Daftar akun media sosial dapat dilihat di halaman profil atau website institusi.',
                    'due_date' => $record->start_date,
                    'status' => 'pending',
                ]);
            }

            // 3. Catat audit log (contoh sederhana, bisa gunakan model/log package)
            \Log::info('Aktivitas magang diaktifkan', [
                'internship_activity_id' => $record->id,
                'admin_id' => auth()->id(),
                'mentor_id' => $record->mentor_id,
                'student_id' => optional($record->internshipApplication->student)->id,
            ]);

            // 4. Pastikan relasi mentor dan siswa sudah benar (biasanya sudah otomatis)
            // Tidak perlu aksi khusus jika sudah sesuai model.

            // 5. Siapkan presensi dan logbook sesuai periode magang
            $start = \Carbon\Carbon::parse($record->start_date);
            $end = \Carbon\Carbon::parse($record->end_date);
            $existingPresenceDates = $record->presences()->pluck('date')->toArray();
            $existingLogbookDates = $record->logbooks()->pluck('date')->toArray();
            for ($date = $start->copy(), $i = 0; $date->lte($end); $date->addDay(), $i++) {
                // Hanya hari kerja (Senin-Jumat)
                if (in_array($date->dayOfWeek, [1,2,3,4,5])) {
                    $dateStr = $date->toDateString();
                    // Siapkan presensi jika belum ada
                    if (!in_array($dateStr, $existingPresenceDates)) {
                        $record->presences()->create([
                            'date' => $dateStr,
                            'day' => strtolower($date->format('l')),
                        ]);
                    }
                    // Siapkan logbook jika belum ada
                    if (!in_array($dateStr, $existingLogbookDates)) {
                        $logbookData = [
                            'date' => $dateStr,
                            'activity' => '',
                            'description' => '',
                            'status' => 'pending',
                        ];
                        $record->logbooks()->create($logbookData);
                    }
                }
            }
            // 6. Otomasi final_assessment jika belum ada
            if (!$record->finalAssessment) {
                $record->finalAssessment()->create([
                    'assessment_date' => null,
                    'discipline' => null,
                    'responsibility' => null,
                    'teamwork' => null,
                    'initiative' => null,
                    'communication' => null,
                    'technical_skill' => null,
                    'final_score' => null,
                    'comment' => null,
                ]);
            }
        }
    }
}
