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

const mentorNavItems = [
    { title: 'Edit Data Pribadi', key: 'personal', href: '/mentor/profile/edit' },
    { title: 'Edit Data Mentor', key: 'mentor', href: '/mentor/mentor/edit' },
    { title: 'Edit Media Sosial', key: 'medsos', href: '/mentor/medsos/edit' },
];

export default function MentorEdit({ mentor }: any) {
    const { data, setData, post, processing, errors } = useForm({
        nip: mentor?.nip || '',
        division: mentor?.division || '',
        expertise: mentor?.expertise || '',
        position: mentor?.position || '',
        bio: mentor?.bio || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/mentor/mentor/edit');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Profile Mentor', href: '/mentor/profile' }, { title: 'Edit Data Mentor', href: '/mentor/mentor/edit' }] }>
            <div className="px-4 py-6">
                <Heading title="Edit Data Mentor" description="Perbarui data kepegawaian dan keahlian Anda sebagai mentor magang." />
                <div className="flex flex-col lg:flex-row lg:space-x-12">
                    <aside className="w-full max-w-xl lg:w-48 mb-8 lg:mb-0">
                        <nav className="flex flex-col space-y-1 space-x-0">
                            {mentorNavItems.map((item) => {
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
                                        <Label htmlFor="nip">NIP</Label>
                                        <Input id="nip" value={data.nip} onChange={e => setData('nip', e.target.value)} required />
                                        <InputError message={errors.nip} />
                                    </div>
                                    <div>
                                        <Label htmlFor="division">Divisi</Label>
                                        <Input id="division" value={data.division} onChange={e => setData('division', e.target.value)} required />
                                        <InputError message={errors.division} />
                                    </div>
                                    <div>
                                        <Label htmlFor="expertise">Keahlian</Label>
                                        <Input id="expertise" value={data.expertise} onChange={e => setData('expertise', e.target.value)} required />
                                        <InputError message={errors.expertise} />
                                    </div>
                                    <div>
                                        <Label htmlFor="position">Jabatan</Label>
                                        <Input id="position" value={data.position} onChange={e => setData('position', e.target.value)} required />
                                        <InputError message={errors.position} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Input id="bio" value={data.bio} onChange={e => setData('bio', e.target.value)} />
                                        <InputError message={errors.bio} />
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

