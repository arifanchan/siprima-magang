/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import { Head, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { CheckCircleIcon, XCircleIcon, ClockIcon, UserGroupIcon, BellIcon } from '@heroicons/react/24/outline';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

function StatusBadge({ status }: { status: string }) {
    let color = 'bg-gray-400';
    let icon = <ClockIcon className="w-4 h-4 mr-1" />;
    if (status === 'approved' || status === 'active' || status === 'completed') {
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

export default function Dashboard() {
    // Ambil data magang dari props Inertia (dummy/mock untuk awal)
    const { internshipApplication, internshipActivity, notifications, auth, quote } = usePage().props as any;
    const userName = auth?.user?.name || 'Pengguna';

    // Data untuk chart statistik ringkas
    const statistikData = internshipActivity ? {
        labels: ['Kehadiran', 'Logbook', 'Tugas'],
        datasets: [
            {
                data: [
                    internshipActivity.presence_count || 0,
                    internshipActivity.logbook_count || 0,
                    internshipActivity.assignment_count || 0,
                ],
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-1 rounded-xl p-2 overflow-x-auto overflow-y-auto min-h-[70vh]">
                <div className="grid auto-rows-min md:grid-cols-3 gap-y-8 gap-x-4">
                    {/* Card Sapaan di dalam grid dan col-span-3 */}
                    <div className="col-span-3 rounded-xl bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 px-6 py-4 flex items-center shadow border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="space-y-1">
                            <div className="text-xl font-bold text-primary-900 dark:text-primary-100">Halo, {userName}!</div>
                            <div className="text-sm text-primary-800 dark:text-primary-200 leading-relaxed">Selamat datang di Sistem Informasi Magang.<br />Semoga harimu menyenangkan dan magangmu lancar!</div>
                        </div>
                    </div>
                    {/* Status Permohonan Magang Terakhir */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-5 flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 shadow">
                        <div className="flex flex-col gap-3 h-full justify-between text-sm">
                            <div>
                                <div className="flex items-center font-semibold mb-2 text-base">
                                    <UserGroupIcon className="w-5 h-5 mr-2 text-blue-500" /> Status Permohonan Magang
                                </div>
                                {internshipApplication ? (
                                    <>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-28 text-gray-500 dark:text-gray-400">Status</span>
                                            <StatusBadge status={internshipApplication.status} />
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-28 text-gray-500 dark:text-gray-400">Periode</span>
                                            <span className="font-medium">{internshipApplication.start_date} - {internshipApplication.end_date}</span>
                                        </div>
                                        {internshipApplication.mentor_name && (
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="w-28 text-gray-500 dark:text-gray-400">Mentor</span>
                                                <span className="font-medium">{internshipApplication.mentor_name}</span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-gray-500 mt-2">Belum ada permohonan magang</div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Aktivitas Magang Aktif */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-5 flex flex-col bg-white dark:bg-gray-900 shadow-sm">
                        <div className="flex flex-col gap-3 h-full justify-between text-sm">
                            <div>
                                <div className="flex items-center font-semibold mb-2 text-base text-primary-700 dark:text-primary-300">
                                    <CheckCircleIcon className="w-5 h-5 mr-2 text-primary-500" /> Aktivitas Magang Aktif
                                </div>
                                {internshipActivity ? (
                                    <>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-28 text-gray-500 dark:text-gray-400">Status</span>
                                            <StatusBadge status={internshipActivity.status} />
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-28 text-gray-500 dark:text-gray-400">Periode</span>
                                            <span className="font-medium">{internshipActivity.start_date} - {internshipActivity.end_date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-28 text-gray-500 dark:text-gray-400">Mentor</span>
                                            <span className="font-medium">{internshipActivity.mentor_name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-28 text-gray-500 dark:text-gray-400">Presensi</span>
                                            <span className="font-medium">{internshipActivity.presence_count} hari</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-28 text-gray-500 dark:text-gray-400">Logbook</span>
                                            <span className="font-medium">{internshipActivity.logbook_count} hari</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-28 text-gray-500 dark:text-gray-400">Tugas</span>
                                            <span className="font-medium">{internshipActivity.assignment_count}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-28 text-gray-500 dark:text-gray-400">Presentasi Akhir</span>
                                            <span className="font-medium">{internshipActivity.final_presentation_status || 'Belum'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-28 text-gray-500 dark:text-gray-400">Laporan Akhir</span>
                                            <span className="font-medium">{internshipActivity.final_report_status || 'Belum'}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-gray-500 mt-2">Belum ada aktivitas magang aktif</div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Notifikasi */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-5 flex flex-col bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 shadow">
                        <div className="flex flex-col gap-3 h-full justify-between text-sm">
                            <div>
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
                    </div>
                </div>
                {/* Progress Bar Magang */}
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div className="p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 shadow">
                        <div className="text-lg font-semibold mb-2">Progress Magang</div>
                        {internshipActivity ? (
                            <>
                                <div className="mb-2 text-sm">Kehadiran: {internshipActivity.presence_percent || 0}%</div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${internshipActivity.presence_percent || 0}%` }}></div>
                                </div>
                                <div className="mb-2 text-sm">Logbook: {internshipActivity.logbook_percent || 0}%</div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                                    <div className="bg-green-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${internshipActivity.logbook_percent || 0}%` }}></div>
                                </div>
                                <div className="mb-2 text-sm">Tugas: {internshipActivity.assignment_percent || 0}%</div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                                    <div className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${internshipActivity.assignment_percent || 0}%` }}></div>
                                </div>
                                <div className="mb-2 text-sm">Presentasi Akhir: {internshipActivity.final_presentation_percent ?? 0}%</div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                                    <div className="bg-purple-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${internshipActivity.final_presentation_percent ?? 0}%` }}></div>
                                </div>
                                <div className="mb-2 text-sm">Laporan Akhir: {internshipActivity.final_report_percent ?? 0}%</div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div className="bg-pink-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${internshipActivity.final_report_percent ?? 0}%` }}></div>
                                </div>
                            </>
                        ) : (
                            <div className="text-sm text-gray-500">Belum ada aktivitas magang aktif</div>
                        )}
                    </div>
                    {/* Statistik Ringkas dengan Chart */}
                    <div className="p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 shadow flex flex-col items-center justify-center">
                        <div className="text-lg font-semibold mb-2">Statistik Ringkas</div>
                        {internshipActivity && statistikData ? (
                            <>
                                <div className="w-32 h-32 mx-auto">
                                    <Doughnut data={statistikData} options={{
                                        plugins: {
                                            legend: { display: false },
                                        },
                                        cutout: '70%',
                                        responsive: true,
                                        maintainAspectRatio: false,
                                    }} />
                                </div>
                                <div className="flex justify-center gap-4 mt-4 text-xs">
                                    <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span> Kehadiran: <span className="font-bold">{internshipActivity.presence_count}</span></div>
                                    <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-green-500"></span> Logbook: <span className="font-bold">{internshipActivity.logbook_count}</span></div>
                                    <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span> Tugas: <span className="font-bold">{internshipActivity.assignment_count}</span></div>
                                </div>
                            </>
                        ) : (
                            <div className="text-sm text-gray-500">Belum ada aktivitas magang aktif</div>
                        )}
                    </div>
                </div>
                {/* Card Quote of the Day */}
                {quote && (
                    <div className="mt-6 w-full rounded-xl bg-neutral-100 dark:bg-neutral-800 p-4 flex items-center shadow border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="flex-1 text-center">
                            <div className="text-lg italic font-medium text-neutral-900 dark:text-neutral-100">“{quote.message}”</div>
                            {quote.author && (
                                <div className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">— <span className="font-semibold">{quote.author}</span> —</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
