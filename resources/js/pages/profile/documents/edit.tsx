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

export default function DocumentsEdit({ profile }: any) {
    const { data, setData, post, processing, errors } = useForm({
        ktp_file: undefined,
        ktm_or_student_card_file: undefined,
        transcript_file: undefined,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/profile/documents/edit', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Profile', href: '/profile' }, { title: 'Edit Dokumen', href: '/profile/documents/edit' }]}>
            <div className="px-4 py-6">
                <Heading title="Edit Dokumen" description="Upload atau perbarui dokumen Anda untuk keperluan magang." />
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="ktp_file">File KTP</Label>
                                        {profile?.ktp_file && (
                                            <div className="mb-2">
                                                <a href={`/storage/${profile.ktp_file}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Lihat File KTP</a>
                                            </div>
                                        )}
                                        <Input id="ktp_file" type="file" onChange={e => setData('ktp_file', e.target.files?.[0])} />
                                        <InputError message={errors.ktp_file} />
                                    </div>
                                    <div>
                                        <Label htmlFor="ktm_or_student_card_file">File KTM/Kartu Siswa</Label>
                                        {profile?.ktm_or_student_card_file && (
                                            <div className="mb-2">
                                                <a href={`/storage/${profile.ktm_or_student_card_file}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Lihat File KTM/Kartu Siswa</a>
                                            </div>
                                        )}
                                        <Input id="ktm_or_student_card_file" type="file" onChange={e => setData('ktm_or_student_card_file', e.target.files?.[0])} />
                                        <InputError message={errors.ktm_or_student_card_file} />
                                    </div>
                                    <div>
                                        <Label htmlFor="transcript_file">File Transkrip</Label>
                                        {profile?.transcript_file && (
                                            <div className="mb-2">
                                                <a href={`/storage/${profile.transcript_file}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Lihat File Transkrip</a>
                                            </div>
                                        )}
                                        <Input id="transcript_file" type="file" onChange={e => setData('transcript_file', e.target.files?.[0])} />
                                        <InputError message={errors.transcript_file} />
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

