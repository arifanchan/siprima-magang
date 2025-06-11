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
    // Tambahkan state untuk modal preview dokumen
    const [modalOpen, setModalOpen] = useState(false);
    const [modalFile, setModalFile] = useState<string|null>(null);
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/profile/documents/edit', {
            forceFormData: true,
        });
    };
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Profile', href: '/profile' }, { title: 'Edit Dokumen', href: '/profile/documents/edit' }]}>
            {/* Modal Preview Dokumen dengan Dialog */}
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
                                                <FilePreviewButton
                                                    label="Lihat File KTP"
                                                    onClick={() => { setModalFile(`/storage/${profile.ktp_file}`); setModalOpen(true); }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </FilePreviewButton>
                                            </div>
                                        )}
                                        <Input id="ktp_file" type="file" onChange={e => setData('ktp_file', e.target.files?.[0])} />
                                        <InputError message={errors.ktp_file} />
                                    </div>
                                    <div>
                                        <Label htmlFor="ktm_or_student_card_file">File KTM/Kartu Siswa</Label>
                                        {profile?.ktm_or_student_card_file && (
                                            <div className="mb-2">
                                                <FilePreviewButton
                                                    label="Lihat File KTM/Kartu Siswa"
                                                    onClick={() => { setModalFile(`/storage/${profile.ktm_or_student_card_file}`); setModalOpen(true); }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </FilePreviewButton>
                                            </div>
                                        )}
                                        <Input id="ktm_or_student_card_file" type="file" onChange={e => setData('ktm_or_student_card_file', e.target.files?.[0])} />
                                        <InputError message={errors.ktm_or_student_card_file} />
                                    </div>
                                    <div>
                                        <Label htmlFor="transcript_file">File Transkrip</Label>
                                        {profile?.transcript_file && (
                                            <div className="mb-2">
                                                <FilePreviewButton
                                                    label="Lihat File Transkrip"
                                                    onClick={() => { setModalFile(`/storage/${profile.transcript_file}`); setModalOpen(true); }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </FilePreviewButton>
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
