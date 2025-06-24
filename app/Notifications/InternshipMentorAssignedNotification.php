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

class InternshipMentorAssignedNotification extends Notification
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
            'message' => 'Anda telah ditunjuk sebagai mentor untuk aktivitas magang baru.',
            'activity_id' => $this->activity->id,
            'student_name' => optional($this->activity->internshipApplication->student->user)->name,
            'start_date' => $this->activity->start_date,
            'end_date' => $this->activity->end_date,
        ];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Penunjukan Mentor Magang')
            ->line('Anda telah ditunjuk sebagai mentor untuk aktivitas magang baru.')
            ->action('Lihat Aktivitas', url('/admin/internship-activities/' . $this->activity->id . '/edit'));
    }
}

