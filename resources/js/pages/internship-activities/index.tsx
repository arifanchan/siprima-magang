import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Aktivitas Magang', href: '/internship-activities' },
];

export default function InternshipActivitiesPage() {
    // Ambil daftar aktivitas magang dari props Inertia (dummy/mock untuk awal)
    const { internshipActivities } = usePage().props as any;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Aktivitas Magang" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold mb-2">Daftar Aktivitas Magang</h1>
                {internshipActivities && internshipActivities.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800">
                                    <th className="px-4 py-2 border">Periode</th>
                                    <th className="px-4 py-2 border">Mentor</th>
                                    <th className="px-4 py-2 border">Status</th>
                                    <th className="px-4 py-2 border">Progres</th>
                                    <th className="px-4 py-2 border">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {internshipActivities.map((activity: any) => (
                                    <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                        <td className="px-4 py-2 border">{activity.start_date} - {activity.end_date}</td>
                                        <td className="px-4 py-2 border">{activity.mentor_name}</td>
                                        <td className="px-4 py-2 border capitalize">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold
                                                ${activity.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                                                ${activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                ${activity.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                                                ${activity.status === 'canceled' ? 'bg-red-100 text-red-800' : ''}
                                            `}>
                                                {activity.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 border">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs">Presensi: {activity.presence_count || 0}/{activity.presence_target || '-'} hari</span>
                                                <span className="text-xs">Logbook: {activity.logbook_count || 0}/{activity.logbook_target || '-'} hari</span>
                                                <span className="text-xs">Tugas: {activity.assignment_completed || 0}/{activity.assignment_count || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 border">
                                            <a href={`/internship-activities/${activity.id}`} className="text-blue-600 hover:underline mr-2">Detail</a>
                                            <a href={`/internship-activities/${activity.id}/presence`} className="text-green-600 hover:underline mr-2">Presensi</a>
                                            <a href={`/internship-activities/${activity.id}/logbook`} className="text-yellow-600 hover:underline mr-2">Logbook</a>
                                            <a href={`/internship-activities/${activity.id}/assignments`} className="text-purple-600 hover:underline mr-2">Tugas</a>
                                            <a href={`/internship-activities/${activity.id}/report`} className="text-indigo-600 hover:underline">Laporan</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                        <span>Belum ada aktivitas magang.</span>
                        <a href="/internship-applications/create" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Ajukan Magang Baru</a>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
