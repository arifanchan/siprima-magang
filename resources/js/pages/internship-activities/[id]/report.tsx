import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import React, { useState } from 'react';

const breadcrumbs = (activity: any): BreadcrumbItem[] => [
    { title: 'Aktivitas Magang', href: '/internship-activities' },
    { title: `Detail #${activity?.id || ''}`, href: `/internship-activities/${activity?.id}` },
    { title: 'Upload Laporan Akhir', href: '#' },
];

export default function InternshipFinalReportPage() {
    // Ambil data aktivitas dan laporan akhir dari props Inertia (dummy/mock untuk awal)
    const { internshipActivity } = usePage().props as any;
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!internshipActivity) {
        return <div className="p-8 text-center text-gray-500">Aktivitas magang tidak ditemukan.</div>;
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        setSuccess(false);
        setError('');
        // TODO: Integrasi upload ke backend
        setTimeout(() => {
            setUploading(false);
            setSuccess(true);
        }, 1000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(internshipActivity)}>
            <Head title={`Upload Laporan Akhir Magang #${internshipActivity.id}`} />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold mb-2">Upload Laporan Akhir Magang</h1>
                <div className="p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-900 max-w-lg">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">File Laporan Akhir (PDF)</label>
                            <input type="file" accept="application/pdf" onChange={handleFileChange} required className="w-full" />
                        </div>
                        <button type="submit" disabled={uploading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                            {uploading ? 'Mengunggah...' : 'Upload'}
                        </button>
                        {success && <div className="text-green-600 text-sm">Laporan akhir berhasil diupload!</div>}
                        {error && <div className="text-red-600 text-sm">{error}</div>}
                    </form>
                </div>
                {/* Tampilkan file laporan akhir jika sudah ada */}
                {internshipActivity.final_report && (
                    <div className="mt-4 p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-900 max-w-lg">
                        <div className="font-semibold mb-1">Laporan Akhir Saat Ini:</div>
                        <a href={internshipActivity.final_report} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Lihat Laporan Akhir</a>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

