import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import Heading from '@/components/heading';

export default function AssignmentDetailPage() {
    const { internshipActivity, assignment } = usePage().props as any;
    const { data, setData, post, processing, errors } = useForm({
        output: assignment.output || '',
    });

    if (!internshipActivity || !assignment) {
        return <div className="p-8 text-center text-gray-500">Tugas tidak ditemukan.</div>;
    }

    const isLate = dayjs().isAfter(dayjs(assignment.due_date), 'day');

    // Sub nav sama seperti halaman lain
    const navItems = [
        { key: 'index', title: 'Daftar Aktivitas', href: '/internship-activities' },
        { key: 'presence', title: 'Presensi', href: `/internship-activities/${internshipActivity.id}/presence` },
        { key: 'logbook', title: 'Logbook Harian', href: `/internship-activities/${internshipActivity.id}/logbook` },
        { key: 'assignments', title: 'Tugas dari Mentor', href: `/internship-activities/${internshipActivity.id}/assignments` },
        { key: 'final-report', title: 'Laporan Akhir', href: `/internship-activities/${internshipActivity.id}/report` },
        { key: 'assessment', title: 'Penilaian & Sertifikat', href: `/internship-activities/${internshipActivity.id}/final-assessment` },
        { key: 'feedback', title: 'Feedback/Notifikasi', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={[
            { title: 'Aktivitas Magang', href: '/internship-activities' },
            { title: `Detail #${internshipActivity.id}`, href: `/internship-activities/${internshipActivity.id}` },
            { title: 'Tugas dari Mentor', href: `/internship-activities/${internshipActivity.id}/assignments` },
            { title: assignment.title, href: '#' },
        ]}>
            <Head title={`Detail Tugas: ${assignment.title}`} />
            <div className="px-4 py-6">
                <Heading title="Detail Tugas" description="Lihat dan kerjakan tugas yang diberikan mentor sesuai instruksi." />
                <div className="flex flex-col lg:flex-row lg:space-x-12 mb-8">
                    <aside className="w-full max-w-xl lg:w-48 mb-8 lg:mb-0">
                        <nav className="flex flex-col space-y-1 space-x-0">
                            {navItems.map((item) => (
                                <Button
                                    key={item.key}
                                    size="sm"
                                    variant={item.key === 'assignments' ? 'secondary' : 'ghost'}
                                    asChild
                                    className={`w-full justify-start ${item.key === 'assignments' ? 'font-bold text-black dark:text-white bg-gray-200 dark:bg-gray-800' : ''}`}
                                >
                                    <Link href={item.href}>{item.title}</Link>
                                </Button>
                            ))}
                        </nav>
                    </aside>
                    <main className="flex-1">
                        <Card className="p-6 mb-8 shadow-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1 text-primary-800 dark:text-primary-200">{assignment.title}</h2>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-300">
                                        <span>Dibuat: <span className="font-semibold text-gray-700 dark:text-gray-100">{dayjs(assignment.created_at).locale('id').format('D MMMM YYYY')}</span></span>
                                        <span>Jatuh Tempo: <span className="font-semibold text-red-600 dark:text-red-400">{dayjs(assignment.due_date).locale('id').format('D MMMM YYYY')}</span></span>
                                    </div>
                                </div>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm border
                                    ${assignment.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                                    ${assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
                                    ${assignment.status === 'late' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                                    ${assignment.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                                    ${assignment.status === 'submitted' ? 'bg-purple-100 text-purple-800 border-purple-200' : ''}
                                    ${assignment.status === 'reviewed' ? 'bg-gray-200 text-gray-800 border-gray-300' : ''}
                                `}>
                                    {assignment.status || '-'}
                                </span>
                            </div>
                            <div className="mb-6">
                                <div className="font-semibold mb-1 text-primary-700 dark:text-primary-200">Deskripsi Tugas</div>
                                <div className="whitespace-pre-line text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 rounded p-3 border border-gray-100 dark:border-gray-800 shadow-sm">
                                    {assignment.description ? assignment.description.replace(/\\n/g, '\n') : '-'}
                                </div>
                            </div>
                            {assignment.evidence_file && assignment.status !== 'in_progress' && (
                                <div className="mb-6">
                                    <div className="font-semibold mb-1 text-primary-700 dark:text-primary-200">Lampiran dari Mentor</div>
                                    <a
                                        href={assignment.evidence_file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-700 dark:text-primary-300 underline hover:text-primary-900 dark:hover:text-primary-100 font-semibold"
                                    >
                                        Download Lampiran
                                    </a>
                                </div>
                            )}
                            <form
                                onSubmit={e => {
                                    e.preventDefault();
                                    if (!isLate && assignment.status === 'in_progress') {
                                        post(`/assignments/${assignment.id}/submit`, { forceFormData: true });
                                    }
                                }}
                                className="space-y-4 mt-4"
                                encType="multipart/form-data"
                            >
                                {/* Output siswa/mahasiswa */}
                                <div>
                                    <div className="font-semibold mb-1">Output (teks):</div>
                                    <textarea
                                        name="output"
                                        className="w-full border rounded px-3 py-2 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900"
                                        value={data.output}
                                        onChange={e => setData('output', e.target.value)}
                                        disabled={assignment.status !== 'in_progress' || isLate}
                                        rows={3}
                                    />
                                    {errors.output && <div className="text-red-600 text-xs mt-1">{errors.output}</div>}
                                </div>
                                {/* Upload hasil tugas (evidence_file) */}
                                <div>
                                    <div className="font-semibold mb-1">Upload Hasil Tugas (file):</div>
                                    <Input
                                        type="file"
                                        name="evidence_file"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip,.rar,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                                        onChange={e => setData('evidence_file', e.target.files?.[0])}
                                        disabled={assignment.status !== 'in_progress' || isLate}
                                    />
                                    {errors.evidence_file && <div className="text-red-600 text-xs mt-1">{errors.evidence_file}</div>}
                                    {/* Jika sudah pernah upload, tampilkan link download */}
                                    {assignment.status === 'in_progress' && assignment.evidence_file && (
                                        <div className="mt-1">
                                            <a
                                                href={assignment.evidence_file}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary-700 dark:text-primary-300 underline hover:text-primary-900 dark:hover:text-primary-100 text-xs"
                                            >
                                                Lihat File Sebelumnya
                                            </a>
                                        </div>
                                    )}
                                </div>
                                {/* Tombol Kerjakan/Simpan */}
                                <div className="flex gap-2 mt-4">
                                    {assignment.status !== 'in_progress' ? (
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => post(`/assignments/${assignment.id}/start`)}
                                            className="bg-black text-white hover:bg-gray-800"
                                            disabled={isLate}
                                        >
                                            Kerjakan
                                        </Button>
                                    ) : (
                                        <Button type="submit" variant="success" disabled={processing || isLate}>
                                            Simpan/Kirim
                                        </Button>
                                    )}
                                    <Button asChild variant="secondary">
                                        <Link href={`/internship-activities/${internshipActivity.id}/assignments`}>
                                            Kembali ke Daftar Tugas
                                        </Link>
                                    </Button>
                                </div>
                                {isLate && (
                                    <div className="text-red-600 text-sm mt-2 font-semibold">Tugas sudah melewati tanggal jatuh tempo. Anda tidak dapat mengerjakan tugas ini.</div>
                                )}
                            </form>
                        </Card>
                    </main>
                </div>
            </div>
        </AppLayout>
    );
}
