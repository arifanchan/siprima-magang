/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Heading from '@/components/heading';
import { type BreadcrumbItem } from '@/types';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import FilePreviewButton from '@/components/ui/file-preview-button';
import { Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';

export default function MentorLogbookPage() {
    const { activity, logbooks, student } = usePage().props as any;
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<'date'|'activity'|'status'>('date');
    const [sortAsc, setSortAsc] = useState(false);
    const [modalFile, setModalFile] = useState<string|null>(null);

    // Breadcrumbs dan heading pakai nama mahasiswa
    const studentName = student?.user?.name || '-';
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Daftar Bimbingan', href: '/mentor/activities' },
        { title: studentName, href: `/mentor/activities/${activity?.id}` },
        { title: 'Logbook', href: '#' },
    ];

    // Sub Navigation Items
    const subNavItems = [
        { key: 'summary', title: 'Ringkasan', href: `/mentor/activities/${activity?.id}` },
        { key: 'profile', title: 'Profil Mahasiswa', href: `/mentor/activities/${activity?.id}/profile` },
        { key: 'presence', title: 'Presensi', href: `/mentor/activities/${activity?.id}/presence` },
        { key: 'logbook', title: 'Logbook', href: `/mentor/activities/${activity?.id}/logbook` },
        { key: 'assignments', title: 'Tugas', href: `/mentor/activities/${activity?.id}/assignments` },
        { key: 'report', title: 'Laporan', href: `/mentor/activities/${activity?.id}/report` },
        { key: 'final-assessment', title: 'Penilaian Akhir', href: `/mentor/activities/${activity?.id}/final-assessment` },
    ];

    if (!activity) {
        return <div className="p-8 text-center text-gray-500">Aktivitas magang tidak ditemukan.</div>;
    }

    // Helper untuk format tanggal dan hari dalam bahasa Indonesia
    function formatTanggalIndo(dateStr: string) {
        return dayjs(dateStr).locale('id').format('dddd, D MMMM YYYY');
    }

    // Helper untuk format evidence agar selalu url
    function getEvidenceUrl(evidence: string) {
        if (!evidence) return null;
        if (evidence.startsWith('http')) return evidence;
        return `/storage/${evidence}`;
    }

    // Filter dan sort logbook
    const filteredLogbooks = (logbooks || [])
        .filter((item: any) => {
            const q = search.toLowerCase();
            return (
                formatTanggalIndo(item.date).toLowerCase().includes(q) ||
                (item.activity || '').toLowerCase().includes(q) ||
                (item.description || '').toLowerCase().includes(q) ||
                (item.status || '').toLowerCase().includes(q) ||
                (item.feedback || '').toLowerCase().includes(q)
            );
        })
        .sort((a: any, b: any) => {
            let aVal, bVal;
            if (sortKey === 'date') {
                aVal = a.date;
                bVal = b.date;
            } else if (sortKey === 'activity') {
                aVal = a.activity || '';
                bVal = b.activity || '';
            } else if (sortKey === 'status') {
                aVal = a.status || '';
                bVal = b.status || '';
            }
            if (aVal < bVal) return sortAsc ? -1 : 1;
            if (aVal > bVal) return sortAsc ? 1 : -1;
            return 0;
        });

    // Modal preview file
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Logbook Magang - ${studentName}`} />
            <div className="px-4 py-6">
                <Heading
                    title={`Logbook Harian - ${studentName}`}
                    description={`Lihat catatan aktivitas harian magang mahasiswa bimbingan Anda (${studentName}) di sini.`}
                />
                <div className="flex flex-col lg:flex-row lg:space-x-12 mb-8">
                    <aside className="w-full max-w-xl lg:w-48 mb-8 lg:mb-0">
                        <nav className="flex flex-col space-y-1 space-x-0">
                            {subNavItems.map((item) => {
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
                    <main className="flex-1 min-w-0">
                        <Card className="mb-8 p-6">
                            <h2 className="font-semibold text-lg mb-4">Daftar Logbook Mahasiswa</h2>
                            <div className="flex justify-end mb-2">
                                <input
                                    type="text"
                                    placeholder="Cari tanggal, judul, deskripsi, status, feedback..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="border rounded px-2 py-1 w-full md:w-72 text-sm"
                                />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border text-sm bg-white dark:bg-gray-900">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-gray-800">
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm cursor-pointer select-none" onClick={() => { setSortKey('date'); setSortAsc(sortKey === 'date' ? !sortAsc : false); }}>
                                                Tanggal {sortKey === 'date' && (sortAsc ? '↑' : '↓')}
                                            </th>
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm cursor-pointer select-none" onClick={() => { setSortKey('activity'); setSortAsc(sortKey === 'activity' ? !sortAsc : false); }}>
                                                Judul Kegiatan {sortKey === 'activity' && (sortAsc ? '↑' : '↓')}
                                            </th>
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">Bukti</th>
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm cursor-pointer select-none" onClick={() => { setSortKey('status'); setSortAsc(sortKey === 'status' ? !sortAsc : false); }}>
                                                Status {sortKey === 'status' && (sortAsc ? '↑' : '↓')}
                                            </th>
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">Feedback</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLogbooks.length === 0 && (
                                            <tr><td colSpan={5} className="text-center py-4 text-gray-400">Belum ada logbook harian.</td></tr>
                                        )}
                                        {filteredLogbooks.map((item: any, idx: number) => (
                                            <tr key={item.id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                                {/* Tanggal sebagai link ke detail/show logbook */}
                                                <td className="px-4 py-2 border align-top">
                                                    <Link href={`/mentor/activities/${activity.id}/logbook/${item.id}`} className="text-primary-700 dark:text-primary-300 font-semibold underline hover:text-primary-900 dark:hover:text-primary-100 transition">
                                                        {item.date ? formatTanggalIndo(item.date) : '-'}
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-2 border align-top">{item.activity}</td>
                                                <td className="px-4 py-2 border align-top text-center">
                                                    {item.evidence_harian ? (
                                                        <>
                                                            <Button size="sm" variant="outline" className="mx-auto" onClick={() => { setModalFile(getEvidenceUrl(item.evidence_harian)); setModalOpen(true); }}>
                                                                <Eye size={16} className="mr-1" /> Preview
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 border align-top capitalize">
                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold
                                                        ${item.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                                                        ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                        ${item.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                                                    `}>{item.status || '-'}</span>
                                                </td>
                                                <td className="px-4 py-2 border align-top">{item.feedback || <span className="text-gray-400">-</span>}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* Modal preview file */}
                                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                                    <DialogContent className="max-w-2xl w-full">
                                        <h2 className="text-lg font-semibold mb-2" id="dialog-title">Preview Bukti Kegiatan</h2>
                                        <DialogClose asChild>
                                            <button className="absolute top-2 right-2 text-xl">&times;</button>
                                        </DialogClose>
                                        {modalFile && (modalFile.match(/\.(jpg|jpeg|png|gif)$/i)
                                            ? <img src={modalFile} alt="Preview Bukti" className="max-h-[70vh] mx-auto" />
                                            : <iframe src={modalFile} title="Preview Bukti" className="w-full min-h-[60vh]" aria-labelledby="dialog-title" />)}
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </Card>
                    </main>
                </div>
            </div>
        </AppLayout>
    );
}
