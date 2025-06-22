import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import React from 'react';
import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { UserCircle, Award, ClipboardCheck, Info } from 'lucide-react';

const breadcrumbs = (activity: any): BreadcrumbItem[] => [
    { title: 'Aktivitas Magang', href: '/internship-activities' },
    { title: `Detail #${activity?.id || ''}`, href: `/internship-activities/${activity?.id}` },
    { title: 'Final Assessment', href: '#' },
];

const subNavItems = (id: number) => [
    { key: 'index', title: 'Daftar Aktivitas', href: '/internship-activities' },
    { key: 'presence', title: 'Presensi', href: `/internship-activities/${id}/presence` },
    { key: 'assignments', title: 'Tugas dari Mentor', href: `/internship-activities/${id}/assignments` },
    { key: 'logbook', title: 'Logbook Harian', href: `/internship-activities/${id}/logbook` },
    { key: 'report', title: 'Laporan Akhir', href: `/internship-activities/${id}/report` },
    { key: 'assessment', title: 'Penilaian & Sertifikat', href: `/internship-activities/${id}/final-assessment` },
];

export default function InternshipFinalAssessmentPage() {
    const { internshipActivity, finalAssessment, auth } = usePage().props as any;
    if (!internshipActivity) {
        return <div className="p-8 text-center text-gray-500">Aktivitas magang tidak ditemukan.</div>;
    }
    const isMentorOrAdmin = auth?.user?.role === 'mentor' || auth?.user?.role === 'admin';
    // Ganti camelCase ke snake_case
    const student = internshipActivity.internship_application?.student;
    const studentUser = student?.user;
    const studentProfile = student?.profile;
    const mentor = internshipActivity.mentor?.user;
    const score = finalAssessment?.final_score ?? null;
    const grade = score !== null ? (score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'E') : '-';
    // Cek status magang selesai dan penilaian
    const isInternshipFinished = internshipActivity?.end_date && new Date(internshipActivity.end_date) <= new Date();
    const isAssessmentGiven = !!finalAssessment;

    return (
        <AppLayout breadcrumbs={breadcrumbs(internshipActivity)}>
            <Head title={`Final Assessment Magang #${internshipActivity.id}`} />
            <div className="px-4 py-6">
                <Heading title="Penilaian Akhir Magang" description="Lihat dan kelola penilaian akhir magang Anda di sini. Penilaian diisi oleh mentor pada akhir periode magang." />
                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    <aside className="w-full max-w-xl lg:w-48 mb-8 lg:mb-0">
                        <nav className="flex flex-col space-y-1 space-x-0">
                            {subNavItems(internshipActivity.id).map((item) => {
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
                    <div className="flex-1 flex flex-col gap-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Card 1: Detail Mahasiswa */}
                            <Card className="p-6 shadow-lg border border-gray-200 bg-white w-full">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><UserCircle className="w-5 h-5" /> Data Mahasiswa</h2>
                                <table className="w-full text-sm text-left border-separate border-spacing-y-2">
                                    <tbody>
                                        <tr>
                                            <td className="font-semibold text-gray-700 w-32">Nama</td>
                                            <td>{studentUser?.name || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold text-gray-700">Email</td>
                                            <td>{studentUser?.email || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold text-gray-700">Universitas</td>
                                            <td>{student?.university || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold text-gray-700">Jurusan</td>
                                            <td>{student?.study_program || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold text-gray-700">Tanggal Mulai</td>
                                            <td>{internshipActivity.start_date || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold text-gray-700">Tanggal Selesai</td>
                                            <td>{internshipActivity.end_date || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold text-gray-700">Mentor</td>
                                            <td>{mentor?.name || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold text-gray-700">Status</td>
                                            <td className="capitalize">{internshipActivity.status}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Card>
                            {/* Card 2: Penilaian */}
                            <Card className="p-6 shadow-lg border border-gray-200 bg-white w-full">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><ClipboardCheck className="w-5 h-5" /> Penilaian Akhir</h2>
                                {isInternshipFinished ? (
                                    isAssessmentGiven ? (
                                        <table className="w-full text-sm border-separate border-spacing-y-2">
                                            <tbody>
                                                <tr><td>Disiplin</td><td>{finalAssessment.discipline ?? '-'}</td></tr>
                                                <tr><td>Tanggung Jawab</td><td>{finalAssessment.responsibility ?? '-'}</td></tr>
                                                <tr><td>Kerja Sama</td><td>{finalAssessment.teamwork ?? '-'}</td></tr>
                                                <tr><td>Inisiatif</td><td>{finalAssessment.initiative ?? '-'}</td></tr>
                                                <tr><td>Komunikasi</td><td>{finalAssessment.communication ?? '-'}</td></tr>
                                                <tr><td>Kemampuan Teknis</td><td>{finalAssessment.technical_skill ?? '-'}</td></tr>
                                                <tr className="bg-blue-50 font-bold"><td>Nilai Akhir</td><td>{finalAssessment.final_score ?? '-'}</td></tr>
                                                <tr><td>Tanggal Penilaian</td><td>{finalAssessment.assessment_date ?? '-'}</td></tr>
                                                {/* Catatan mentor hanya untuk admin/mentor */}
                                                {isMentorOrAdmin && (
                                                    <tr><td>Catatan Mentor</td><td>{finalAssessment.comment || '-'}</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="text-sm text-gray-500 mt-4">Penilaian akhir akan tersedia setelah dinilai oleh mentor.</div>
                                    )
                                ) : (
                                    <div className="text-sm text-gray-500 mt-4">Penilaian akhir akan tersedia setelah periode magang selesai.</div>
                                )}
                            </Card>
                        </div>
                        {/* Card 3: Ucapan & Download Surat/Sertifikat */}
                        {isInternshipFinished && isAssessmentGiven ? (
                            <Card className="p-6 shadow-lg border border-gray-200 bg-white w-full mb-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <Award className="w-6 h-6 text-yellow-500" />
                                    <h2 className="text-lg font-bold">Selamat, {studentUser?.name || 'Peserta'}!</h2>
                                </div>
                                <p className="mb-4">Anda telah menyelesaikan seluruh rangkaian kegiatan magang. Terima kasih atas partisipasi dan kontribusi Anda.</p>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div>
                                        <span className="font-semibold">Surat Keterangan Selesai: </span>
                                        {internshipActivity.completion_letter ? (
                                            <a href={internshipActivity.completion_letter} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download Surat</a>
                                        ) : (
                                            <span className="text-gray-500">Harap tunggu, surat keterangan selesai sedang diproses.</span>
                                        )}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Sertifikat Selesai: </span>
                                        {internshipActivity.completion_certificate ? (
                                            <a href={internshipActivity.completion_certificate} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download Sertifikat</a>
                                        ) : (
                                            <span className="text-gray-500">Harap tunggu, sertifikat selesai sedang diproses.</span>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <Card className="p-6 shadow-lg border border-gray-200 bg-white w-full mb-8">
                                <div className="text-gray-500">Surat keterangan dan sertifikat akan tersedia setelah magang selesai dan penilaian akhir diberikan.</div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
