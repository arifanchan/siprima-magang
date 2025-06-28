/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import React, { useState } from 'react';
import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import { exportCSV, exportPDF, printTable } from '@/utils/exportUtils';
import { Download } from 'lucide-react';

const breadcrumbs = (activity: any): BreadcrumbItem[] => [
    { title: 'Aktivitas Magang', href: '/internship-activities' },
    { title: `Detail #${activity?.id || ''}`, href: `/internship-activities/${activity?.id}` },
    { title: 'Tugas', href: '#' },
];

export default function InternshipAssignmentsPage() {
    // Ambil data aktivitas dan assignments dari props Inertia (dummy/mock untuk awal)
    const { internshipActivity, assignments } = usePage().props as any;
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: '',
        description: '',
        due_date: '',
        evidence_file: '',
        output: '',
    });
    const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
    const [showDetail, setShowDetail] = useState(false);

    if (!internshipActivity) {
        return <div className="p-8 text-center text-gray-500">Aktivitas magang tidak ditemukan.</div>;
    }

    // Generate dynamic nav items with correct hrefs (copy dari [id].tsx)
    const navItems = [
        { key: 'index', title: 'Daftar Aktivitas', href: '/internship-activities' },
        { key: 'presence', title: 'Presensi', href: `/internship-activities/${internshipActivity.id}/presence` },
        { key: 'assignments', title: 'Tugas dari Mentor', href: `/internship-activities/${internshipActivity.id}/assignments` },
        { key: 'logbook', title: 'Logbook Harian', href: `/internship-activities/${internshipActivity.id}/logbook` },
        { key: 'final-report', title: 'Laporan Akhir', href: `/internship-activities/${internshipActivity.id}/report` },
        { key: 'assessment', title: 'Penilaian & Sertifikat', href: `/internship-activities/${internshipActivity.id}/final-assessment` },
    ];

    // Handler form tugas (dummy, belum terhubung backend)
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
        const header = ['No', 'Judul', 'Dibuat', 'Jatuh Tempo', 'Status'];
        const rows = (assignments || []).map((item: any, idx: number) => [
            idx + 1,
            item.title,
            item.created_at ? dayjs(item.created_at).format('D MMMM YYYY') : '-',
            item.due_date ? dayjs(item.due_date).format('D MMMM YYYY') : '-',
            item.status
        ]);
        exportCSV({
            header,
            rows,
            filename: `tugas_${internshipActivity?.id}_${dayjs().format('MMMM_YYYY')}.csv`
        });
    }

    // Export ke PDF
    function handleExportPDF() {
        const header = ['No', 'Judul', 'Dibuat', 'Jatuh Tempo', 'Status'];
        const rows = (assignments || []).map((item: any, idx: number) => [
            idx + 1,
            item.title,
            item.created_at ? dayjs(item.created_at).format('D MMMM YYYY') : '-',
            item.due_date ? dayjs(item.due_date).format('D MMMM YYYY') : '-',
            item.status
        ]);
        exportPDF({
            header,
            rows,
            filename: `tugas_${internshipActivity?.id}_${dayjs().format('MMMM_YYYY')}.pdf`,
            title: 'Daftar Tugas Magang',
            startY: 20
        });
    }

    // Print table
    function handlePrintTable() {
        printTable({
            elementId: 'assignments-table-print',
            title: 'Daftar Tugas Magang'
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs(internshipActivity)}>
            <Head title={`Tugas Magang #${internshipActivity.id}`} />
            <div className="px-4 py-6">
                <Heading title="Tugas dari Mentor" description="Lihat dan kerjakan tugas yang diberikan mentor selama magang." />
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
                                        <a href={item.href}>{item.title}</a>
                                    </Button>
                                );
                            })}
                        </nav>
                    </aside>
                    <main className="flex-1">
                        <Card className="mb-8 p-6">
                            <h2 className="font-semibold text-lg mb-4">Daftar Tugas</h2>
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
                            </div>
                            <div className="overflow-x-auto" id="assignments-table-print">
                                <table className="min-w-full border text-sm bg-white dark:bg-gray-900">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-gray-800">
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">No</th>
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">Judul</th>
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">Dibuat</th>
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">Jatuh Tempo</th>
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignments && assignments.length > 0 ? assignments.map((item: any, idx: number) => (
                                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                                <td className="px-4 py-2 border text-center">{idx + 1}</td>
                                                <td className="px-4 py-2 border">
                                                    <a
                                                        href={`/internship-activities/${internshipActivity.id}/assignments/${item.id}`}
                                                        className="text-primary-700 dark:text-primary-300 font-semibold underline hover:text-primary-900 dark:hover:text-primary-100 transition"
                                                    >
                                                        {item.title}
                                                    </a>
                                                </td>
                                                <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">{item.created_at ? item.created_at.slice(0, 10) : '-'}</td>
                                                <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">{item.due_date}</td>
                                                <td className="px-4 py-2 border text-gray-900 dark:text-gray-100 capitalize">
                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold
                                                        ${item.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                                                        ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                        ${item.status === 'late' ? 'bg-red-100 text-red-800' : ''}
                                                        ${item.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : ''}
                                                        ${item.status === 'submitted' ? 'bg-purple-100 text-purple-800' : ''}
                                                        ${item.status === 'reviewed' ? 'bg-gray-200 text-gray-800' : ''}
                                                    `}>{item.status || '-'}</span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={5} className="text-center text-gray-500 py-4">Belum ada tugas dari mentor.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </main>
                </div>
            </div>
        </AppLayout>
    );
}
