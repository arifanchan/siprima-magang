import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import React from 'react';

const breadcrumbs = (activity: any): BreadcrumbItem[] => [
    { title: 'Aktivitas Magang', href: '/internship-activities' },
    { title: `Detail #${activity?.id || ''}`, href: `/internship-activities/${activity?.id}` },
    { title: 'Presensi', href: '#' },
];

export default function InternshipPresencePage() {
    // Ambil data aktivitas dan presensi dari props Inertia (dummy/mock untuk awal)
    const { internshipActivity, presences } = usePage().props as any;
    if (!internshipActivity) {
        return <div className="p-8 text-center text-gray-500">Aktivitas magang tidak ditemukan.</div>;
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs(internshipActivity)}>
            <Head title={`Presensi Magang #${internshipActivity.id}`} />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold mb-2">Presensi Magang</h1>
                {/* Form presensi hari ini */}
                <div className="p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-900 mb-4">
                    <div className="font-semibold mb-2">Presensi Hari Ini</div>
                    {/* Form presensi masuk/keluar, bisa diintegrasikan dengan backend */}
                    <form className="flex flex-col md:flex-row gap-2 items-center">
                        <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Presensi Masuk</button>
                        <button type="button" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Presensi Keluar</button>
                    </form>
                </div>
                {/* Riwayat presensi */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="px-4 py-2 border">Tanggal</th>
                                <th className="px-4 py-2 border">Hari</th>
                                <th className="px-4 py-2 border">Check In</th>
                                <th className="px-4 py-2 border">Check Out</th>
                                <th className="px-4 py-2 border">Catatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {presences && presences.length > 0 ? presences.map((item: any) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                    <td className="px-4 py-2 border">{item.date}</td>
                                    <td className="px-4 py-2 border capitalize">{item.day}</td>
                                    <td className="px-4 py-2 border">{item.check_in || '-'}</td>
                                    <td className="px-4 py-2 border">{item.check_out || '-'}</td>
                                    <td className="px-4 py-2 border">{item.notes || '-'}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} className="text-center text-gray-500 py-4">Belum ada data presensi.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

