<?php

namespace App\Filament\Exports;

use App\Models\User;

class UserExporter
{
    public static function getModel(): string
    {
        return User::class;
    }

    public static function getColumns(): array
    {
        return [
            'name',
            'email',
            'phone',
            'role',
            'profile.gender' => 'Gender',
            'profile.birth_date' => 'Birth Date',
            'profile.address' => 'Address',
            'mediaSosial.instagram' => 'Instagram',
            'mediaSosial.facebook' => 'Facebook',
            'mediaSosial.x' => 'X',
            'mediaSosial.youtube' => 'YouTube',
            'mediaSosial.linkedin' => 'LinkedIn',
            'mediaSosial.tiktok' => 'TikTok',
            'mediaSosial.thread' => 'Thread',
            'student.student_number' => 'NIM/NIS',
            'student.study_program' => 'Study Program',
            'student.faculty' => 'Faculty',
            'student.university' => 'University',
            'student.entry_year' => 'Entry Year',
            'student.semester_or_grade' => 'Semester/Grade',
            'student.latest_academic_score' => 'Latest Academic Score',
            'student.bio' => 'Bio',
            'student.advisor_name' => 'Advisor Name',
            'student.advisor_phone' => 'Advisor Phone',
            'student.emergency_contact' => 'Emergency Contact',
            'mentor.nip' => 'Mentor NIP',
            'mentor.division' => 'Mentor Division',
            'mentor.expertise' => 'Mentor Expertise',
            'mentor.position' => 'Mentor Position',
            'mentor.bio' => 'Mentor Bio',
            'admin.nip' => 'Admin NIP',
            'admin.division' => 'Admin Division',
            'admin.position' => 'Admin Position',
            'admin.bio' => 'Admin Bio',
        ];
    }

    public static function getCompletedNotificationBody(\Filament\Actions\Exports\Models\Export $export): string
    {
        return 'Export data user telah selesai. Silakan unduh file Anda.';
    }
}
