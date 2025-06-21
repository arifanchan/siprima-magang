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

    // Sidebar nav items sama seperti halaman lain
    const navItems = [
        { key: 'index', title: 'Daftar Aktivitas', href: '/internship-activities' },
        { key: 'presence', title: 'Presensi', href: `/internship-activities/${internshipActivity.id}/presence` },
        { key: 'logbook', title: 'Logbook Harian', href: `/internship-activities/${internshipActivity.id}/logbook` },
        { key: 'assignments', title: 'Tugas dari Mentor', href: `/internship-activities/${internshipActivity.id}/assignments` },
        { key: 'final-report', title: 'Laporan Akhir', href: `/internship-activities/${internshipActivity.id}/report` },
        { key: 'assessment', title: 'Penilaian & Sertifikat', href: `/internship-activities/${internshipActivity.id}/final-assessment` },
        { key: 'feedback', title: 'Feedback/Notifikasi', href: '#' },
    ];

    // Handler form logbook (dummy, belum terhubung backend)
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
            <Head title={`Logbook Magang #${internshipActivity.id}`} />
            <div className="px-4 py-6">
                <Heading title="Logbook Harian" description="Lihat catatan aktivitas harian magang Anda di sini." />
                <div className="flex flex-col lg:flex-row lg:space-x-12 mb-8">
                    <aside className="w-full max-w-xl lg:w-48 mb-8 lg:mb-0">
                        <nav className="flex flex-col space-y-1 space-x-0">
                            {navItems.map((item) => (
                                <Button
                                    key={item.key}
                                    size="sm"
                                    variant={item.key === 'logbook' ? 'secondary' : 'ghost'}
                                    asChild
                                    className={`w-full justify-start ${item.key === 'logbook' ? 'font-bold text-black dark:text-white bg-gray-200 dark:bg-gray-800' : ''}`}
                                >
                                    <Link href={item.href}>{item.title}</Link>
                                </Button>
                            ))}
                        </nav>
                    </aside>
                    <main className="flex-1">
                        <Card className="mb-8 p-6">
                            <h2 className="font-semibold text-lg mb-4">Daftar Logbook</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border text-sm bg-white dark:bg-gray-900">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-gray-800">
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">Tanggal</th>
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">Judul Kegiatan</th>
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">Bukti</th>
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">Status</th>
                                            <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">Feedback</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logbooks && logbooks.length > 0 ? logbooks.map((item: any) => (
                                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                                {/* Tanggal sebagai link ke detail/show logbook */}
                                                <td className="px-4 py-2 border align-top">
                                                    {item.date && dayjs(item.date).isAfter(dayjs(), 'day') ? (
                                                        <span className="text-gray-400 cursor-not-allowed">{dayjs(item.date).locale('id').format('dddd, DD MMMM YYYY')}</span>
                                                    ) : (
                                                        <Link href={`/internship-activities/${internshipActivity.id}/logbook/${item.id}`} className="text-primary-700 dark:text-primary-300 font-semibold underline hover:text-primary-900 dark:hover:text-primary-100 transition">
                                                            {item.date ? dayjs(item.date).locale('id').format('dddd, DD MMMM YYYY') : '-'}
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
