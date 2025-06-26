/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import { type BreadcrumbItem } from '@/types';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { useState, useMemo } from 'react';
import { Download } from 'lucide-react';

dayjs.locale('id');

export default function MentorActivityPresence() {
  // Data presensi akan diambil dari props (Inertia)
  const { activity, presences } = usePage().props as any;

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Daftar Bimbingan', href: '/mentor/activities' },
    { title: `Aktivitas #${activity?.id || ''}`, href: `/mentor/activities/${activity?.id}` },
    { title: 'Presensi', href: `/mentor/activities/${activity?.id}/presence` },
  ];

  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<'date'|'check_in'|'check_out'>('date');
  const [sortAsc, setSortAsc] = useState(true);

  // Sub Navigation Items dari [id].tsx
  const subNavItems = [
    { key: 'summary', title: 'Ringkasan', href: `/mentor/activities/${activity?.id}` },
    { key: 'profile', title: 'Profil Mahasiswa', href: `/mentor/activities/${activity?.id}/profile` },
    { key: 'presence', title: 'Presensi', href: `/mentor/activities/${activity?.id}/presence` },
    { key: 'logbook', title: 'Logbook', href: `/mentor/activities/${activity?.id}/logbook` },
    { key: 'assignments', title: 'Tugas', href: `/mentor/activities/${activity?.id}/assignments` },
    { key: 'report', title: 'Laporan', href: `/mentor/activities/${activity?.id}/report` },
    { key: 'final-assessment', title: 'Penilaian Akhir', href: `/mentor/activities/${activity?.id}/final-assessment` },
  ];

  // Filter, search, and sort presences
  const processedPresences = useMemo(() => {
    if (!presences) return [];
    let data = presences;
    // Search
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((item: any) =>
        dayjs(item.date).format('dddd, D MMMM YYYY').toLowerCase().includes(q) ||
        (item.check_in || '').toLowerCase().includes(q) ||
        (item.check_out || '').toLowerCase().includes(q) ||
        (item.notes || '').toLowerCase().includes(q)
      );
    }
    // Sort
    data = data.sort((a: any, b: any) => {
      if (sortKey === 'date') {
        return sortAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
      } else if (sortKey === 'check_in') {
        return sortAsc ? (a.check_in || '').localeCompare(b.check_in || '') : (b.check_in || '').localeCompare(a.check_in || '');
      } else if (sortKey === 'check_out') {
        return sortAsc ? (a.check_out || '').localeCompare(b.check_out || '') : (b.check_out || '').localeCompare(a.check_out || '');
      }
      return 0;
    });
    // Add status field dynamically
    return data.map((p: any) => ({
      ...p,
      status: p.check_in && p.check_out ? 'Hadir' : (p.notes ? 'Izin' : 'Alpa'),
    }));
  }, [presences, search, sortKey, sortAsc]);

  // Rekap presensi
  const rekap = useMemo(() => {
    const result = { hadir: 0, izin: 0, alpa: 0 };
    processedPresences.forEach((p: any) => {
      if (p.status === 'Hadir') result.hadir++;
      else if (p.status === 'Izin') result.izin++;
      else result.alpa++;
    });
    return result;
  }, [processedPresences]);

  // Export ke CSV
  function exportCSV() {
    const header = ['Tanggal', 'Hari', 'Jam Masuk', 'Jam Keluar', 'Status', 'Catatan'];
    const rows = filteredPresences.map((p: any) => [p.date, p.day, p.check_in, p.check_out, p.status, p.notes]);
    const csv = [header, ...rows].map(r => r.map(x => '"'+(x||'')+'"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `presensi_${activity?.id}_${filterMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Presensi Mahasiswa" />
      <div className="px-4 py-6">
        <Heading title="Presensi Mahasiswa" description="Lihat dan pantau kehadiran mahasiswa pada aktivitas magang ini." />
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
            <div className="mb-6">
              <div className="p-4 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-gray-900 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-base">Rekap Presensi</div>
                  <Button size="sm" variant="outline" onClick={exportCSV} className="flex items-center gap-1"><Download className="w-4 h-4" /> Export CSV</Button>
                </div>
                <div className="text-sm">Rekap: <span className="font-semibold text-green-700">Hadir: {rekap.hadir}</span> | <span className="font-semibold text-yellow-700">Izin: {rekap.izin}</span> | <span className="font-semibold text-red-700">Alpa: {rekap.alpa}</span></div>
              </div>
            </div>
            <div className="mb-2 flex flex-col md:flex-row gap-2 items-center justify-end">
              <input
                type="text"
                placeholder="Cari tanggal, jam, atau catatan..."
                className="border rounded px-3 py-1 text-sm w-full md:w-64"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="mt-2 overflow-x-auto">
              <table className="min-w-full border text-sm bg-white dark:bg-gray-900">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">Hari</th>
                    <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm cursor-pointer" onClick={() => {setSortKey('date');setSortAsc(k=>!k);}}>
                      Tanggal {sortKey==='date' ? (sortAsc ? '▲' : '▼') : ''}
                    </th>
                    <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm cursor-pointer" onClick={() => {setSortKey('check_in');setSortAsc(k=>!k);}}>
                      Presensi Masuk {sortKey==='check_in' ? (sortAsc ? '▲' : '▼') : ''}
                    </th>
                    <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm cursor-pointer" onClick={() => {setSortKey('check_out');setSortAsc(k=>!k);}}>
                      Presensi Keluar {sortKey==='check_out' ? (sortAsc ? '▲' : '▼') : ''}
                    </th>
                    <th className="px-4 py-2 border font-semibold text-gray-700 dark:text-gray-200 text-sm">Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {processedPresences.length ? processedPresences.map((p: any) => {
                    const hari = dayjs(p.date).locale('id').format('dddd');
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                        <td className="px-4 py-2 border capitalize text-gray-900 dark:text-gray-100">{hari}</td>
                        <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">{dayjs(p.date).format('D MMMM YYYY')}</td>
                        <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">{p.check_in || '-'}</td>
                        <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">{p.check_out || '-'}</td>
                        <td className="px-4 py-2 border text-gray-900 dark:text-gray-100">{p.notes || '-'}</td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan={5} className="text-center text-gray-500 py-4">Belum ada data presensi.</td></tr>
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
