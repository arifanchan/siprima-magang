/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { Input } from '@/components/ui/input';
import FilePreviewButton from '@/components/ui/file-preview-button';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';

export default function MentorLogbookDetailPage() {
    const { logbook, activity, student } = usePage().props as any;
    const [form, setForm] = useState({
        status: logbook?.status || 'pending',
        feedback: logbook?.feedback || '',
    });
    const [saving, setSaving] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalFile, setModalFile] = useState<string|null>(null);

    // Breadcrumbs dan subnav
    const studentName = student?.user?.name || '-';
    const breadcrumbs = [
        { title: 'Daftar Bimbingan', href: '/mentor/activities' },
        { title: studentName, href: `/mentor/activities/${activity?.id}` },
        { title: 'Logbook', href: `/mentor/activities/${activity?.id}/logbook` },
        { title: dayjs(logbook.date).locale('id').format('dddd, DD MMMM YYYY'), href: '#' },
    ];
    const subNavItems = [
        { key: 'summary', title: 'Ringkasan', href: `/mentor/activities/${activity?.id}` },
        { key: 'profile', title: 'Profil Mahasiswa', href: `/mentor/activities/${activity?.id}/profile` },
        { key: 'presence', title: 'Presensi', href: `/mentor/activities/${activity?.id}/presence` },
        { key: 'logbook', title: 'Logbook', href: `/mentor/activities/${activity?.id}/logbook` },
        { key: 'assignments', title: 'Tugas', href: `/mentor/activities/${activity?.id}/assignments` },
        { key: 'report', title: 'Laporan', href: `/mentor/activities/${activity?.id}/report` },
        { key: 'final-assessment', title: 'Penilaian Akhir', href: `/mentor/activities/${activity?.id}/final-assessment` },
    ];

    function formatTanggalIndo(dateStr: string) {
        return dayjs(dateStr).locale('id').format('dddd, D MMMM YYYY');
    }
    function getEvidenceUrl(evidence: string) {
        if (!evidence) return null;
        if (evidence.startsWith('http')) return evidence;
        return `/storage/${evidence}`;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        router.patch(`/mentor/activities/${activity.id}/logbook/${logbook.id}/feedback`, form, {
            onFinish: () => setSaving(false),
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Daftar Bimbingan', href: '/mentor/activities' },
            { title: studentName, href: `/mentor/activities/${activity?.id}` },
            { title: 'Logbook', href: `/mentor/activities/${activity?.id}/logbook` },
            { title: dayjs(logbook.date).locale('id').format('dddd, DD MMMM YYYY'), href: '#' },
        ]}>
            <Head title={`Review Logbook - ${studentName}`} />
            <div className="px-4 py-6">
                <Heading
                    title="Detail Logbook Mahasiswa"
                    description="Lihat detail logbook harian dan berikan feedback/approval untuk mahasiswa bimbingan Anda."
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
                        <Card className="mb-8 p-6 max-w-2xl mx-auto">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tanggal</label>
                                    <div className="font-semibold text-base">{formatTanggalIndo(logbook.date)}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Judul Kegiatan</label>
                                    <div className="font-semibold text-base">{logbook.activity}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Deskripsi</label>
                                    <div className="whitespace-pre-line text-base">{logbook.description}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Bukti Kegiatan</label>
                                    {logbook.evidence_harian ? (
                                        <Button size="sm" variant="outline" type="button" onClick={() => { setModalFile(getEvidenceUrl(logbook.evidence_harian)); setModalOpen(true); }}>
                                            <Eye size={16} className="mr-1" /> Preview
                                        </Button>
                                    ) : <span className="text-gray-400">Tidak ada bukti</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Status</label>
                                    <div className="flex gap-2">
                                        {['pending', 'approved', 'rejected'].map((status) => (
                                            <Button
                                                key={status}
                                                type="button"
                                                variant={form.status === status ? 'default' : 'outline'}
                                                className={form.status === status ? 'font-bold' : ''}
                                                onClick={() => setForm(f => ({ ...f, status }))}
                                            >
                                                {status === 'pending' && 'Pending'}
                                                {status === 'approved' && 'Approved'}
                                                {status === 'rejected' && 'Rejected'}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Feedback</label>
                                    <textarea
                                        name="feedback"
                                        value={form.feedback}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1 w-full text-sm min-h-[80px]"
                                        placeholder="Tulis feedback atau catatan untuk mahasiswa..."
                                    />
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button type="submit" disabled={saving} className="px-6">
                                        {saving ? 'Menyimpan...' : 'Simpan Feedback'}
                                    </Button>
                                    <Button asChild variant="secondary">
                                        <Link href={`/mentor/activities/${activity?.id}/logbook`}>
                                            Kembali ke Daftar Logbook
                                        </Link>
                                    </Button>
                                </div>
                            </form>
                        </Card>
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
                    </main>
                </div>
            </div>
        </AppLayout>
    );
}
