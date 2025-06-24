/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import { useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

const profileNavItems = [
    { title: 'Edit Data Pribadi', key: 'personal', href: '/profile/edit' },
    { title: 'Edit Data Siswa/Mahasiswa', key: 'student', href: '/profile/student/edit' },
    { title: 'Edit Media Sosial', key: 'medsos', href: '/profile/medsos/edit' },
    { title: 'Edit Dokumen', key: 'documents', href: '/profile/documents/edit' },
];

export default function MedsosEdit({ mediaSosial }: any) {
    const { data, setData, post, processing, errors } = useForm({
        instagram: mediaSosial?.instagram || '',
        facebook: mediaSosial?.facebook || '',
        x: mediaSosial?.x || '',
        youtube: mediaSosial?.youtube || '',
        linkedin: mediaSosial?.linkedin || '',
        tiktok: mediaSosial?.tiktok || '',
        thread: mediaSosial?.thread || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/profile/medsos/edit');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Profile', href: '/profile' }, { title: 'Edit Media Sosial', href: '/profile/medsos/edit' }]}>
            <div className="px-4 py-6">
                <Heading title="Edit Media Sosial" description="Perbarui data media sosial Anda untuk keperluan magang." />
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
                                        <Label htmlFor="instagram">Instagram</Label>
                                        <Input id="instagram" value={data.instagram} onChange={e => setData('instagram', e.target.value)} />
                                        <InputError message={errors.instagram} />
                                    </div>
                                    <div>
                                        <Label htmlFor="facebook">Facebook</Label>
                                        <Input id="facebook" value={data.facebook} onChange={e => setData('facebook', e.target.value)} />
                                        <InputError message={errors.facebook} />
                                    </div>
                                    <div>
                                        <Label htmlFor="x">X (Twitter)</Label>
                                        <Input id="x" value={data.x} onChange={e => setData('x', e.target.value)} />
                                        <InputError message={errors.x} />
                                    </div>
                                    <div>
                                        <Label htmlFor="youtube">YouTube</Label>
                                        <Input id="youtube" value={data.youtube} onChange={e => setData('youtube', e.target.value)} />
                                        <InputError message={errors.youtube} />
                                    </div>
                                    <div>
                                        <Label htmlFor="linkedin">LinkedIn</Label>
                                        <Input id="linkedin" value={data.linkedin} onChange={e => setData('linkedin', e.target.value)} />
                                        <InputError message={errors.linkedin} />
                                    </div>
                                    <div>
                                        <Label htmlFor="tiktok">TikTok</Label>
                                        <Input id="tiktok" value={data.tiktok} onChange={e => setData('tiktok', e.target.value)} />
                                        <InputError message={errors.tiktok} />
                                    </div>
                                    <div>
                                        <Label htmlFor="thread">Thread</Label>
                                        <Input id="thread" value={data.thread} onChange={e => setData('thread', e.target.value)} />
                                        <InputError message={errors.thread} />
                                    </div>
                                </div>
                                <Button type="submit" disabled={processing}>Simpan</Button>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
