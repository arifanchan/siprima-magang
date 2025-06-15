import { Head, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    // Ambil data magang dari props Inertia (dummy/mock untuk awal)
    const { internshipApplication, internshipActivity, notifications } = usePage().props as any;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Status Permohonan Magang Terakhir */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 flex flex-col justify-between bg-white dark:bg-gray-900">
                        <div>
                            <div className="text-lg font-semibold mb-2">Status Permohonan Magang</div>
                            {internshipApplication ? (
                                <>
                                    <div className="text-base font-bold capitalize">{internshipApplication.status}</div>
                                    <div className="text-sm text-gray-500">Periode: {internshipApplication.start_date} - {internshipApplication.end_date}</div>
                                    {internshipApplication.mentor_name && (
                                        <div className="text-sm mt-1">Mentor: {internshipApplication.mentor_name}</div>
                                    )}
                                </>
                            ) : (
                                <div className="text-sm text-gray-500">Belum ada permohonan magang</div>
                            )}
                        </div>
                    </div>
                    {/* Aktivitas Magang Aktif */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 flex flex-col justify-between bg-white dark:bg-gray-900">
                        <div>
                            <div className="text-lg font-semibold mb-2">Aktivitas Magang Aktif</div>
                            {internshipActivity ? (
                                <>
                                    <div className="text-base font-bold">{internshipActivity.status}</div>
                                    <div className="text-sm text-gray-500">Periode: {internshipActivity.start_date} - {internshipActivity.end_date}</div>
                                    <div className="text-sm mt-1">Mentor: {internshipActivity.mentor_name}</div>
                                    <div className="text-sm mt-1">Presensi: {internshipActivity.presence_count} hari</div>
                                    <div className="text-sm mt-1">Logbook: {internshipActivity.logbook_count} hari</div>
                                </>
                            ) : (
                                <div className="text-sm text-gray-500">Belum ada aktivitas magang aktif</div>
                            )}
                        </div>
                    </div>
                    {/* Notifikasi */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 flex flex-col justify-between bg-white dark:bg-gray-900">
                        <div>
                            <div className="text-lg font-semibold mb-2">Notifikasi</div>
                            {notifications && notifications.length > 0 ? (
                                <ul className="list-disc ml-5 text-sm">
                                    {notifications.map((notif: string, idx: number) => (
                                        <li key={idx}>{notif}</li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-sm text-gray-500">Tidak ada notifikasi</div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Progress Bar Magang */}
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-900">
                        <div className="text-lg font-semibold mb-2">Progress Magang</div>
                        {internshipActivity ? (
                            <>
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
                            </>
                        ) : (
                            <div className="text-sm text-gray-500">Belum ada aktivitas magang aktif</div>
                        )}
                    </div>
                    {/* Statistik Ringkas */}
                    <div className="p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-900">
                        <div className="text-lg font-semibold mb-2">Statistik Ringkas</div>
                        {internshipActivity ? (
                            <div className="flex flex-col gap-2 text-sm">
                                <div>Total Kehadiran: <span className="font-bold">{internshipActivity.presence_count}</span> hari</div>
                                <div>Total Logbook: <span className="font-bold">{internshipActivity.logbook_count}</span> hari</div>
                                <div>Total Tugas: <span className="font-bold">{internshipActivity.assignment_count}</span></div>
                                <div>Tugas Selesai: <span className="font-bold">{internshipActivity.assignment_completed}</span></div>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">Belum ada data statistik</div>
                        )}
                    </div>
                </div>
                {/* Shortcut Aksi Cepat */}
                <div className="mt-6 grid gap-4 md:grid-cols-4">
                    <a href="/internship-activities" className="block p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-center font-semibold hover:bg-blue-100 dark:hover:bg-blue-800 transition">Presensi</a>
                    <a href="/internship-activities" className="block p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 text-center font-semibold hover:bg-green-100 dark:hover:bg-green-800 transition">Isi Logbook</a>
                    <a href="/internship-activities" className="block p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-center font-semibold hover:bg-yellow-100 dark:hover:bg-yellow-800 transition">Tugas</a>
                    <a href="/internship-activities" className="block p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-purple-50 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-center font-semibold hover:bg-purple-100 dark:hover:bg-purple-800 transition">Upload Laporan</a>
                </div>
                {/* Riwayat Aktivitas Terakhir */}
                <div className="mt-6 p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-900">
                    <div className="text-lg font-semibold mb-2">Riwayat Aktivitas Terakhir</div>
                    {internshipActivity && internshipActivity.recent_activities && internshipActivity.recent_activities.length > 0 ? (
                        <ul className="list-disc ml-5 text-sm">
                            {internshipActivity.recent_activities.map((item: any, idx: number) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-sm text-gray-500">Belum ada aktivitas terbaru</div>
                    )}
                </div>
                {/* Jadwal & Kalender Magang */}
                <div className="mt-6 p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-900">
                    <div className="text-lg font-semibold mb-2">Jadwal & Kalender Magang</div>
                    {internshipActivity && internshipActivity.schedule && internshipActivity.schedule.length > 0 ? (
                        <ul className="list-disc ml-5 text-sm">
                            {internshipActivity.schedule.map((item: any, idx: number) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-sm text-gray-500">Belum ada jadwal magang</div>
                    )}
                </div>
                {/* Download Dokumen */}
                <div className="mt-6 p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-900">
                    <div className="text-lg font-semibold mb-2">Download Dokumen</div>
                    {internshipActivity && (internshipActivity.completion_letter || internshipActivity.completion_certificate) ? (
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
                {/* Bagian lain bisa ditambah di sini */}
            </div>
        </AppLayout>
    );
}
