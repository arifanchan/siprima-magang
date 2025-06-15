import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import React, { useState } from 'react';

const breadcrumbs = (activity: any): BreadcrumbItem[] => [
    { title: 'Aktivitas Magang', href: '/internship-activities' },
    { title: `Detail #${activity?.id || ''}`, href: `/internship-activities/${activity?.id}` },
    { title: 'Tugas', href: '#' },
];

export default function InternshipAssignmentsPage() {
    // Ambil data aktivitas dan assignments dari props Inertia (dummy/mock untuk awal)
    const { internshipActivity, assignments } = usePage().props as any;
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: '',
        description: '',
        due_date: '',
        evidence_file: '',
        output: '',
    });

    if (!internshipActivity) {
        return <div className="p-8 text-center text-gray-500">Aktivitas magang tidak ditemukan.</div>;
    }

    // Handler form tugas (dummy, belum terhubung backend)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Integrasi ke backend
        setShowForm(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(internshipActivity)}>
            <Head title={`Tugas Magang #${internshipActivity.id}`} />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold mb-2">Tugas Magang</h1>
                {/* Tombol tambah tugas (hanya untuk mentor/admin, bisa disembunyikan untuk siswa) */}
                {/* <div className="mb-4">
                    <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                        {showForm ? 'Batal' : 'Tambah Tugas'}
                    </button>
                </div> */}
                {/* Form tambah tugas (hanya untuk mentor/admin) */}
                {showForm && (
                    <form onSubmit={handleSubmit} className="mb-4 p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-900 flex flex-col gap-2">
                        <div>
                            <label className="block text-sm font-medium mb-1">Judul Tugas</label>
                            <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Deskripsi</label>
                            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Deadline</label>
                            <input type="date" name="due_date" value={form.due_date} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Simpan</button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition">Batal</button>
                        </div>
                    </form>
                )}
                {/* Tabel tugas */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="px-4 py-2 border">Judul</th>
                                <th className="px-4 py-2 border">Deskripsi</th>
                                <th className="px-4 py-2 border">Deadline</th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border">Bukti</th>
                                <th className="px-4 py-2 border">Output</th>
                                <th className="px-4 py-2 border">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments && assignments.length > 0 ? assignments.map((item: any) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                    <td className="px-4 py-2 border">{item.title}</td>
                                    <td className="px-4 py-2 border">{item.description}</td>
                                    <td className="px-4 py-2 border">{item.due_date}</td>
                                    <td className="px-4 py-2 border capitalize">
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold
                                            ${item.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                                            ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                            ${item.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : ''}
                                            ${item.status === 'submitted' ? 'bg-purple-100 text-purple-800' : ''}
                                            ${item.status === 'reviewed' ? 'bg-indigo-100 text-indigo-800' : ''}
                                        `}>{item.status}</span>
                                    </td>
                                    <td className="px-4 py-2 border">{item.evidence_file ? <a href={item.evidence_file} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Lihat</a> : '-'}</td>
                                    <td className="px-4 py-2 border">{item.output || '-'}</td>
                                    <td className="px-4 py-2 border">
                                        {/* Aksi upload bukti/output tugas */}
                                        <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition">Upload</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={7} className="text-center text-gray-500 py-4">Belum ada data tugas.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

