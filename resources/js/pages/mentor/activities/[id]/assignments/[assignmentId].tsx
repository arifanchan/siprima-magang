/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');

export default function MentorAssignmentDetailPage() {
  const { activity, assignment, errors, flash } = usePage().props as any;
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    title: assignment.title || '',
    description: assignment.description || '',
    due_date: assignment.due_date || '',
  });
  const [loading, setLoading] = useState(false);

  const subNavItems = [
    { key: 'summary', title: 'Ringkasan', href: `/mentor/activities/${activity?.id}` },
    { key: 'profile', title: 'Profil Mahasiswa', href: `/mentor/activities/${activity?.id}/profile` },
    { key: 'presence', title: 'Presensi', href: `/mentor/activities/${activity?.id}/presence` },
    { key: 'logbook', title: 'Logbook', href: `/mentor/activities/${activity?.id}/logbook` },
    { key: 'assignments', title: 'Tugas', href: `/mentor/activities/${activity?.id}/assignments` },
    { key: 'report', title: 'Laporan', href: `/mentor/activities/${activity?.id}/report` },
    { key: 'final-assessment', title: 'Penilaian Akhir', href: `/mentor/activities/${activity?.id}/final-assessment` },
  ];

  function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    router.put(`/mentor/activities/${activity.id}/assignments/${assignment.id}`, form, {
      onFinish: () => {
        setLoading(false);
        setEditMode(false);
      },
    });
  }

  function handleApprove() {
    setLoading(true);
    router.put(`/mentor/activities/${activity.id}/assignments/${assignment.id}`, {
      title: assignment.title,
      description: assignment.description,
      due_date: assignment.due_date,
      status: 'completed',
    }, {
      onFinish: () => setLoading(false),
    });
  }

  function handleReview() {
    setLoading(true);
    router.put(`/mentor/activities/${activity.id}/assignments/${assignment.id}`, {
      title: assignment.title,
      description: assignment.description,
      due_date: assignment.due_date,
      status: 'reviewed',
    }, {
      onFinish: () => setLoading(false),
    });
  }

  return (
    <AppLayout breadcrumbs={[
      { title: 'Daftar Bimbingan', href: '/mentor/activities' },
      { title: `Aktivitas #${activity?.id || ''}`, href: `/mentor/activities/${activity?.id}` },
      { title: 'Tugas', href: `/mentor/activities/${activity?.id}/assignments` },
      { title: assignment.title, href: '#' },
    ]}>
      <Head title={`Detail Tugas: ${assignment.title}`} />
      <div className="px-4 py-6">
        <Heading title="Detail Tugas" description="Lihat, edit, dan approve tugas mahasiswa." />
        <div className="flex flex-col lg:flex-row lg:space-x-12 mb-8">
          <aside className="w-full max-w-xl lg:w-48 mb-8 lg:mb-0">
            <nav className="flex flex-col space-y-1 space-x-0">
              {subNavItems.map((item) => {
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
          <main className="flex-1">
            <Card className="p-6 mb-8 shadow-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
              {editMode ? (
                <form onSubmit={handleEdit} className="space-y-4">
                  <div>
                    <label className="font-semibold mb-1 block">Judul Tugas</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required disabled={loading} />
                  </div>
                  <div>
                    <label className="font-semibold mb-1 block">Deskripsi</label>
                    <textarea className="w-full border rounded px-3 py-2" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} disabled={loading} />
                  </div>
                  <div>
                    <label className="font-semibold mb-1 block">Deadline</label>
                    <input type="date" className="w-full border rounded px-3 py-2" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} required disabled={loading} />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button type="submit" size="sm" variant="primary" disabled={loading}>Simpan</Button>
                    <Button type="button" size="sm" variant="secondary" onClick={() => setEditMode(false)} disabled={loading}>Batal</Button>
                  </div>
                </form>
              ) : (
                <>
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
                    <div className="font-semibold mb-1 text-primary-700 dark:text-primary-200">Deskripsi Tugas / Feedback Revisi</div>
                    <div className="whitespace-pre-line text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 rounded p-3 border border-gray-100 dark:border-gray-800 shadow-sm">
                      {assignment.description ? assignment.description.replace(/\\n/g, '\n') : '-'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span>Gunakan kolom deskripsi ini untuk memberikan feedback revisi kepada mahasiswa. Mahasiswa akan membaca deskripsi terbaru sebagai instruksi revisi.</span>
                    </div>
                  </div>
                  {assignment.evidence_file && (
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
                  {/* Output dan file hasil mahasiswa */}
                  <div className="mb-6">
                    <div className="font-semibold mb-1 text-primary-700 dark:text-primary-200">Output Mahasiswa</div>
                    <div className="whitespace-pre-line text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 rounded p-3 border border-gray-100 dark:border-gray-800 shadow-sm">
                      {assignment.output ? assignment.output : <span className="italic text-gray-400">Belum ada output</span>}
                    </div>
                  </div>
                  {assignment.student_evidence_file && (
                    <div className="mb-6">
                      <div className="font-semibold mb-1 text-primary-700 dark:text-primary-200">File Hasil Mahasiswa</div>
                      <a
                        href={assignment.student_evidence_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-700 dark:text-primary-300 underline hover:text-primary-900 dark:hover:text-primary-100 font-semibold"
                      >
                        Download File Hasil
                      </a>
                    </div>
                  )}
                  {/* Action buttons: Edit, Approve, Back */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-6">
                    <Button size="sm" variant="secondary" onClick={() => setEditMode(true)}>
                      Edit Tugas
                    </Button>
                    {assignment.status === 'submitted' && (
                      <Button size="sm" variant="warning" onClick={handleReview} disabled={loading}>
                        Review / Minta Revisi
                      </Button>
                    )}
                    {(assignment.status === 'submitted' || assignment.status === 'reviewed') && (
                      <Button size="sm" variant="success" onClick={handleApprove} disabled={loading}>
                        Approve / Tandai Selesai
                      </Button>
                    )}
                    <div className="flex-1 sm:text-right">
                      <Button size="sm" variant="outline" onClick={() => router.visit(`/mentor/activities/${activity?.id}/assignments`)}>
                        Kembali ke Daftar Tugas
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
