<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Filament\Resources\InternshipActivityResource\Pages;

use App\Filament\Resources\InternshipActivityResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateInternshipActivity extends CreateRecord
{
    protected static string $resource = InternshipActivityResource::class;

    protected function afterSave(): void {
        $record = $this->record;

        // Siapkan presensi dan logbook hanya jika status menjadi 'active'
        if ($record->status === 'active') {
            // Assignment pertama
            $firstAssignment = $record->assignments()->first();
            if (!$firstAssignment) {
                $firstAssignment = $record->assignments()->create([
                    'title' => 'Follow & Like Media Sosial Institusi',
                    'description' => '1. Follow seluruh akun media sosial institusi.\n2. Like minimal 3 postingan terakhir di setiap akun.\n3. Upload screenshot sebagai bukti sudah follow dan like.\n\nCatatan: Daftar akun media sosial dapat dilihat di halaman profil atau website institusi.',
                    'due_date' => $record->start_date,
                    'status' => 'pending',
                ]);
            }
            // Notifikasi
            \App\Models\User::find(optional($record->internshipApplication->student)->user_id)?->notify(new \App\Notifications\InternshipActivatedNotification($record));
            \App\Models\User::find(optional($record->mentor)->user_id)?->notify(new \App\Notifications\InternshipMentorAssignedNotification($record));
            // Audit log
            \Log::info('Aktivitas magang diaktifkan', [
                'internship_activity_id' => $record->id,
                'admin_id' => auth()->id(),
                'mentor_id' => $record->mentor_id,
                'student_id' => optional($record->internshipApplication->student)->id,
            ]);
            // Presensi & logbook
            $start = \Carbon\Carbon::parse($record->start_date);
            $end = \Carbon\Carbon::parse($record->end_date);
            for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
                if (in_array($date->dayOfWeek, [1, 2, 3, 4, 5])) {
                    $dateStr = $date->toDateString();
                    $record->presences()->firstOrCreate([
                        'date' => $dateStr
                    ], [
                        'day' => strtolower($date->format('l')),
                    ]);
                    $record->logbooks()->firstOrCreate([
                        'date' => $dateStr
                    ], [
                        'day' => strtolower($date->format('l')),
                        'activity' => '',
                        'description' => '',
                        'status' => 'pending',
                    ]);
                }
            }
            // Final assessment
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
