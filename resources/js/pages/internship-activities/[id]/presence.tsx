/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import React from 'react';
import { router, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/id';
import { useForm } from '@inertiajs/react';

// Konfigurasi dayjs untuk menggunakan locale Indonesia
dayjs.extend(localizedFormat);

// Helper untuk format tanggal dan hari dalam bahasa Indonesia
function formatTanggalIndo(dateStr: string) {
    return dayjs(dateStr).locale('id').format('dddd, D MMMM YYYY');
}

const breadcrumbs = (activity: any): BreadcrumbItem[] => [
    { title: 'Aktivitas Magang', href: '/internship-activities' },
    { title: `Detail #${activity?.id || ''}`, href: `/internship-activities/${activity?.id}` },
    { title: 'Presensi', href: '#' },
];

export default function InternshipPresencePage() {
    // Ambil data aktivitas dan presensi dari props Inertia (dummy/mock untuk awal)
    const { internshipActivity, presences, flash, errors } = usePage().props as any;
    if (!internshipActivity) {
        return <div className="p-8 text-center text-gray-500">Aktivitas magang tidak ditemukan.</div>;
    }

    const handleCheckIn = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/presences/check-in', {
            internship_activity_id: internshipActivity.id,
        });
    };
    const handleCheckOut = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/presences/check-out', {
            internship_activity_id: internshipActivity.id,
        });
    };

    // Sidebar nav items sama seperti [id].tsx
    const navItems = [
        { key: 'index', title: 'Daftar Aktivitas', href: '/internship-activities' },
        { key: 'presence', title: 'Presensi', href: `/internship-activities/${internshipActivity.id}/presence` },
        { key: 'assignments', title: 'Tugas dari Mentor', href: `/internship-activities/${internshipActivity.id}/assignments` },
        { key: 'logbook', title: 'Logbook Harian', href: `/internship-activities/${internshipActivity.id}/logbook` },
        { key: 'final-report', title: 'Laporan Akhir', href: `/internship-activities/${internshipActivity.id}/report` },
        { key: 'assessment', title: 'Penilaian & Sertifikat', href: `/internship-activities/${internshipActivity.id}/final-assessment` },
    ];

    // State untuk pencarian, filter, dan sort
    const [search, setSearch] = React.useState('');
    const [sortKey, setSortKey] = React.useState<'date'|'check_in'|'check_out'>('date');
    const [sortAsc, setSortAsc] = React.useState(true);

    // Filter dan sort data presensi
    const filteredPresences = (presences || [])
        .filter((item: any) => {
            const q = search.toLowerCase();
            return (
                formatTanggalIndo(item.date).toLowerCase().includes(q) ||
                (item.check_in || '').toLowerCase().includes(q) ||
                (item.check_out || '').toLowerCase().includes(q) ||
                (item.notes || '').toLowerCase().includes(q)
            );
        })
        .sort((a: any, b: any) => {
            if (sortKey === 'date') {
                return sortAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
            } else if (sortKey === 'check_in') {
                return sortAsc ? (a.check_in || '').localeCompare(b.check_in || '') : (b.check_in || '').localeCompare(a.check_in || '');
            } else if (sortKey === 'check_out') {
                return sortAsc ? (a.check_out || '').localeCompare(b.check_out || '') : (b.check_out || '').localeCompare(a.check_out || '');
            }
            return 0;
        });

    // Cek apakah periode magang sudah berakhir
    const today = new Date().toISOString().slice(0, 10);
    const isEnded = internshipActivity.end_date && today > internshipActivity.end_date;

    return (
        <AppLayout breadcrumbs={breadcrumbs(internshipActivity)}>
            {/* Pesan sukses dan error */}
            {flash?.status && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{flash.status}</div>
            )}
            {errors && Object.keys(errors).length > 0 && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
                    {Object.values(errors).map((err, i) => (
                        <div key={i}>{err as string}</div>
                    ))}
                </div>
            )}
            <Head title={`Presensi Magang #${internshipActivity.id}`} />
            <div className="px-4 py-6">
                <Heading title="Presensi Magang" description="Lakukan presensi masuk dan keluar setiap hari magang Anda di sini." />
                <div className="flex flex-col lg:flex-row lg:space-x-12 mb-8">
                    <aside className="w-full max-w-xl lg:w-48 mb-8 lg:mb-0">
                        <nav className="flex flex-col space-y-1 space-x-0">
                            {navItems.map((item) => {
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
                        <div className="mb-6">
                            <div className="p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-900 mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-semibold text-base">Presensi Hari Ini</div>
                                    {isEnded ? (
                                        <div className="text-red-600 font-semibold">Periode magang telah berakhir. Presensi tidak dapat dilakukan.</div>
                                    ) : (
                                    <form className="flex flex-col md:flex-row gap-2 items-center">
                                        {(() => {
                                            // Cek apakah sudah presensi masuk hari ini
                                            const today = new Date().toISOString().slice(0, 10);
                                            const todayPresence = presences?.find((p: any) => p.date === today);
                                            if (!todayPresence || !todayPresence.check_in) {
                                                // Belum presensi masuk
                                                return (
                                                    <Button type="button" onClick={handleCheckIn} className="w-full md:w-auto font-bold shadow-lg text-lg px-6 py-2 bg-green-600 hover:bg-green-700 text-white border-2 border-green-700" size="lg" variant="primary" disabled={isEnded}>Presensi Masuk</Button>
                                                );
                                            } else if (!todayPresence.check_out) {
                                                // Sudah presensi masuk, belum keluar
                                                return (
                                                    <Button type="button" onClick={handleCheckOut} className="w-full md:w-auto font-bold shadow-lg text-lg px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-700" size="lg" variant="success" disabled={isEnded}>Presensi Keluar</Button>
                                                );
                                            } else {
                                                // Sudah presensi masuk dan keluar
                                                return (
                                                    <Button type="button" disabled className="w-full md:w-auto font-bold shadow text-lg px-6 py-2 bg-gray-400 text-white border-2 border-gray-500" size="lg" variant="secondary">Presensi Selesai</Button>
                                                );
                                            }
                                        })()}
                                    </form>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mb-8">
                            <div className="font-semibold mb-2 text-base">Riwayat Presensi</div>
                            <div className="mb-2 flex flex-col md:flex-row gap-2 items-center justify-end">
                                <input
                                    type="text"
                                    placeholder="Cari tanggal, jam, atau catatan..."
                                    className="border rounded px-3 py-1 text-sm w-full md:w-64"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border text-sm bg-white dark:bg-gray-900">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-gray-800">
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">Hari</th>
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm cursor-pointer" onClick={() => {setSortKey('date');setSortAsc(k=>!k);}}>
                                                Tanggal {sortKey==='date' ? (sortAsc ? '▲' : '▼') : ''}
                                            </th>
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm cursor-pointer" onClick={() => {setSortKey('check_in');setSortAsc(k=>!k);}}>
                                                Check In {sortKey==='check_in' ? (sortAsc ? '▲' : '▼') : ''}
                                            </th>
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm cursor-pointer" onClick={() => {setSortKey('check_out');setSortAsc(k=>!k);}}>
                                                Check Out {sortKey==='check_out' ? (sortAsc ? '▲' : '▼') : ''}
                                            </th>
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">Catatan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPresences.length > 0 ? filteredPresences.map((item: any) => {
                                            const d = new Date(item.date);
                                            const hari = dayjs(item.date).locale('id').format('dddd');
                                            return (
                                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                                    <td className="px-4 py-2 border capitalize text-gray-900 dark:text-gray-100">{hari}</td>
                                                    <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">{dayjs(item.date).format('D MMMM YYYY')}</td>
                                                    <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">{item.check_in || '-'}</td>
                                                    <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">{item.check_out || '-'}</td>
                                                    <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">{item.notes || '-'}</td>
                                                </tr>
                                            );
                                        }) : (
                                            <tr><td colSpan={5} className="text-center text-gray-500 py-4">Belum ada data presensi.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </AppLayout>
    );
}
