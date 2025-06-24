import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, usePage } from '@inertiajs/react';
import React from 'react';

export default function MentorDashboard() {
    const { auth, students = [] } = usePage().props as any;
    const mentorName = auth?.user?.name || 'Mentor';

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard Mentor', href: '/mentor/dashboard' }]}>
            <div className="flex flex-1 flex-col gap-1 rounded-xl p-2 overflow-x-auto overflow-y-auto min-h-[70vh]">
                <div className="rounded-xl bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 px-6 py-4 flex items-center shadow border border-sidebar-border/70 dark:border-sidebar-border mb-6">
                    <div className="space-y-1">
                        <div className="text-xl font-bold text-primary-900 dark:text-primary-100">Halo, {mentorName}!</div>
                        <div className="text-sm text-primary-800 dark:text-primary-200 leading-relaxed">Selamat datang di Dashboard Mentor. Pantau dan bimbing mahasiswa magang Anda di sini.</div>
                    </div>
                </div>
                <Heading title="Mahasiswa Bimbingan" description="Daftar mahasiswa yang sedang Anda bimbing." />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                    {students.length > 0 ? students.map((student: any) => (
                        <Card key={student.id} className="p-4 flex flex-col gap-2">
                            <div className="font-semibold text-lg">{student.user?.name}</div>
                            <div className="text-sm text-gray-500">{student.university} - {student.study_program}</div>
                            <div className="text-xs text-gray-400">Periode: {student.internship_period}</div>
                            <Button asChild size="sm" className="mt-2 w-fit">
                                <Link href={`/mentor/students/${student.id}`}>Lihat Aktivitas</Link>
                            </Button>
                        </Card>
                    )) : (
                        <div className="text-gray-500 col-span-3">Belum ada mahasiswa bimbingan aktif.</div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

