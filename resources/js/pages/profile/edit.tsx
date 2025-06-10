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

export default function ProfileEdit({ user, profile }: any) {
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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/profile/edit', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Profile', href: '/profile' }, { title: 'Edit Data Pribadi', href: '/profile/edit' }]}>
            <div className="px-4 py-6">
                <Heading title="Edit Data Pribadi" description="Perbarui data pribadi Anda untuk keperluan magang." />
                <div className="flex flex-col lg:flex-row lg:space-x-12">
                    <aside className="w-full max-w-xl lg:w-48 mb-8 lg:mb-0">
                        <nav className="flex flex-col space-y-1 space-x-0">
                            {profileNavItems.map((item) => (
                                <Button
                                    key={item.key}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className="w-full justify-start"
                                >
                                    <Link href={item.href}>{item.title}</Link>
                                </Button>
                            ))}
                        </nav>
                    </aside>
                    <div className="flex-1">
                        <Card className="max-w-2xl mx-auto p-6 mt-4">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    <div className="md:col-span-2">
                                        <Label htmlFor="gender">Jenis Kelamin</Label>
                                        <select id="gender" className="input w-full mt-1" value={data.gender} onChange={e => setData('gender', e.target.value)} required>
                                            <option value="">Pilih</option>
                                            <option value="male">Laki-laki</option>
                                            <option value="female">Perempuan</option>
                                        </select>
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
                                        <Input id="photo_file" type="file" accept="image/*" onChange={e => setData('photo_file', e.target.files && e.target.files[0] ? e.target.files[0] : undefined)} />
                                        <InputError message={errors.photo_file} />
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-6">
                                    <Button type="submit" disabled={processing}>Simpan</Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/profile">Batal</Link>
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
