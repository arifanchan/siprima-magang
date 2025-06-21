import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { Card } from '@/components/ui/card';

export default function LogbookDetailPage() {
    const { logbook, internshipActivity } = usePage().props as any;
    const [form, setForm] = useState({
        activity: logbook?.activity || '',
        description: logbook?.description || '',
        evidence_harian: '',
    });
    const [preview, setPreview] = useState(logbook?.evidence_harian || '');
    const [saving, setSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm({ ...form, evidence_harian: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const data = new FormData();
        data.append('activity', form.activity);
        data.append('description', form.description);
        if (form.evidence_harian) data.append('evidence_harian', form.evidence_harian);
        router.post(`/logbooks/${logbook.id}/update`, data, {
            forceFormData: true,
            onFinish: () => setSaving(false),
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Aktivitas Magang', href: '/internship-activities' },
            { title: `Detail #${internshipActivity?.id || ''}`, href: `/internship-activities/${internshipActivity?.id}` },
            { title: 'Logbook Harian', href: `/internship-activities/${internshipActivity?.id}/logbook` },
            { title: dayjs(logbook.date).locale('id').format('dddd, DD MMMM YYYY'), href: '#' },
        ]}>
            <Head title={`Logbook ${dayjs(logbook.date).locale('id').format('dddd, DD MMMM YYYY')}`} />
            <div className="px-4 py-6 max-w-2xl mx-auto">
                <Heading title={`Logbook ${dayjs(logbook.date).locale('id').format('dddd, DD MMMM YYYY')}`} description="Edit dan lengkapi entry logbook harian Anda." />
                <Card className="mt-6 p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Judul Kegiatan</label>
                            <input type="text" name="activity" value={form.activity} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Deskripsi</label>
                            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Bukti Kegiatan (evidence)</label>
                            <input type="file" name="evidence_harian" accept="image/*,application/pdf" onChange={handleFileChange} className="w-full" />
                            {preview && (
                                <div className="mt-2">
                                    {/\.(jpg|jpeg|png|gif)$/i.test(preview) ? (
                                        <img src={preview} alt="Bukti" className="h-24 max-w-xs object-cover rounded border" />
                                    ) : (
                                        <a href={preview} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Lihat File</a>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <Button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
                            <Button type="button" variant="secondary" asChild>
                                <a href={`/internship-activities/${internshipActivity?.id}/logbook`}>Kembali</a>
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
