/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, Head, usePage } from '@inertiajs/react';
import React from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, UserGroupIcon, BellIcon, ClipboardDocumentListIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

function StatusBadge({ status }: { status: string }) {
    let color = 'bg-gray-400';
    let icon = <ClockIcon className="w-4 h-4 mr-1" />;
    if (status === 'active' || status === 'approved' || status === 'completed') {
        color = 'bg-green-500';
        icon = <CheckCircleIcon className="w-4 h-4 mr-1" />;
    } else if (status === 'rejected' || status === 'canceled') {
        color = 'bg-red-500';
        icon = <XCircleIcon className="w-4 h-4 mr-1" />;
    }
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-white ${color}`}>
            {icon} {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

export default function MentorDashboard() {
    const { auth, students = [], notifications = [], quote } = usePage().props as any;
    const mentorName = auth?.user?.name || 'Mentor';

    // Mahasiswa bimbingan aktif & selesai berbasis internshipActivity
    const mahasiswaAktif = students.filter((s: any) => ['active', 'berjalan', 'aktif'].includes((s.status || '').toLowerCase()));
    const mahasiswaSelesai = students.filter((s: any) => ['completed', 'selesai', 'finished'].includes((s.status || '').toLowerCase()));
    const totalBimbingan = students.length;
    const bimbinganAktif = mahasiswaAktif.length;
    const bimbinganSelesai = mahasiswaSelesai.length;

    // Statistik ringkas
    const totalLogbook = mahasiswaAktif.reduce((sum: number, s: any) => sum + (s.logbook_count || 0), 0);
    const totalAssignments = mahasiswaAktif.reduce((sum: number, s: any) => sum + (s.assignment_count || 0), 0);
    const avgPresence = mahasiswaAktif.length > 0 ? Math.round(mahasiswaAktif.reduce((sum: number, s: any) => sum + (s.presence_count || 0), 0) / mahasiswaAktif.length) : 0;

    // Statistik chart
    const statistikData = mahasiswaAktif.length > 0 ? {
        labels: ['Kehadiran', 'Logbook', 'Tugas'],
        datasets: [
            {
                data: [avgPresence, totalLogbook, totalAssignments],
                backgroundColor: [
                    '#3b82f6', // blue-500
                    '#22c55e', // green-500
                    '#f59e42', // yellow-500
                ],
                borderWidth: 1,
            },
        ],
    } : null;

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard Mentor', href: '/mentor/dashboard' }]}>
            <Head title="Dashboard Mentor" />
            <div className="flex flex-1 flex-col gap-1 rounded-xl p-2 overflow-x-auto overflow-y-auto min-h-[70vh]">
                {/* Sapaan */}
                <div className="rounded-xl bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 px-6 py-4 flex items-center shadow border border-sidebar-border/70 dark:border-sidebar-border mb-6">
                    <div className="space-y-1">
                        <div className="text-xl font-bold text-primary-900 dark:text-primary-100">Halo, {mentorName}!</div>
                        <div className="text-sm text-primary-800 dark:text-primary-200 leading-relaxed">Pantau dan bimbing mahasiswa magang Anda di sini.</div>
                    </div>
                </div>
                {/* Statistik Bimbingan */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="rounded-xl bg-white dark:bg-gray-900 border border-sidebar-border/70 dark:border-sidebar-border p-4 flex flex-col items-center shadow">
                        <UserGroupIcon className="w-7 h-7 text-primary-500 mb-1" />
                        <div className="text-2xl font-bold">{totalBimbingan}</div>
                        <div className="text-xs text-gray-500 text-center">Total Mahasiswa Pernah Dibimbing</div>
                    </div>
                    <div className="rounded-xl bg-white dark:bg-gray-900 border border-sidebar-border/70 dark:border-sidebar-border p-4 flex flex-col items-center shadow">
                        <CheckCircleIcon className="w-7 h-7 text-green-500 mb-1" />
                        <div className="text-2xl font-bold">{bimbinganAktif}</div>
                        <div className="text-xs text-gray-500 text-center">Bimbingan Aktif</div>
                    </div>
                    <div className="rounded-xl bg-white dark:bg-gray-900 border border-sidebar-border/70 dark:border-sidebar-border p-4 flex flex-col items-center shadow">
                        <ClipboardDocumentListIcon className="w-7 h-7 text-blue-500 mb-1" />
                        <div className="text-2xl font-bold">{bimbinganSelesai}</div>
                        <div className="text-xs text-gray-500 text-center">Bimbingan Selesai</div>
                    </div>
                </div>
                {/* Statistik Ringkas & Notifikasi */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-5 flex flex-col bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 shadow items-center justify-center">
                        <div className="flex items-center font-semibold mb-2 text-base">
                            <ClipboardDocumentListIcon className="w-5 h-5 mr-2 text-green-500" /> Statistik Ringkas
                        </div>
                        {statistikData ? (
                            <>
                                <div className="w-32 h-32 mx-auto">
                                    <Doughnut data={statistikData} options={{
                                        plugins: { legend: { display: false } },
                                        cutout: '70%',
                                        responsive: true,
                                        maintainAspectRatio: false,
                                    }} />
                                </div>
                                <div className="flex justify-center gap-4 mt-4 text-xs">
                                    <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span> Kehadiran: <span className="font-bold">{avgPresence}</span></div>
                                    <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-green-500"></span> Logbook: <span className="font-bold">{totalLogbook}</span></div>
                                    <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span> Tugas: <span className="font-bold">{totalAssignments}</span></div>
                                </div>
                            </>
                        ) : (
                            <div className="text-gray-500 mt-2">Belum ada data mahasiswa aktif</div>
                        )}
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-5 flex flex-col bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 shadow">
                        <div className="flex items-center font-semibold mb-2 text-base">
                            <BellIcon className="w-5 h-5 mr-2 text-yellow-500" /> Notifikasi
                        </div>
                        {notifications && notifications.length > 0 ? (
                            <ul className="list-disc ml-5 text-sm space-y-1">
                                {notifications.map((notif: string, idx: number) => (
                                    <li key={idx}>{notif}</li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-500 mt-2">Tidak ada notifikasi</div>
                        )}
                    </div>
                </div>
                {/* Progress Mahasiswa Bimbingan Aktif & Card Mahasiswa Aktif */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {/* Card Mahasiswa Bimbingan Aktif */}
                    <div>
                        <div className="grid gap-4 md:grid-cols-1">
                            {mahasiswaAktif.length > 0 ? mahasiswaAktif.map((student: any) => (
                                <div key={student.id} className="rounded-xl border border-green-300 dark:border-green-700 p-4 bg-white dark:bg-gray-900 shadow flex flex-col gap-2">
                                    <div className="text-lg font-semibold mb-2">Mahasiswa Bimbingan Aktif</div>
                                    <div className="font-semibold text-lg">{student.user?.name}</div>
                                    <div className="text-sm text-gray-500">{student.university}</div>
                                    <div className="text-sm text-gray-500">{student.study_program}</div>
                                    <div className="text-xs text-gray-400">Periode: {student.start_date} - {student.end_date}</div>
                                    <div className="text-xs text-gray-500">Email: {student.user?.email || '-'}</div>
                                    <div className="text-xs text-gray-500">No. HP: {student.user?.phone || '-'}</div>
                                    <div className="flex gap-2 mt-2">
                                        <Button asChild size="sm">
                                            <Link href={`/mentor/activities/${student.id}`}>Lihat Aktivitas</Link>
                                        </Button>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full text-center text-gray-400 py-8">Belum ada mahasiswa bimbingan aktif.</div>
                            )}
                        </div>
                    </div>
                    {/* Progress Mahasiswa Bimbingan Aktif */}
                    <div className="p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 shadow">
                        <div className="text-lg font-semibold mb-2">Progress Mahasiswa Bimbingan Aktif</div>
                        {mahasiswaAktif.length > 0 ? (
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {mahasiswaAktif.map((student: any) => (
                                    <div key={student.id} className="mb-2">
                                        <div className="font-medium text-sm mb-1">{student.user?.name}</div>
                                        <div className="mb-1 text-xs">Kehadiran: {student.presence_percent ?? 0}%</div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-1">
                                            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${student.presence_percent ?? 0}%` }}></div>
                                        </div>
                                        <div className="mb-1 text-xs">Logbook: {student.logbook_percent ?? 0}%</div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-1">
                                            <div className="bg-green-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${student.logbook_percent ?? 0}%` }}></div>
                                        </div>
                                        <div className="mb-1 text-xs">Tugas: {student.assignment_percent ?? 0}%</div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-1">
                                            <div className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${student.assignment_percent ?? 0}%` }}></div>
                                        </div>
                                        <div className="mb-1 text-xs">Presentasi Akhir: {student.final_presentation_percent ?? 0}%</div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-1">
                                            <div className="bg-purple-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${student.final_presentation_percent ?? 0}%` }}></div>
                                        </div>
                                        <div className="mb-1 text-xs">Laporan Akhir: {student.final_report_percent ?? 0}%</div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                            <div className="bg-pink-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${student.final_report_percent ?? 0}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">Tidak ada mahasiswa bimbingan aktif</div>
                        )}
                    </div>
                </div>
                {/* Daftar Mahasiswa Bimbingan Selesai */}
                <div className="mt-4">
                    {mahasiswaSelesai.length > 0 && (
                        <div className="col-span-full">
                            <div className="text-base font-semibold mb-2 text-blue-700 dark:text-blue-300">Mahasiswa Bimbingan Selesai</div>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {mahasiswaSelesai.map((student: any) => (
                                    <div key={student.id} className="rounded-xl border border-blue-300 dark:border-blue-700 p-4 bg-white dark:bg-gray-900 shadow flex flex-col gap-2 opacity-80">
                                        <div className="font-semibold text-lg">{student.user?.name}</div>
                                        <div className="text-sm text-gray-500">{student.university} - {student.study_program}</div>
                                        <div className="text-xs text-gray-400">Periode: {student.internship_period}</div>
                                        <div className="text-xs text-gray-500">Email: {student.user?.email || '-'}</div>
                                        <div className="text-xs text-gray-500">No. HP: {student.user?.phone || '-'}</div>
                                        <div className="text-xs text-blue-700 dark:text-blue-300 font-bold">Status: Selesai</div>
                                        <div className="flex gap-2 mt-2">
                                            <Button asChild size="sm" variant="outline">
                                                <Link href={`/mentor/students/${student.id}`}>Lihat Aktivitas</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {mahasiswaAktif.length === 0 && mahasiswaSelesai.length === 0 && (
                        <div className="col-span-full text-center text-gray-400 py-8">Belum ada mahasiswa bimbingan.</div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
