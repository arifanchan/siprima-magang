/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import { useForm, Link } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import FilePreviewButton from '@/components/ui/file-preview-button';

const profileNavItems = [
    { title: 'Edit Data Pribadi', key: 'personal', href: '/mentor/profile/edit' },
    { title: 'Edit Data Mentor', key: 'mentor', href: '/mentor/mentor/edit' },
    { title: 'Edit Media Sosial', key: 'medsos', href: '/mentor/medsos/edit' },
];

export default function MentorProfileEdit({ user, profile }: any) {
    const { data, setData, post, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: profile?.gender || '',
        birth_date: profile?.birth_date || '',
        address: profile?.address || '',
        occupation: profile?.occupation || '',
        identity_number: profile?.identity_number || '',
        photo_file: undefined,
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [modalFile, setModalFile] = useState<string|null>(null);

    // Helper untuk path dokumen profile (identik dengan show.tsx)
    const getProfileFilePath = (file: string|undefined|null, folder = 'profile_photos') => {
        if (!file) return '';
        if (file.includes('/')) return `/storage/${file.replace(/^storage\//, '')}`;
        return `/storage/users/${user.id}/${folder}/${file}`;
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/mentor/profile/edit', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Profile Mentor', href: '/mentor/profile' }, { title: 'Edit Data Pribadi', href: '/mentor/profile/edit' }] }>
            {/* Modal Preview Foto Profil */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-2xl w-full">
                    <DialogClose asChild>
                        <button className="absolute top-2 right-2 text-xl">&times;</button>
                    </DialogClose>
                    {modalFile && (
                        <img src={modalFile} alt="Preview Foto Profil" className="max-h-[70vh] mx-auto" />
                    )}
                </DialogContent>
            </Dialog>
            <div className="px-4 py-6">
                <Heading title="Edit Data Pribadi Mentor" description="Perbarui data pribadi Anda sebagai mentor magang." />
                <div className="flex flex-col lg:flex-row lg:space-x-12">
                    <aside className="w-full max-w-xl lg:w-48 mb-8 lg:mb-0">
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
                        <Card className="max-w-2xl mx-auto p-6 mt-4">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Nama</Label>
                                        <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} required />
                                        <InputError message={errors.email} />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">No. HP</Label>
                                        <Input id="phone" value={data.phone} onChange={e => setData('phone', e.target.value)} required />
                                        <InputError message={errors.phone} />
                                    </div>
                                    <div>
                                        <Label htmlFor="birth_date">Tanggal Lahir</Label>
                                        <Input id="birth_date" type="date" value={data.birth_date} onChange={e => setData('birth_date', e.target.value)} required />
                                        <InputError message={errors.birth_date} />
                                    </div>
                                    <div>
                                        <Label htmlFor="gender">Jenis Kelamin</Label>
                                        <div className="mt-1">
                                            <div className="inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
                                                {[{value: 'male', label: 'Laki-laki'}, {value: 'female', label: 'Perempuan'}].map(opt => (
                                                    <button
                                                        type="button"
                                                        key={opt.value}
                                                        onClick={() => setData('gender', opt.value)}
                                                        className={
                                                            (data.gender === opt.value
                                                                ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                                                                : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60') +
                                                            ' flex items-center rounded-md px-3.5 py-1.5 transition-colors'
                                                        }
                                                    >
                                                        <span className="text-sm">{opt.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <InputError message={errors.gender} />
                                    </div>
                                    <div>
                                        <Label htmlFor="address">Alamat</Label>
                                        <Input id="address" value={data.address} onChange={e => setData('address', e.target.value)} required />
                                        <InputError message={errors.address} />
                                    </div>
                                    <div>
                                        <Label htmlFor="occupation">Pekerjaan</Label>
                                        <Input id="occupation" value={data.occupation} onChange={e => setData('occupation', e.target.value)} />
                                        <InputError message={errors.occupation} />
                                    </div>
                                    <div>
                                        <Label htmlFor="identity_number">NIK</Label>
                                        <Input id="identity_number" value={data.identity_number} onChange={e => setData('identity_number', e.target.value)} required />
                                        <InputError message={errors.identity_number} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label htmlFor="photo_file">Foto Profil</Label>
                                        {profile?.photo_file && (
                                            <div className="mb-2">
                                                <FilePreviewButton
                                                    label="Lihat Foto Profil"
                                                    onClick={() => { setModalFile(`${getProfileFilePath(profile.photo_file, 'profile_photos')}`); setModalOpen(true); }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </FilePreviewButton>
                                            </div>
                                        )}
                                        <Input id="photo_file" type="file" accept="image/*" onChange={e => setData('photo_file', e.target.files && e.target.files[0] ? e.target.files[0] : undefined)} />
                                        <InputError message={errors.photo_file} />
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-6">
                                    <Button type="submit" disabled={processing}>Simpan</Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/mentor/profile">Batal</Link>
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
