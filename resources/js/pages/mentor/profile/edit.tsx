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

const profileNavItems = [
    { title: 'Edit Data Pribadi', key: 'personal', href: '/mentor/profile/edit' },
    { title: 'Edit Data Mentor', key: 'mentor', href: '/mentor/profile/edit' },
    { title: 'Edit Media Sosial', key: 'medsos', href: '/mentor/medsos/edit' },
    { title: 'Edit Dokumen', key: 'documents', href: '/mentor/documents/edit' },
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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/mentor/profile/edit', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Profile Mentor', href: '/mentor/profile' }, { title: 'Edit Data Pribadi', href: '/mentor/profile/edit' }] }>
            <div className="px-4 py-6">
                <Heading title="Edit Data Pribadi Mentor" description="Perbarui data pribadi Anda sebagai mentor magang." />
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
                        <form onSubmit={submit} className="space-y-6">
                            <Card className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Nama Lengkap</Label>
                                        <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                                        <InputError message={errors.email} />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">No. HP</Label>
                                        <Input id="phone" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                                        <InputError message={errors.phone} />
                                    </div>
                                    <div>
                                        <Label htmlFor="gender">Jenis Kelamin</Label>
                                        <select id="gender" className="input" value={data.gender} onChange={e => setData('gender', e.target.value)}>
                                            <option value="">Pilih</option>
                                            <option value="male">Laki-laki</option>
                                            <option value="female">Perempuan</option>
                                        </select>
                                        <InputError message={errors.gender} />
                                    </div>
                                    <div>
                                        <Label htmlFor="birth_date">Tanggal Lahir</Label>
                                        <Input id="birth_date" type="date" value={data.birth_date} onChange={e => setData('birth_date', e.target.value)} />
                                        <InputError message={errors.birth_date} />
                                    </div>
                                    <div>
                                        <Label htmlFor="address">Alamat</Label>
                                        <Input id="address" value={data.address} onChange={e => setData('address', e.target.value)} />
                                        <InputError message={errors.address} />
                                    </div>
                                    <div>
                                        <Label htmlFor="occupation">Pekerjaan</Label>
                                        <Input id="occupation" value={data.occupation} onChange={e => setData('occupation', e.target.value)} />
                                        <InputError message={errors.occupation} />
                                    </div>
                                    <div>
                                        <Label htmlFor="identity_number">NIK</Label>
                                        <Input id="identity_number" value={data.identity_number} onChange={e => setData('identity_number', e.target.value)} />
                                        <InputError message={errors.identity_number} />
                                    </div>
                                    <div>
                                        <Label htmlFor="photo_file">Foto Profil</Label>
                                        <Input id="photo_file" type="file" onChange={e => setData('photo_file', e.target.files?.[0])} />
                                        <InputError message={errors.photo_file} />
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <Button type="submit" disabled={processing}>Simpan</Button>
                                </div>
                            </Card>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

