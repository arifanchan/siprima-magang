/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Aktivitas Magang', href: '/internship-activities' },
];

const internshipNavItems = [
    { key: 'index', title: 'Daftar Aktivitas', href: '/internship-activities' },
    { key: 'presence', title: 'Presensi', href: '#' },
    { key: 'assignments', title: 'Tugas dari Mentor', href: '#' },
    { key: 'logbook', title: 'Logbook Harian', href: '#' },
    { key: 'final-report', title: 'Laporan Akhir', href: '#' },
    { key: 'assessment', title: 'Penilaian & Sertifikat', href: '#' },
];

export default function InternshipActivitiesPage() {
    const { activities } = usePage().props as any;
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Aktivitas Magang', href: '/internship-activities' }]}>
            <div className="px-4 py-6">
                <Heading title="Daftar Aktivitas Magang" description="Pantau seluruh riwayat dan status kegiatan magang Anda di sini. Klik detail untuk melihat progres, presensi, logbook, tugas, dan dokumen magang." />
                <div className="flex flex-col lg:flex-row lg:space-x-12">
                    <aside className="w-full max-w-xl lg:w-48 mb-8 lg:mb-0">
                        <nav className="flex flex-col space-y-1 space-x-0">
                            {internshipNavItems.map((item) => {
                                const isActive = window.location.pathname === item.href;
                                return (
                                    <Button
                                        key={item.key}
                                        size="sm"
                                        variant="ghost"
                                        asChild
                                        className={`w-full justify-start ${isActive ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100'} ${isActive ? 'font-bold' : ''}`}
                                    >
                                        <Link href={item.href}>{item.title}</Link>
                                    </Button>
                                );
                            })}
                        </nav>
                    </aside>
                    <main className="flex-1">
                        {activities && activities.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {activities.map((activity: any) => {
                                    const student = activity.internship_application?.student;
                                    return (
                                        <Card key={activity.id} className="p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition flex flex-col h-full justify-between">
                                            <div>
                                                <div className="font-semibold text-lg mb-1">{student?.user?.name || '-'}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">{student?.university || '-'}{student?.faculty ? `, ${student?.faculty}` : ''}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">{student?.study_program || '-'}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Periode: <span className="font-medium">{activity.start_date} - {activity.end_date}</span></div>
                                                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Mentor: <span className="font-medium">{activity.mentor?.user?.name || '-'}</span></div>
                                                <div className="text-sm mb-1">Status: <span className={`inline-block px-2 py-1 rounded text-xs font-semibold
                                                    ${activity.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                                                    ${activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                    ${activity.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                                                    ${activity.status === 'canceled' ? 'bg-red-100 text-red-800' : ''}
                                                `}>{activity.status}</span></div>
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <Link href={`/internship-activities/${activity.id}`} className="btn btn-primary btn-sm">Detail</Link>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-12">Belum ada aktivitas magang.</div>
                        )}
                    </main>
                </div>
            </div>
        </AppLayout>
    );
}


