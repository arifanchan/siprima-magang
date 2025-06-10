import { Head, Link } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import Heading from '@/components/heading';
import { useState } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';

const profileNavItems = [
    { title: 'Edit Data Pribadi', key: 'personal', href: '/profile/edit' },
    { title: 'Edit Data Siswa/Mahasiswa', key: 'student', href: '/profile/student/edit' },
    { title: 'Edit Media Sosial', key: 'medsos', href: '/profile/medsos/edit' },
    { title: 'Edit Dokumen', key: 'documents', href: '/profile/documents/edit' },
];

export default function ProfileShow({ user, profile, student, mediaSosial, documents }: any) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalFile, setModalFile] = useState<string|null>(null);
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Profile', href: '/profile' },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
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
                <Heading title="Profile" description="Lihat dan kelola data profil Anda untuk keperluan magang." />
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                    <aside className="w-full max-w-xl lg:w-48">
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
                        <section className="w-full space-y-8">
                            <div className="flex flex-col md:flex-row gap-8 w-full">
                                {/* Data Pribadi */}
                                <Card className="flex-1 p-6 min-w-0 w-full">
                                    <h2 className="font-semibold text-lg mb-4">Data Pribadi</h2>
                                    <div className="flex items-center gap-4 mb-4">
                                        <img
                                            src={profile?.photo_file ? `/storage/${profile.photo_file}` : '/default-avatar.png'}
                                            alt="Foto Profil"
                                            className="w-20 h-20 rounded-full object-cover border"
                                        />
                                        <div>
                                            <div className="text-lg font-semibold">{user.name}</div>
                                            <div className="text-sm text-muted-foreground">{user.email || '-'}</div>
                                            <div className="text-sm text-muted-foreground">{user.phone || '-'}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                        <div>Jenis Kelamin</div>
                                        <div>{profile?.gender === 'male' ? 'Laki-laki' : profile?.gender === 'female' ? 'Perempuan' : '-'}</div>
                                        <div>Tanggal Lahir</div>
                                        <div>{profile?.birth_date || '-'}</div>
                                        <div>Alamat</div>
                                        <div>{profile?.address || '-'}</div>
                                        <div>Pekerjaan</div>
                                        <div>{profile?.occupation || '-'}</div>
                                        <div>NIK</div>
                                        <div>{profile?.identity_number || '-'}</div>
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
                                    </div>
                                </Card>
                            </div>
                            <div className="flex flex-col md:flex-row gap-8 w-full">
                                {/* Data Media Sosial */}
                                <Card className="flex-1 p-6 min-w-0 w-full">
                                    <h2 className="font-semibold text-lg mb-4">Media Sosial</h2>
                                    <div className="flex flex-col gap-y-2 text-sm">
                                        <div className="flex gap-2"><span className="font-medium">Instagram:</span> <span className="truncate max-w-xs">{mediaSosial?.instagram || '-'}</span></div>
                                        <div className="flex gap-2"><span className="font-medium">Facebook:</span> <span className="truncate max-w-xs">{mediaSosial?.facebook || '-'}</span></div>
                                        <div className="flex gap-2"><span className="font-medium">X (Twitter):</span> <span className="truncate max-w-xs">{mediaSosial?.x || '-'}</span></div>
                                        <div className="flex gap-2"><span className="font-medium">YouTube:</span> <span className="truncate max-w-xs">{mediaSosial?.youtube || '-'}</span></div>
                                        <div className="flex gap-2"><span className="font-medium">LinkedIn:</span> <span className="truncate max-w-xs">{mediaSosial?.linkedin || '-'}</span></div>
                                        <div className="flex gap-2"><span className="font-medium">TikTok:</span> <span className="truncate max-w-xs">{mediaSosial?.tiktok || '-'}</span></div>
                                        <div className="flex gap-2"><span className="font-medium">Thread:</span> <span className="truncate max-w-xs">{mediaSosial?.thread || '-'}</span></div>
                                    </div>
                                </Card>
                                {/* Dokumen */}
                                <Card className="flex-1 p-6 min-w-0 w-full">
                                    <h2 className="font-semibold text-lg mb-4">Dokumen</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                        <div className="flex gap-2 items-center">
                                            <span>KTP:</span>
                                            {student?.ktp_file ? (
                                                <button type="button" className="text-blue-600 underline" onClick={() => { setModalFile(`/storage/${student.ktp_file}`); setModalOpen(true); }}>
                                                    Lihat
                                                </button>
                                            ) : (
                                                <span className="text-muted-foreground">(belum diupload)</span>
                                            )}
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <span>KTM/Kartu Siswa:</span>
                                            {student?.ktm_or_student_card_file ? (
                                                <button type="button" className="text-blue-600 underline" onClick={() => { setModalFile(`/storage/${student.ktm_or_student_card_file}`); setModalOpen(true); }}>
                                                    Lihat
                                                </button>
                                            ) : (
                                                <span className="text-muted-foreground">(belum diupload)</span>
                                            )}
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <span>Transkrip:</span>
                                            {student?.transcript_file ? (
                                                <button type="button" className="text-blue-600 underline" onClick={() => { setModalFile(`/storage/${student.transcript_file}`); setModalOpen(true); }}>
                                                    Lihat
                                                </button>
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
            </div>
        </AppLayout>
    );
}
