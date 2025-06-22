import { Head, usePage, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { Input } from '@/components/ui/input';
import FilePreviewButton from '@/components/ui/file-preview-button';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';

export default function LogbookDetailPage() {
    const { logbook, internshipActivity } = usePage().props as any;
    const [form, setForm] = useState({
        activity: logbook?.activity || '',
        description: logbook?.description || '',
        evidence_harian: '',
    });
    const [preview, setPreview] = useState(logbook?.evidence_harian || '');
    const [saving, setSaving] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalFile, setModalFile] = useState<string|null>(null);

    useEffect(() => {
        setForm({
            activity: logbook?.activity || '',
            description: logbook?.description || '',
            evidence_harian: '',
        });
        setPreview(logbook?.evidence_harian || '');
    }, [logbook?.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm({ ...form, evidence_harian: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const data = new FormData();
        data.append('activity', form.activity);
        data.append('description', form.description);
        if (form.evidence_harian) data.append('evidence_harian', form.evidence_harian);
        router.post(`/internship-activities/${internshipActivity.id}/logbook/${logbook.id}/update`, data, {
            forceFormData: true,
            onFinish: () => setSaving(false),
        });
    };

    if (!internshipActivity || !logbook) {
        return <div className="p-8 text-center text-gray-500">Logbook tidak ditemukan.</div>;
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

    return (
        <AppLayout breadcrumbs={[
            { title: 'Aktivitas Magang', href: '/internship-activities' },
            { title: `Detail #${internshipActivity.id}`, href: `/internship-activities/${internshipActivity.id}` },
            { title: 'Logbook Harian', href: `/internship-activities/${internshipActivity.id}/logbook` },
            { title: dayjs(logbook.date).locale('id').format('dddd, DD MMMM YYYY'), href: '#' },
        ]}>
            <Head title={`Logbook ${dayjs(logbook.date).locale('id').format('dddd, DD MMMM YYYY')}`} />
            <div className="px-4 py-6">
                <Heading title="Detail Logbook" description="Lihat dan lengkapi catatan logbook harian Anda." />
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
                        <Card className="p-6 mb-8 shadow-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1 text-primary-800 dark:text-primary-200">{dayjs(logbook.date).locale('id').format('dddd, DD MMMM YYYY')}</h2>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-300">
                                        <span>Judul: <span className="font-semibold text-gray-700 dark:text-gray-100">{logbook.activity || '-'}</span></span>
                                    </div>
                                </div>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm border
                                    ${logbook.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                                    ${logbook.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
                                    ${logbook.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                                `}>
                                    {logbook.status || '-'}
                                </span>
                            </div>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                                <div>
                                    <div className="font-semibold mb-1">Judul Kegiatan</div>
                                    <Input type="text" name="activity" value={form.activity} onChange={handleChange} className="w-full" required disabled={isEnded} />
                                </div>
                                <div>
                                    <div className="font-semibold mb-1">Deskripsi</div>
                                    <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900" required rows={3} disabled={isEnded} />
                                </div>
                                <div>
                                    <div className="font-semibold mb-1">Bukti Kegiatan (evidence)</div>
                                    <Input type="file" name="evidence_harian" accept="image/*,application/pdf" onChange={handleFileChange} className="w-full" disabled={isEnded} />
                                    {/* Tombol preview file jika sudah ada di database */}
                                    {logbook.evidence_harian && !preview && (
                                        <FilePreviewButton
                                            label="Preview File"
                                            onClick={() => {
                                                setModalFile(logbook.evidence_harian.startsWith('http') ? logbook.evidence_harian : `/storage/${logbook.evidence_harian}`);
                                                setModalOpen(true);
                                            }}
                                            className="mt-2"
                                        >
                                            <Eye size={16} />
                                        </FilePreviewButton>
                                    )}
                                    {/* Tombol preview file jika baru upload */}
                                    {preview && (
                                        <FilePreviewButton
                                            label="Preview File"
                                            onClick={() => {
                                                setModalFile(preview);
                                                setModalOpen(true);
                                            }}
                                            className="mt-2"
                                        >
                                            <Eye size={16} />
                                        </FilePreviewButton>
                                    )}
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
                                <div className="flex gap-2 mt-4">
                                    <Button type="submit" disabled={saving || isEnded} variant="secondary" className="bg-black text-white hover:bg-gray-800">
                                        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>
                                    <Button asChild variant="secondary">
                                        <Link href={`/internship-activities/${internshipActivity.id}/logbook`}>
                                            Kembali ke Daftar Logbook
                                        </Link>
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </main>
                </div>
            </div>
        </AppLayout>
    );
}
