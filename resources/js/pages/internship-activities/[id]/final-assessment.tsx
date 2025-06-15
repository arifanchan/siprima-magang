import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import React from 'react';

const breadcrumbs = (activity: any): BreadcrumbItem[] => [
    { title: 'Aktivitas Magang', href: '/internship-activities' },
    { title: `Detail #${activity?.id || ''}`, href: `/internship-activities/${activity?.id}` },
    { title: 'Final Assessment', href: '#' },
];

export default function InternshipFinalAssessmentPage() {
    // Ambil data aktivitas dan final assessment dari props Inertia (dummy/mock untuk awal)
    const { internshipActivity, finalAssessment } = usePage().props as any;
    if (!internshipActivity) {
        return <div className="p-8 text-center text-gray-500">Aktivitas magang tidak ditemukan.</div>;
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs(internshipActivity)}>
            <Head title={`Final Assessment Magang #${internshipActivity.id}`} />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold mb-2">Final Assessment Magang</h1>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-900">
                        <div className="font-semibold mb-1">Periode</div>
                        <div>{internshipActivity.start_date} - {internshipActivity.end_date}</div>
                        <div className="font-semibold mt-3 mb-1">Mentor</div>
                        <div>{internshipActivity.mentor_name}</div>
                        <div className="font-semibold mt-3 mb-1">Status</div>
                        <div className="capitalize">{internshipActivity.status}</div>
                    </div>
                    <div className="p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-900">
                        <div className="font-semibold mb-1">Penilaian Akhir</div>
                        {finalAssessment ? (
                            <div className="flex flex-col gap-2">
                                <div>Nilai Akhir: <span className="font-bold">{finalAssessment.score}</span></div>
                                <div>Predikat: <span className="font-bold">{finalAssessment.grade}</span></div>
                                <div>Catatan Mentor: <span>{finalAssessment.mentor_notes || '-'}</span></div>
                                <div>Catatan Admin: <span>{finalAssessment.admin_notes || '-'}</span></div>
                                <div>Feedback: <span>{finalAssessment.feedback || '-'}</span></div>
                                {/* Field DSS hanya untuk admin, sembunyikan dari siswa/mahasiswa */}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">Belum ada penilaian akhir.</div>
                        )}
                    </div>
                </div>
                {/* (Opsional) Tampilkan indikator penilaian */}
                {finalAssessment && finalAssessment.indicators && finalAssessment.indicators.length > 0 && (
                    <div className="mt-6 p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-900">
                        <div className="text-lg font-semibold mb-2">Indikator Penilaian</div>
                        <ul className="list-disc ml-5 text-sm">
                            {finalAssessment.indicators.map((item: any, idx: number) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
