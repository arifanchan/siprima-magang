/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import FilePreviewButton from '@/components/ui/file-preview-button';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import { exportCSV, exportPDF, printTable } from '@/utils/exportUtils';
import { Download } from 'lucide-react';

const breadcrumbs = (activity: any): BreadcrumbItem[] => [
    { title: 'Aktivitas Magang', href: '/internship-activities' },
    { title: `Detail #${activity?.id || ''}`, href: `/internship-activities/${activity?.id}` },
    { title: 'Logbook', href: '#' },
];

export default function InternshipLogbookPage() {
    // Ambil data aktivitas dan logbook dari props Inertia (dummy/mock untuk awal)
    const { internshipActivity, logbooks } = usePage().props as any;
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        date: '',
        activity: '',
        description: '',
        progress: '',
        evidence_harian: '',
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [modalFile, setModalFile] = useState<string|null>(null);

    if (!internshipActivity) {
        return <div className="p-8 text-center text-gray-500">Aktivitas magang tidak ditemukan.</div>;
    }

    // Cek apakah magang sudah selesai
    const isEnded = internshipActivity?.status === 'completed' || (internshipActivity?.end_date && dayjs().isAfter(dayjs(internshipActivity.end_date)));

    // Sidebar nav items sama seperti halaman lain
    const navItems = [
        { key: 'index', title: 'Daftar Aktivitas', href: '/internship-activities' },
        { key: 'presence', title: 'Presensi', href: `/internship-activities/${internshipActivity.id}/presence` },
        { key: 'assignments', title: 'Tugas dari Mentor', href: `/internship-activities/${internshipActivity.id}/assignments` },
        { key: 'logbook', title: 'Logbook Harian', href: `/internship-activities/${internshipActivity.id}/logbook` },
        { key: 'final-report', title: 'Laporan Akhir', href: `/internship-activities/${internshipActivity.id}/report` },
        { key: 'assessment', title: 'Penilaian & Sertifikat', href: `/internship-activities/${internshipActivity.id}/final-assessment` },
    ];

    // State untuk pencarian dan sort
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<'date'|'activity'|'status'>('date');
    const [sortAsc, setSortAsc] = useState(false); // default: terbaru

    // Helper untuk format tanggal dan hari dalam bahasa Indonesia
    function formatTanggalIndo(dateStr: string) {
        return dayjs(dateStr).locale('id').format('dddd, D MMMM YYYY');
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

    // Handler form logbook (dummy, belum terhubung backend)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Integrasi ke backend
        setShowForm(false);
    };

    // Export ke CSV
    function handleExportCSV() {
        const header = ['Tanggal', 'Judul Kegiatan', 'Status', 'Feedback'];
        const rows = filteredLogbooks.map((item: any) => [
            item.date ? formatTanggalIndo(item.date) : '-',
            item.activity,
            item.status,
            item.feedback || '-'
        ]);
        exportCSV({
            header,
            rows,
            filename: `logbook_${internshipActivity?.id || 'magang'}_${dayjs().format('MMMM_YYYY')}.csv`
        });
    }

    // Export ke PDF
    function handleExportPDF() {
        const header = ['Tanggal', 'Judul Kegiatan', 'Status', 'Feedback'];
        const rows = filteredLogbooks.map((item: any) => [
            item.date ? formatTanggalIndo(item.date) : '-',
            item.activity,
            item.status,
            item.feedback || '-'
        ]);
        exportPDF({
            header,
            rows,
            filename: `logbook_${internshipActivity?.id || 'magang'}_${dayjs().format('MMMM_YYYY')}.pdf`,
            title: 'Logbook Harian',
            startY: 20
        });
    }

    // Print table
    function handlePrintTable() {
        printTable({
            elementId: 'logbook-table-print',
            title: 'Logbook Harian'
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs(internshipActivity)}>
            <Head title={`Logbook Magang #${internshipActivity.id}`} />
            <div className="px-4 py-6">
                <Heading title="Logbook Harian" description="Lihat catatan aktivitas harian magang Anda di sini." />
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
                        <Card className="mb-8 p-6">
                            {isEnded && (
                                <div className="mb-4 p-3 rounded border text-sm font-semibold bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700 text-center">
                                    Magang telah berakhir. Anda tidak dapat lagi mengisi atau mengedit logbook.
                                </div>
                            )}
                            <h2 className="font-semibold text-lg mb-4">Daftar Logbook</h2>
                            {/* Tombol export dan search input */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                                <div className="flex gap-2 flex-wrap">
                                    <Button size="sm" variant="outline" onClick={handleExportCSV} className="flex items-center gap-1">
                                        <Download className="w-4 h-4" /> Export CSV
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={handleExportPDF} className="flex items-center gap-1">
                                        <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' /></svg> PDF
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={handlePrintTable} className="flex items-center gap-1">
                                        <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 9V2h12v7M6 18v4h12v-4M6 14h12' /></svg> Print
                                    </Button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari tanggal, judul, deskripsi, status, feedback..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="border rounded px-2 py-1 w-full md:w-72 text-sm"
                                />
                            </div>
                            <div className="overflow-x-auto" id="logbook-table-print">
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
                                        {filteredLogbooks && filteredLogbooks.length > 0 ? filteredLogbooks.map((item: any) => (
                                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                                {/* Tanggal sebagai link ke detail/show logbook */}
                                                <td className="px-4 py-2 border align-top">
                                                    {item.date && dayjs(item.date).isAfter(dayjs(), 'day') ? (
                                                        <span className="text-gray-400 cursor-not-allowed">{formatTanggalIndo(item.date)}</span>
                                                    ) : (
                                                        <Link href={`/internship-activities/${internshipActivity.id}/logbook/${item.id}`} className="text-primary-700 dark:text-primary-300 font-semibold underline hover:text-primary-900 dark:hover:text-primary-100 transition">
                                                            {item.date ? formatTanggalIndo(item.date) : '-'}
                                                        </Link>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 border align-top">{item.activity}</td>
                                                <td className="px-4 py-2 border align-top text-center">
                                                    {item.evidence_harian ? (
                                                        <FilePreviewButton
                                                            label="Preview File"
                                                            onClick={() => {
                                                                setModalFile(item.evidence_harian.startsWith('http') ? item.evidence_harian : `/storage/${item.evidence_harian}`);
                                                                setModalOpen(true);
                                                            }}
                                                            className="mt-1 mx-auto"
                                                        >
                                                            <Eye size={16} />
                                                        </FilePreviewButton>
                                                    ) : <span className="text-gray-400">-</span>}
                                                </td>
                                                <td className="px-4 py-2 border align-top capitalize">
                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold
                                                        ${item.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                                                        ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                        ${item.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                                                    `}>{item.status}</span>
                                                </td>
                                                <td className="px-4 py-2 border align-top">{item.feedback || '-'}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={5} className="text-center text-gray-500 py-4">Belum ada data logbook.</td></tr>
                                        )}
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
