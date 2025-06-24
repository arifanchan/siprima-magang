<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\InternshipActivity;

class InternshipActivatedNotification extends Notification
{
    use Queueable;

    public $activity;

    public function __construct(InternshipActivity $activity)
    {
        $this->activity = $activity;
    }

    public function via($notifiable)
    {
        return ['database']; // Tambah 'mail' jika ingin email
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => 'Aktivitas magang Anda telah diaktifkan. Silakan cek detail magang dan mulai presensi/logbook.',
            'activity_id' => $this->activity->id,
            'start_date' => $this->activity->start_date,
            'end_date' => $this->activity->end_date,
        ];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Aktivitas Magang Diaktifkan')
            ->line('Aktivitas magang Anda telah diaktifkan.')
            ->action('Lihat Magang', url('/internship-activities/' . $this->activity->id));
    }
}

