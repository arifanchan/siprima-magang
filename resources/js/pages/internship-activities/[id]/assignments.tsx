import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import React, { useState } from 'react';
import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
        { key: 'logbook', title: 'Logbook Harian', href: `/internship-activities/${internshipActivity.id}/logbook` },
        { key: 'assignments', title: 'Tugas dari Mentor', href: `/internship-activities/${internshipActivity.id}/assignments` },
        { key: 'final-report', title: 'Laporan Akhir', href: `/internship-activities/${internshipActivity.id}/report` },
        { key: 'assessment', title: 'Penilaian & Sertifikat', href: `/internship-activities/${internshipActivity.id}/final-assessment` },
        { key: 'feedback', title: 'Feedback/Notifikasi', href: '#' },
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

    return (
        <AppLayout breadcrumbs={breadcrumbs(internshipActivity)}>
            <Head title={`Tugas Magang #${internshipActivity.id}`} />
            <div className="px-4 py-6">
                <Heading title="Tugas dari Mentor" description="Lihat dan kerjakan tugas yang diberikan mentor selama magang." />
                <div className="flex flex-col lg:flex-row lg:space-x-12 mb-8">
                    <aside className="w-full max-w-xl lg:w-48 mb-8 lg:mb-0">
                        <nav className="flex flex-col space-y-1 space-x-0">
                            {navItems.map((item) => (
                                <Button
                                    key={item.key}
                                    size="sm"
                                    variant={item.key === 'assignments' ? 'default' : 'ghost'}
                                    asChild
                                    className="w-full justify-start"
                                >
                                    <a href={item.href}>{item.title}</a>
                                </Button>
                            ))}
                        </nav>
                    </aside>
                    <main className="flex-1">
                        <Card className="mb-8 p-6">
                            <h2 className="font-semibold text-lg mb-4">Daftar Tugas</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border text-sm bg-white dark:bg-gray-900">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-gray-800">
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">No</th>
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">Judul</th>
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">Jatuh Tempo</th>
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">Status</th>
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignments && assignments.length > 0 ? assignments.map((item: any, idx: number) => (
                                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                                <td className="px-4 py-2 border text-center">{idx + 1}</td>
                                                <td className="px-4 py-2 border text-blue-600 dark:text-blue-400 font-medium underline cursor-pointer">
                                                    <a href={`/internship-activities/${internshipActivity.id}/assignments/${item.id}`}>{item.title}</a>
                                                </td>
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
                                                <td className="px-4 py-2 border text-gray-900 dark:text-gray-100 text-center">
                                                    <a href={`/internship-activities/${internshipActivity.id}/assignments/${item.id}`}
                                                        className="inline-block px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                                                        Detail
                                                    </a>
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
