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

export default function StudentEdit({ student }: any) {
    const { data, setData, post, processing, errors } = useForm({
        student_number: student?.student_number || '',
        university: student?.university || '',
        study_program: student?.study_program || '',
        faculty: student?.faculty || '',
        entry_year: student?.entry_year || '',
        semester_or_grade: student?.semester_or_grade || '',
        latest_academic_score: student?.latest_academic_score || '',
        advisor_name: student?.advisor_name || '',
        advisor_phone: student?.advisor_phone || '',
        bio: student?.bio || '',
        emergency_contact: student?.emergency_contact || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/profile/student/edit');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Profile', href: '/profile' }, { title: 'Edit Data Siswa/Mahasiswa', href: '/profile/student/edit' }]}>
            <div className="px-4 py-6">
                <Heading title="Edit Data Siswa/Mahasiswa" description="Perbarui data siswa/mahasiswa Anda untuk keperluan magang." />
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
                                        <Label htmlFor="student_number">NIM/NIS</Label>
                                        <Input id="student_number" value={data.student_number} onChange={e => setData('student_number', e.target.value)} required />
                                        <InputError message={errors.student_number} />
                                    </div>
                                    <div>
                                        <Label htmlFor="university">Universitas/Sekolah</Label>
                                        <Input id="university" value={data.university} onChange={e => setData('university', e.target.value)} required />
                                        <InputError message={errors.university} />
                                    </div>
                                    <div>
                                        <Label htmlFor="study_program">Program Studi/Jurusan</Label>
                                        <Input id="study_program" value={data.study_program} onChange={e => setData('study_program', e.target.value)} required />
                                        <InputError message={errors.study_program} />
                                    </div>
                                    <div>
                                        <Label htmlFor="faculty">Fakultas</Label>
                                        <Input id="faculty" value={data.faculty} onChange={e => setData('faculty', e.target.value)} />
                                        <InputError message={errors.faculty} />
                                    </div>
                                    <div>
                                        <Label htmlFor="entry_year">Tahun Masuk</Label>
                                        <Input id="entry_year" type="number" value={data.entry_year} onChange={e => setData('entry_year', e.target.value)} required />
                                        <InputError message={errors.entry_year} />
                                    </div>
                                    <div>
                                        <Label htmlFor="semester_or_grade">Semester/Kelas</Label>
                                        <Input id="semester_or_grade" value={data.semester_or_grade} onChange={e => setData('semester_or_grade', e.target.value)} />
                                        <InputError message={errors.semester_or_grade} />
                                    </div>
                                    <div>
                                        <Label htmlFor="latest_academic_score">IPK/Nilai Terakhir</Label>
                                        <Input id="latest_academic_score" value={data.latest_academic_score} onChange={e => setData('latest_academic_score', e.target.value)} />
                                        <InputError message={errors.latest_academic_score} />
                                    </div>
                                    <div>
                                        <Label htmlFor="advisor_name">Nama Pembimbing</Label>
                                        <Input id="advisor_name" value={data.advisor_name} onChange={e => setData('advisor_name', e.target.value)} />
                                        <InputError message={errors.advisor_name} />
                                    </div>
                                    <div>
                                        <Label htmlFor="advisor_phone">No. HP Pembimbing</Label>
                                        <Input id="advisor_phone" value={data.advisor_phone} onChange={e => setData('advisor_phone', e.target.value)} />
                                        <InputError message={errors.advisor_phone} />
                                    </div>
                                    <div>
                                        <Label htmlFor="emergency_contact">Kontak Darurat</Label>
                                        <Input id="emergency_contact" value={data.emergency_contact} onChange={e => setData('emergency_contact', e.target.value)} />
                                        <InputError message={errors.emergency_contact} />
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
