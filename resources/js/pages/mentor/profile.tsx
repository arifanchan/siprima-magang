/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import { Head, Link } from '@inertiajs/react';
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

const profileNavItems = [
    { title: 'Edit Data Pribadi', key: 'personal', href: '/mentor/profile/edit' },
    { title: 'Edit Data Mentor', key: 'mentor', href: '/mentor/mentor/edit' },
    { title: 'Edit Media Sosial', key: 'medsos', href: '/mentor/medsos/edit' },
];

export default function MentorProfileShow({ user, profile, mentor, mediaSosial, documents }: any) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalFile, setModalFile] = useState<string|null>(null);
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Profile Mentor', href: '/mentor/profile' },
    ];

    const getProfileFilePath = (file: string|undefined|null, folder = 'profile_photos') => {
        if (!file) return '';
        if (file.includes('/')) return `/storage/${file.replace(/^storage\//, '')}`;
        return `/storage/users/${user.id}/${folder}/${file}`;
    };
    const getMentorDocumentPath = (file: string|undefined|null, folder: string) => {
        if (!file) return '';
        if (file.includes('/')) return `/storage/${file.replace(/^storage\//, '')}`;
        return `/storage/users/${user.id}/${folder}/${file}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-2xl w-full">
                    <DialogClose asChild>
                        <button className="absolute top-2 right-2 text-xl">&times;</button>
                    </DialogClose>
                    {modalFile && (modalFile.match(/\.(jpg|jpeg|png)$/i)
                        ? <img src={modalFile} alt="Preview Dokumen" className="max-h-[70vh] mx-auto" />
                        : <iframe src={modalFile} title="Preview Dokumen" className="w-full min-h-[60vh]" />)}
                </DialogContent>
            </Dialog>
            <div className="px-4 py-6">
                <Heading title="Profile Mentor" description="Lihat dan kelola data profil Anda sebagai mentor magang." />
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                    <aside className="w-full max-w-xl lg:w-48">
                        <nav className="flex flex-col space-y-1 space-x-0">
                            {profileNavItems.map((item) => {
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
                                            onClick={() => { if(profile?.photo_file) { setModalFile(getProfileFilePath(profile.photo_file, 'profile_photos')); setModalOpen(true); } }}
                                            className="focus:outline-none group relative"
                                            style={{ cursor: profile?.photo_file ? 'pointer' : 'default' }}
                                            aria-label="Lihat foto profil"
                                        >
                                            <img
                                                src={getProfileFilePath(profile?.photo_file, 'profile_photos') || '/default-avatar.png'}
                                                alt="Foto Profil"
                                                className="w-20 h-20 rounded-full object-cover border shadow hover:brightness-90 transition group-hover:ring-2 group-hover:ring-primary"
                                            />
                                            {profile?.photo_file && (
                                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-border">
                                                    Klik untuk preview
                                                </span>
                                            )}
                                        </button>
                                        <div>
                                            <div className="text-lg font-semibold">{user.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {user.email ? (
                                                    <a href={`mailto:${user.email}`} className="text-primary underline hover:text-primary">{user.email}</a>
                                                ) : '-'}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {user.phone ? (
                                                    <a href={`https://wa.me/${user.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary">
                                                        {user.phone}
                                                    </a>
                                                ) : '-'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                        <div>Jenis Kelamin</div>
                                        <div>{profile?.gender === 'male' ? 'Laki-laki' : profile?.gender === 'female' ? 'Perempuan' : '-'}</div>
                                        <div>Tanggal Lahir</div>
                                        <div>{profile?.birth_date ? dayjs(profile.birth_date).format("DD MMMM YYYY") : '-'}</div>
                                        <div>Alamat</div>
                                        <div>{profile?.address || '-'}</div>
                                        <div>Pekerjaan</div>
                                        <div>{profile?.occupation || '-'}</div>
                                        <div>NIK</div>
                                        <div>{profile?.identity_number || '-'}</div>
                                    </div>
                                </Card>
                                {/* Data Mentor */}
                                <Card className="flex-1 p-6 min-w-0 w-full">
                                    <h2 className="font-semibold text-lg mb-4">Data Mentor</h2>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                        <div>NIP</div>
                                        <div>{mentor?.nip || '-'}</div>
                                        <div>Divisi</div>
                                        <div>{mentor?.division || '-'}</div>
                                        <div>Keahlian</div>
                                        <div>{mentor?.expertise || '-'}</div>
                                        <div>Jabatan</div>
                                        <div>{mentor?.position || '-'}</div>
                                        <div>Bio</div>
                                        <div>{mentor?.bio || '-'}</div>
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
                                {/* Riwayat Bimbingan */}
                                <Card className="flex-1 p-6 min-w-0 w-full">
                                    <h2 className="font-semibold text-lg mb-4">Riwayat Bimbingan</h2>
                                    <div className="overflow-x-auto">
                                        {Array.isArray(mentor?.supervisions) && mentor.supervisions.length > 0 ? (
                                            <table className="min-w-full text-sm border">
                                                <thead>
                                                    <tr className="bg-muted">
                                                        <th className="px-2 py-1 border">Nama Mahasiswa</th>
                                                        <th className="px-2 py-1 border">Periode</th>
                                                        <th className="px-2 py-1 border">Status</th>
                                                        <th className="px-2 py-1 border">Penilaian Akhir</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {mentor.supervisions.map((item: any) => (
                                                        <tr key={item.id}>
                                                            <td className="border px-2 py-1">{item.student_name}</td>
                                                            <td className="border px-2 py-1">{item.period}</td>
                                                            <td className="border px-2 py-1">{item.status}</td>
                                                            <td className="border px-2 py-1">{item.final_score ?? '-'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="text-muted-foreground">Belum ada riwayat bimbingan.</div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
