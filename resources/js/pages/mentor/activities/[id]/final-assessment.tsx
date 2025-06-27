/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle, Award, ClipboardCheck } from 'lucide-react';
import React from 'react';

const subNavItems = (id: number) => [
  { key: 'summary', title: 'Ringkasan', href: `/mentor/activities/${id}` },
  { key: 'profile', title: 'Profil Mahasiswa', href: `/mentor/activities/${id}/profile` },
  { key: 'presence', title: 'Presensi', href: `/mentor/activities/${id}/presence` },
  { key: 'logbook', title: 'Logbook', href: `/mentor/activities/${id}/logbook` },
  { key: 'assignments', title: 'Tugas', href: `/mentor/activities/${id}/assignments` },
  { key: 'report', title: 'Laporan', href: `/mentor/activities/${id}/report` },
  { key: 'final-assessment', title: 'Penilaian Akhir', href: `/mentor/activities/${id}/final-assessment` },
];

export default function MentorFinalAssessmentPage() {
  const { activity, finalAssessment } = usePage().props as any;
  if (!activity) {
    return <div className="p-8 text-center text-gray-500">Aktivitas magang tidak ditemukan.</div>;
  }
  const student = activity.internship_application?.student;
  const studentUser = student?.user;
  const mentor = activity.mentor?.user;
  const score = finalAssessment?.final_score ?? null;
  const grade = score !== null ? (score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'E') : '-';
  const isInternshipFinished = activity?.end_date && new Date(activity.end_date) <= new Date();
  const isAssessmentGiven = !!finalAssessment;

  const [form, setForm] = React.useState({
    discipline: finalAssessment?.discipline ?? '',
    responsibility: finalAssessment?.responsibility ?? '',
    teamwork: finalAssessment?.teamwork ?? '',
    initiative: finalAssessment?.initiative ?? '',
    communication: finalAssessment?.communication ?? '',
    technical_skill: finalAssessment?.technical_skill ?? '',
    comment: finalAssessment?.comment ?? '',
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string|null>(null);
  const [success, setSuccess] = React.useState<string|null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    try {
      const res = await window.fetch(`/mentor/activities/${activity.id}/final-assessment`, {
        method: finalAssessment ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
        },
        body: JSON.stringify(form),
        credentials: 'same-origin',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message || 'Gagal menyimpan penilaian.');
        setSubmitting(false);
        return;
      }
      setSuccess(finalAssessment ? 'Penilaian berhasil diperbarui.' : 'Penilaian berhasil disimpan.');
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      setError('Gagal menyimpan penilaian.');
    } finally {
      setSubmitting(false);
    }
  };

  // Hitung nilai akhir (final_score) seperti di controller
  const finalScore = React.useMemo(() => {
    const fields = [
      Number(form.discipline) || 0,
      Number(form.responsibility) || 0,
      Number(form.teamwork) || 0,
      Number(form.initiative) || 0,
      Number(form.communication) || 0,
      Number(form.technical_skill) || 0,
    ];
    return Math.round(fields.reduce((a, b) => a + b, 0) / fields.length);
  }, [form]);

  return (
    <AppLayout breadcrumbs={[
      { title: 'Daftar Bimbingan', href: '/mentor/activities' },
      { title: `Detail #${activity?.id || ''}`, href: `/mentor/activities/${activity?.id}` },
      { title: 'Final Assessment', href: '#' },
    ]}>
      <Head title={`Final Assessment Magang #${activity.id}`} />
      <div className="px-4 py-2">
        <Heading title="Penilaian Akhir Magang" description="Lihat hasil penilaian akhir magang mahasiswa bimbingan Anda di sini." />
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <aside className="w-full max-w-xl lg:w-48 mb-8 lg:mb-0">
            <nav className="flex flex-col space-y-1 space-x-0">
              {subNavItems(activity.id).map((item) => {
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
                      <td>{activity.start_date || '-'}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700">Tanggal Selesai</td>
                      <td>{activity.end_date || '-'}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700">Mentor</td>
                      <td>{mentor?.name || '-'}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold text-gray-700">Status</td>
                      <td className="capitalize">{activity.status}</td>
                    </tr>
                  </tbody>
                </table>
              </Card>
              {/* Card 2: Penilaian */}
              <Card className="p-6 shadow-lg border border-gray-200 bg-white w-full">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><ClipboardCheck className="w-5 h-5" /> Penilaian Akhir</h2>
                {isInternshipFinished ? (
                  <form onSubmit={handleSubmit} className="space-y-3 text-xs md:text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium mb-1">Disiplin</label>
                        <input type="number" name="discipline" min="0" max="100" value={form.discipline} onChange={handleChange} className="border border-gray-400 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs md:text-sm" required />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Tanggung Jawab</label>
                        <input type="number" name="responsibility" min="0" max="100" value={form.responsibility} onChange={handleChange} className="border border-gray-400 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs md:text-sm" required />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Kerja Sama</label>
                        <input type="number" name="teamwork" min="0" max="100" value={form.teamwork} onChange={handleChange} className="border border-gray-400 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs md:text-sm" required />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Inisiatif</label>
                        <input type="number" name="initiative" min="0" max="100" value={form.initiative} onChange={handleChange} className="border border-gray-400 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs md:text-sm" required />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Komunikasi</label>
                        <input type="number" name="communication" min="0" max="100" value={form.communication} onChange={handleChange} className="border border-gray-400 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs md:text-sm" required />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Kemampuan Teknis</label>
                        <input type="number" name="technical_skill" min="0" max="100" value={form.technical_skill} onChange={handleChange} className="border border-gray-400 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs md:text-sm" required />
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Komentar</label>
                      <textarea name="comment" value={form.comment} onChange={handleChange} className="border border-gray-400 rounded-md px-2 py-1 w-full min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs md:text-sm" />
                    </div>
                    {error && <div className="text-red-500 text-xs">{error}</div>}
                    {success && <div className="text-green-600 text-xs mb-2">{success}</div>}
                    <Button type="submit" className="mt-2" disabled={submitting}>
                      {submitting ? 'Menyimpan...' : finalAssessment ? 'Perbarui Penilaian' : 'Simpan Penilaian'}
                    </Button>
                  </form>
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
                <p className="mb-4">Mahasiswa telah menyelesaikan seluruh rangkaian kegiatan magang. Terima kasih atas bimbingan Anda.</p>
                <div className="flex flex-col md:flex-row gap-4">
                  <div>
                    <span className="font-semibold">Surat Keterangan Selesai: </span>
                    {activity.completion_letter ? (
                      <a href={activity.completion_letter} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download Surat</a>
                    ) : (
                      <span className="text-gray-500">Harap tunggu, surat keterangan selesai sedang diproses.</span>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Sertifikat Selesai: </span>
                    {activity.completion_certificate ? (
                      <a href={activity.completion_certificate} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download Sertifikat</a>
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
