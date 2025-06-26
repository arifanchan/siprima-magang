/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import React, { useState, useMemo } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');

export default function MentorAssignmentsPage() {
  const { activity, assignments, flash, errors } = usePage().props as any;

  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<'title'|'due_date'|'status'>('due_date');
  const [sortAsc, setSortAsc] = useState(true);

  // Subnav konsisten dengan halaman detail mentor
  const subNavItems = [
    { key: 'summary', title: 'Ringkasan', href: `/mentor/activities/${activity?.id}` },
    { key: 'profile', title: 'Profil Mahasiswa', href: `/mentor/activities/${activity?.id}/profile` },
    { key: 'presence', title: 'Presensi', href: `/mentor/activities/${activity?.id}/presence` },
    { key: 'logbook', title: 'Logbook', href: `/mentor/activities/${activity?.id}/logbook` },
    { key: 'assignments', title: 'Tugas', href: `/mentor/activities/${activity?.id}/assignments` },
    { key: 'report', title: 'Laporan', href: `/mentor/activities/${activity?.id}/report` },
    { key: 'final-assessment', title: 'Penilaian Akhir', href: `/mentor/activities/${activity?.id}/final-assessment` },
  ];

  // Filter, search, and sort assignments
  const processedAssignments = useMemo(() => {
    if (!assignments) return [];
    let data = assignments;
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((a: any) =>
        (a.title || '').toLowerCase().includes(q) ||
        (a.description || '').toLowerCase().includes(q)
      );
    }
    data = data.sort((a: any, b: any) => {
      if (sortKey === 'title') {
        return sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      } else if (sortKey === 'due_date') {
        return sortAsc ? (a.due_date || '').localeCompare(b.due_date || '') : (b.due_date || '').localeCompare(a.due_date || '');
      } else if (sortKey === 'status') {
        return sortAsc ? (a.status || '').localeCompare(b.status || '') : (b.status || '').localeCompare(a.status || '');
      }
      return 0;
    });
    return data;
  }, [assignments, search, sortKey, sortAsc]);

  return (
    <AppLayout breadcrumbs={[
      { title: 'Daftar Bimbingan', href: '/mentor/activities' },
      { title: `Aktivitas #${activity?.id || ''}`, href: `/mentor/activities/${activity?.id}` },
      { title: 'Tugas', href: '#' },
    ]}>
      <Head title="Tugas Mahasiswa" />
      <div className="px-4 py-6">
        <Heading title="Tugas Mahasiswa" description="Kelola dan pantau tugas-tugas yang diberikan kepada mahasiswa." />
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
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <input
                type="text"
                placeholder="Cari judul atau deskripsi tugas..."
                className="border rounded px-3 py-1 text-sm w-full md:w-64"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Button asChild size="sm" variant="primary" className="font-semibold">
                <Link href={`/mentor/activities/${activity?.id}/assignments/create`}>+ Buat Tugas</Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm bg-white dark:bg-gray-900">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">No</th>
                    <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm cursor-pointer" onClick={() => {setSortKey('title');setSortAsc(k=>!k);}}>
                      Judul {sortKey==='title' ? (sortAsc ? '▲' : '▼') : ''}
                    </th>
                    <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">Dibuat</th>
                    <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm cursor-pointer" onClick={() => {setSortKey('due_date');setSortAsc(k=>!k);}}>
                      Jatuh Tempo {sortKey==='due_date' ? (sortAsc ? '▲' : '▼') : ''}
                    </th>
                    <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm cursor-pointer" onClick={() => {setSortKey('status');setSortAsc(k=>!k);}}>
                      Status {sortKey==='status' ? (sortAsc ? '▲' : '▼') : ''}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {processedAssignments.length ? processedAssignments.map((a: any, idx: number) => (
                    <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="px-4 py-2 border text-gray-900 dark:text-gray-100 text-center">{idx + 1}</td>
                      <td className="px-4 py-2 border text-gray-900 dark:text-gray-100 font-semibold">
                        <Link href={`/mentor/activities/${activity?.id}/assignments/${a.id}`} className="hover:underline" as="a" preserveScroll>{a.title}</Link>
                      </td>
                      <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">{a.created_at ? dayjs(a.created_at).format('D MMMM YYYY') : '-'}</td>
                      <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">{a.due_date ? dayjs(a.due_date).format('D MMMM YYYY') : '-'}</td>
                      <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border
                          ${a.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                          ${a.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
                          ${a.status === 'late' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                          ${a.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                          ${a.status === 'submitted' ? 'bg-purple-100 text-purple-800 border-purple-200' : ''}
                          ${a.status === 'reviewed' ? 'bg-gray-200 text-gray-800 border-gray-300' : ''}
                        `}>{a.status || '-'}</span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="text-center text-gray-500 py-4">Belum ada tugas.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
