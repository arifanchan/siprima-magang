import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import React from 'react';

const breadcrumbs = (activity: any): BreadcrumbItem[] => [
    { title: 'Aktivitas Magang', href: '/internship-activities' },
    { title: `Detail #${activity?.id || ''}`, href: '#' },
];

export default function InternshipActivityDetailPage() {
    // Ambil data detail aktivitas magang dari props Inertia (dummy/mock untuk awal)
    const { internshipActivity } = usePage().props as any;
    if (!internshipActivity) {
        return <div className="p-8 text-center text-gray-500">Aktivitas magang tidak ditemukan.</div>;
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs(internshipActivity)}>
            <Head title={`Detail Aktivitas Magang #${internshipActivity.id}`} />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold mb-2">Detail Aktivitas Magang</h1>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-900">
                        <div className="font-semibold mb-1">Periode</div>
                        <div>{internshipActivity.start_date} - {internshipActivity.end_date}</div>
                        <div className="font-semibold mt-3 mb-1">Mentor</div>
                        <div>{internshipActivity.mentor_name}</div>
                        <div className="font-semibold mt-3 mb-1">Status</div>
                        <div className="capitalize">{internshipActivity.status}</div>
                    </div>
                    <div className="p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-900">
                        <div className="font-semibold mb-1">Progress</div>
                        <div className="mb-2 text-sm">Kehadiran: {internshipActivity.presence_percent || 0}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${internshipActivity.presence_percent || 0}%` }}></div>
                        </div>
                        <div className="mb-2 text-sm">Logbook: {internshipActivity.logbook_percent || 0}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${internshipActivity.logbook_percent || 0}%` }}></div>
                        </div>
                        <div className="mb-2 text-sm">Tugas: {internshipActivity.assignment_percent || 0}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${internshipActivity.assignment_percent || 0}%` }}></div>
                        </div>
                    </div>
                </div>
                {/* Aksi dan navigasi fitur */}
                <div className="mt-6 grid gap-4 md:grid-cols-4">
                    <a href={`/internship-activities/${internshipActivity.id}/presence`} className="block p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-center font-semibold hover:bg-blue-100 dark:hover:bg-blue-800 transition">Presensi</a>
                    <a href={`/internship-activities/${internshipActivity.id}/logbook`} className="block p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 text-center font-semibold hover:bg-green-100 dark:hover:bg-green-800 transition">Logbook</a>
                    <a href={`/internship-activities/${internshipActivity.id}/assignments`} className="block p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-center font-semibold hover:bg-yellow-100 dark:hover:bg-yellow-800 transition">Tugas</a>
                    <a href={`/internship-activities/${internshipActivity.id}/report`} className="block p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-purple-50 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-center font-semibold hover:bg-purple-100 dark:hover:bg-purple-800 transition">Upload Laporan</a>
                </div>
                {/* Riwayat aktivitas dan jadwal */}
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-900">
                        <div className="text-lg font-semibold mb-2">Riwayat Aktivitas Terakhir</div>
                        {internshipActivity.recent_activities && internshipActivity.recent_activities.length > 0 ? (
                            <ul className="list-disc ml-5 text-sm">
                                {internshipActivity.recent_activities.map((item: any, idx: number) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-sm text-gray-500">Belum ada aktivitas terbaru</div>
                        )}
                    </div>
                    <div className="p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-900">
                        <div className="text-lg font-semibold mb-2">Jadwal & Kalender Magang</div>
                        {internshipActivity.schedule && internshipActivity.schedule.length > 0 ? (
                            <ul className="list-disc ml-5 text-sm">
                                {internshipActivity.schedule.map((item: any, idx: number) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-sm text-gray-500">Belum ada jadwal magang</div>
                        )}
                    </div>
                </div>
                {/* Download dokumen */}
                <div className="mt-6 p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-900">
                    <div className="text-lg font-semibold mb-2">Download Dokumen</div>
                    {(internshipActivity.completion_letter || internshipActivity.completion_certificate) ? (
                        <div className="flex flex-col gap-2">
                            {internshipActivity.completion_letter && (
                                <a href={internshipActivity.completion_letter} className="text-blue-600 hover:underline" download>Surat Keterangan Selesai</a>
                            )}
                            {internshipActivity.completion_certificate && (
                                <a href={internshipActivity.completion_certificate} className="text-green-600 hover:underline" download>Sertifikat Magang</a>
                            )}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500">Belum ada dokumen yang bisa diunduh</div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

