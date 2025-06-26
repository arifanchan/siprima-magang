/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function MentorAssignmentCreatePage() {
  const { activity, errors } = usePage().props as any;
  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: '',
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    router.post(`/mentor/activities/${activity.id}/assignments`, {
      title: form.title,
      description: form.description,
      due_date: form.due_date,
    }, {
      onFinish: () => setLoading(false),
    });
  }

  const subNavItems = [
    { key: 'summary', title: 'Ringkasan', href: `/mentor/activities/${activity?.id}` },
    { key: 'profile', title: 'Profil Mahasiswa', href: `/mentor/activities/${activity?.id}/profile` },
    { key: 'presence', title: 'Presensi', href: `/mentor/activities/${activity?.id}/presence` },
    { key: 'logbook', title: 'Logbook', href: `/mentor/activities/${activity?.id}/logbook` },
    { key: 'assignments', title: 'Tugas', href: `/mentor/activities/${activity?.id}/assignments` },
    { key: 'report', title: 'Laporan', href: `/mentor/activities/${activity?.id}/report` },
    { key: 'final-assessment', title: 'Penilaian Akhir', href: `/mentor/activities/${activity?.id}/final-assessment` },
  ];

  if (!activity) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-2">404 Not Found</h2>
          <p className="text-gray-500 mb-4">Data aktivitas magang tidak ditemukan.</p>
          <Button variant="outline" onClick={() => router.visit('/mentor/activities')}>Kembali ke Daftar Bimbingan</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={[
      { title: 'Daftar Bimbingan', href: '/mentor/activities' },
      { title: `Aktivitas #${activity?.id || ''}`, href: `/mentor/activities/${activity?.id}` },
      { title: 'Tugas', href: `/mentor/activities/${activity?.id}/assignments` },
      { title: 'Buat Tugas', href: '#' },
    ]}>
      <Head title="Buat Tugas Baru" />
      <div className="px-4 py-6">
        <Heading title="Buat Tugas Baru" description="Isi form berikut untuk menambah tugas baru bagi mahasiswa." />
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
              {/* Info Mahasiswa dan Tanggal Penugasan */}
              <div className="mb-6 p-4 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Mahasiswa</div>
                  <div className="font-semibold text-lg text-primary-800 dark:text-primary-200">
                    {activity?.internship_application?.student?.user?.name
                      ? activity.internship_application.student.user.name
                      : <span className="italic text-gray-400">(Nama mahasiswa tidak tersedia)</span>}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Tanggal Penugasan</div>
                  <div className="font-semibold text-lg text-primary-800 dark:text-primary-200">
                    {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
              {/* Petunjuk/Instruksi */}
              <div className="mb-6 text-sm text-gray-700 dark:text-gray-200 bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-3 rounded">
                Isi form berikut untuk memberikan tugas kepada mahasiswa. <b>Pastikan deskripsi tugas jelas dan deadline realistis.</b>
              </div>
              {/* Form input tugas */}
              <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                <div>
                  <label className="font-semibold mb-1 block" htmlFor="title">Judul Tugas <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className={`w-full border rounded px-3 py-2 ${errors?.title ? 'border-red-500' : ''}`}
                    value={form.title}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Contoh: Membuat laporan mingguan"
                    aria-required="true"
                    aria-invalid={!!errors?.title}
                  />
                  {errors?.title && <div className="text-red-600 text-xs mt-1">{errors.title}</div>}
                </div>
                <div>
                  <label className="font-semibold mb-1 block" htmlFor="description">Deskripsi <span className="text-red-600">*</span></label>
                  <textarea
                    id="description"
                    name="description"
                    className={`w-full border rounded px-3 py-2 ${errors?.description ? 'border-red-500' : ''}`}
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    required
                    disabled={loading}
                    placeholder="Jelaskan detail tugas, kriteria penilaian, dan output yang diharapkan."
                    aria-required="true"
                    aria-invalid={!!errors?.description}
                  />
                  {errors?.description && <div className="text-red-600 text-xs mt-1">{errors.description}</div>}
                </div>
                <div>
                  <label className="font-semibold mb-1 block" htmlFor="due_date">Deadline <span className="text-red-600">*</span></label>
                  <input
                    type="date"
                    id="due_date"
                    name="due_date"
                    className={`w-full border rounded px-3 py-2 ${errors?.due_date ? 'border-red-500' : ''}`}
                    value={form.due_date}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    aria-required="true"
                    aria-invalid={!!errors?.due_date}
                  />
                  {errors?.due_date && <div className="text-red-600 text-xs mt-1">{errors?.due_date}</div>}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-6">
                  <Button type="submit" size="sm" className="bg-neutral-900 text-white hover:bg-neutral-800" disabled={loading}>Simpan</Button>
                  <div className="flex-1 sm:text-right">
                    <Button type="button" size="sm" variant="outline" onClick={() => router.visit(`/mentor/activities/${activity.id}/assignments`)} disabled={loading}>Batal</Button>
                  </div>
                </div>
              </form>
            </Card>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
