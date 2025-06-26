/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import { Head, Link, usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import Heading from '@/components/heading';
import { useState } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import FilePreviewButton from '@/components/ui/file-preview-button';
import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

export default function MentorActivityStudentProfile() {
    const { activity, student } = usePage().props as any;
    const [modalOpen, setModalOpen] = useState(false);
    const [modalFile, setModalFile] = useState<string|null>(null);
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Daftar Bimbingan', href: '/mentor/activities' },
        { title: student?.user?.name || '-', href: `/mentor/activities/${activity?.id}` },
        { title: 'Profil Mahasiswa', href: `/mentor/activities/${activity?.id}/profile` },
    ];

    // Helper untuk path dokumen profile (identik dengan documents edit)
    const getProfileFilePath = (file: string|undefined|null, folder = 'profile_photos') => {
        if (!file) return '';
        if (file.includes('/')) return `/storage/${file.replace(/^storage\//, '')}`;
        return `/storage/users/${student.user.id}/${folder}/${file}`;
    };
    // Helper untuk path dokumen student (identik dengan documents edit)
    const getStudentDocumentPath = (file: string|undefined|null, folder: string) => {
        if (!file) return '';
        if (file.includes('/')) return `/storage/${file.replace(/^storage\//, '')}`;
        return `/storage/users/${student.user.id}/${folder}/${file}`;
    };

    const subNavItems = [
        { key: 'summary', title: 'Ringkasan', href: `/mentor/activities/${activity?.id}` },
        { key: 'profile', title: 'Profil Mahasiswa', href: `/mentor/activities/${activity?.id}/profile` },
        { key: 'presence', title: 'Presensi', href: `/mentor/activities/${activity?.id}/presence` },
        { key: 'logbook', title: 'Logbook', href: `/mentor/activities/${activity?.id}/logbook` },
        { key: 'assignments', title: 'Tugas', href: `/mentor/activities/${activity?.id}/assignments` },
        { key: 'report', title: 'Laporan', href: `/mentor/activities/${activity?.id}/report` },
        { key: 'final-assessment', title: 'Penilaian Akhir', href: `/mentor/activities/${activity?.id}/final-assessment` },
    ];

    // Ambil media sosial dari student.user.mediaSosial atau student.user.media_sosial
    const mediaSosial = student?.user?.mediaSosial || student?.user?.media_sosial || {};

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Profil Mahasiswa - ${student?.user?.name || '-'}`} />
            <div className="px-4 py-6">
                <Heading title="Profil Mahasiswa" description="Detail lengkap data peserta magang." />
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                    <aside className="w-full max-w-xl lg:w-48">
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
                    <div className="flex-1">
                        <section className="w-full space-y-8">
                            <div className="flex flex-col md:flex-row gap-8 w-full">
                                {/* Data Pribadi */}
                                <Card className="flex-1 p-6 min-w-0 w-full">
                                    <h2 className="font-semibold text-lg mb-4">Data Pribadi</h2>
                                    <div className="flex items-center gap-4 mb-4">
                                        <button
                                            type="button"
                                            onClick={() => { if(student?.profile?.photo_file) { setModalFile(getProfileFilePath(student.profile.photo_file, 'profile_photos')); setModalOpen(true); } }}
                                            className="focus:outline-none group relative"
                                            style={{ cursor: student?.profile?.photo_file ? 'pointer' : 'default' }}
                                            aria-label="Lihat foto profil"
                                        >
                                            <img
                                                src={getProfileFilePath(student?.profile?.photo_file, 'profile_photos') || '/default-avatar.png'}
                                                alt="Foto Profil"
                                                className="w-20 h-20 rounded-full object-cover border shadow hover:brightness-90 transition group-hover:ring-2 group-hover:ring-primary"
                                            />
                                            {/* Tooltip hanya muncul saat hover dan tidak menutupi foto */}
                                            {student?.profile?.photo_file && (
                                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-border">
                                                    Klik untuk preview
                                                </span>
                                            )}
                                        </button>
                                        <div>
                                            <div className="text-lg font-semibold">{student?.user?.name}</div>
                                            <div className="text-sm text-muted-foreground">{student?.user?.email || '-'}</div>
                                            <div className="text-sm text-muted-foreground">{student?.user?.phone || '-'}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                        <div>Jenis Kelamin</div>
                                        <div>{student?.profile?.gender === 'male' ? 'Laki-laki' : student?.profile?.gender === 'female' ? 'Perempuan' : '-'}</div>
                                        <div>Tanggal Lahir</div>
                                        <div>{student?.profile?.birth_date ? dayjs(student.profile.birth_date).format("DD MMMM YYYY") : '-'}</div>
                                        <div>Alamat</div>
                                        <div>{student?.profile?.address || '-'}</div>
                                        <div>Pekerjaan</div>
                                        <div>{student?.profile?.occupation || '-'}</div>
                                        <div>NIK</div>
                                        <div>{student?.profile?.identity_number || '-'}</div>
                                    </div>
                                </Card>
                                {/* Data Siswa/Mahasiswa */}
                                <Card className="flex-1 p-6 min-w-0 w-full">
                                    <h2 className="font-semibold text-lg mb-4">Data Siswa/Mahasiswa</h2>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                        <div>NIM/NIS</div>
                                        <div>{student?.student_number || '-'}</div>
                                        <div>Universitas/Sekolah</div>
                                        <div>{student?.university || '-'}</div>
                                        <div>Program Studi</div>
                                        <div>{student?.study_program || '-'}</div>
                                        <div>Fakultas</div>
                                        <div>{student?.faculty || '-'}</div>
                                        <div>Tahun Masuk</div>
                                        <div>{student?.entry_year || '-'}</div>
                                        <div>Semester/Kelas</div>
                                        <div>{student?.semester_or_grade || '-'}</div>
                                        <div>IPK/Nilai Terakhir</div>
                                        <div>{student?.latest_academic_score || '-'}</div>
                                        <div>Dosen/Wali Pembimbing</div>
                                        <div>{student?.advisor_name || '-'}</div>
                                        <div>No. HP Dosen/Wali</div>
                                        <div>{student?.advisor_phone || '-'}</div>
                                        <div>Kontak Darurat</div>
                                        <div>{student?.emergency_contact || '-'}</div>
                                    </div>
                                </Card>
                            </div>
                            <div className="flex flex-col md:flex-row gap-8 w-full">
                                {/* Data Media Sosial */}
                                <Card className="flex-1 p-6 min-w-0 w-full">
                                    <h2 className="font-semibold text-lg mb-4">Media Sosial</h2>
                                    <div className="flex flex-col gap-y-2 text-sm">
                                        {[
                                            { key: 'instagram', label: 'Instagram', prefix: 'https://instagram.com/' },
                                            { key: 'facebook', label: 'Facebook', prefix: 'https://facebook.com/' },
                                            { key: 'x', label: 'X (Twitter)', prefix: 'https://x.com/' },
                                            { key: 'youtube', label: 'YouTube', prefix: 'https://youtube.com/' },
                                            { key: 'linkedin', label: 'LinkedIn', prefix: 'https://linkedin.com/in/' },
                                            { key: 'tiktok', label: 'TikTok', prefix: 'https://tiktok.com/@' },
                                            { key: 'thread', label: 'Thread', prefix: 'https://threads.net/@' },
                                        ].map(({ key, label, prefix }) => {
                                            const value = mediaSosial?.[key];
                                            const isUrl = value && (value.startsWith('http://') || value.startsWith('https://'));
                                            const url = isUrl ? value : value ? prefix + value.replace(/^@/, '') : '';
                                            return (
                                                <div className="flex items-baseline gap-0.5 min-h-[20px]" key={key}>
                                                    <span className="font-medium w-28 flex-shrink-0 text-sm">{label}:</span>
                                                    {value ? (
                                                        <span className="overflow-x-auto whitespace-nowrap max-w-full block text-sm" style={{ scrollbarWidth: 'thin' }}>
                                                            <a
                                                                href={url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary underline hover:text-primary focus:text-primary transition-colors"
                                                            >
                                                                {value}
                                                            </a>
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">-</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Card>
                                {/* Dokumen */}
                                <Card className="flex-1 p-6 min-w-0 w-full">
                                    <h2 className="font-semibold text-lg mb-4">Dokumen</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                        <div className="flex gap-2 items-center">
                                            <span>KTP:</span>
                                            {student?.ktp_file ? (
                                                <FilePreviewButton
                                                    label="Lihat KTP"
                                                    onClick={() => { setModalFile(getStudentDocumentPath(student.ktp_file, 'ktp')); setModalOpen(true); }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </FilePreviewButton>
                                            ) : (
                                                <span className="text-muted-foreground">(belum diupload)</span>
                                            )}
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <span>KTM/Kartu Siswa:</span>
                                            {student?.ktm_or_student_card_file ? (
                                                <FilePreviewButton
                                                    label="Lihat KTM/Kartu Siswa"
                                                    onClick={() => { setModalFile(getStudentDocumentPath(student.ktm_or_student_card_file, 'ktm')); setModalOpen(true); }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </FilePreviewButton>
                                            ) : (
                                                <span className="text-muted-foreground">(belum diupload)</span>
                                            )}
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <span>Transkrip:</span>
                                            {student?.transcript_file ? (
                                                <FilePreviewButton
                                                    label="Lihat Transkrip"
                                                    onClick={() => { setModalFile(getStudentDocumentPath(student.transcript_file, 'transcript')); setModalOpen(true); }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </FilePreviewButton>
                                            ) : (
                                                <span className="text-muted-foreground">(belum diupload)</span>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </section>
                    </div>
                </div>
                {/* Modal Preview Dokumen dengan Dialog */}
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent className="max-w-2xl w-full">
                        <DialogClose asChild>
                            <button className="absolute top-2 right-2 text-xl">&times;</button>
                        </DialogClose>
                        {modalFile && (modalFile.match(/\.(jpg|jpeg|png)$/i)
                            ? <img src={modalFile} alt="Preview Dokumen" className="max-h-[80vh] mx-auto" />
                            : <iframe src={modalFile} title="Preview Dokumen" className="w-full min-h-[60vh]" />)}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
