<?php

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
            $start = \Carbon\Carbon::parse($record->start_date);
            $end = \Carbon\Carbon::parse($record->end_date);
            for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
                // Hanya hari kerja (Senin-Jumat)
                if (in_array($date->dayOfWeek, [1, 2, 3, 4, 5])) {
                    $dateStr = $date->toDateString();
                    // Siapkan presensi
                    $record->presences()->create([
                        'date' => $dateStr,
                        'day' => strtolower($date->format('l')),
                    ]);
                    // Siapkan logbook
                    $record->logbooks()->create([
                        'date' => $dateStr,
                        'day' => strtolower($date->format('l')),
                    ]);
                }
            }
        }
    }
}
