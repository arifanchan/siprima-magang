/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Heading from '@/components/heading';
import { type BreadcrumbItem } from '@/types';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';

dayjs.locale('id');

export default function MentorActivityDetail() {
  const { activity, student, mentor } = usePage().props as any;

  // Breadcrumbs dan heading pakai nama mahasiswa
  const studentName = student?.user?.name || '-';
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Daftar Bimbingan', href: '/mentor/activities' },
    { title: studentName, href: `/mentor/activities/${activity?.id}` },
  ];

  // Sub Navigation Items
  const subNavItems = [
    { key: 'summary', title: 'Ringkasan', href: `/mentor/activities/${activity?.id}` },
    { key: 'profile', title: 'Profil Mahasiswa', href: `/mentor/activities/${activity?.id}/profile` },
    { key: 'presence', title: 'Presensi', href: `/mentor/activities/${activity?.id}/presence` },
    { key: 'assignments', title: 'Tugas', href: `/mentor/activities/${activity?.id}/assignments` },
    { key: 'logbook', title: 'Logbook', href: `/mentor/activities/${activity?.id}/logbook` },
      { key: 'report', title: 'Laporan', href: `/mentor/activities/${activity?.id}/report` },
    { key: 'final-assessment', title: 'Penilaian Akhir', href: `/mentor/activities/${activity?.id}/final-assessment` },
  ];

  // Data monitoring harian
  const today = dayjs().format('YYYY-MM-DD');
  const isActive = activity?.status === 'aktif' || activity?.status === 'active' || (activity?.start_date && activity?.end_date && today >= activity?.start_date && today <= activity?.end_date);
  const todayPresence = activity?.presences?.find((p: any) => p.date === today);
  const hasCheckedIn = todayPresence?.check_in ? 1 : 0;
  const hasCheckedOut = todayPresence?.check_out ? 1 : 0;
  const hasLogbook = activity?.logbooks?.some((l: any) => l.date === today) ? 1 : 0;
  const totalTugas = activity?.assignments?.length || 0;
  const tugasSelesai = activity?.assignments?.filter((a: any) => a.status === 'selesai').length || 0;

  // Jumlah hari presensi (masuk)
  const hadirCount = Array.isArray(activity?.presences) ? activity.presences.length : 0;
  // Hitung total hari magang (termasuk start_date dan end_date)
  let totalHariMagang = 0;
  if (activity?.start_date && activity?.end_date) {
    const start = dayjs(activity.start_date);
    const end = dayjs(activity.end_date);
    totalHariMagang = end.diff(start, 'day') + 1;
  }
  // Fallback logbook summary if not provided by backend
  let logbookSummary = activity?.logbook_summary;
  if (!logbookSummary && Array.isArray(activity?.logbooks)) {
    logbookSummary = {
      filled_days: activity.logbooks.length,
      total_days: hadirCount
    };
  }

  // Cek apakah periode magang sudah berakhir
  const todayDate = dayjs(today, 'YYYY-MM-DD');
  let isEnded = false;
  if (activity?.status === 'selesai' || activity?.status === 'ended') {
    isEnded = true;
  } else if (activity?.end_date) {
    const endDate = dayjs(activity.end_date, 'YYYY-MM-DD');
    if (todayDate.isAfter(endDate, 'day')) {
      isEnded = true;
    }
  }

  // Modal preview foto profil
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalFile, setModalFile] = React.useState<string|null>(null);
  const [modalTitle, setModalTitle] = React.useState<string|null>(null);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Aktivitas Magang #${activity?.id || ''}`} />
      <div className="px-4 py-6">
        <Heading
          title={`Beranda Kegiatan Magang - ${studentName}`}
          description={`Pantau dan kelola seluruh aktivitas magang mahasiswa bimbingan Anda (${studentName}) di sini.`}
        />
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
          <main className="flex-1 min-w-0">
            {/* Monitoring Harian (Stepper/Progress Hari Ini) dan Aksi Hari Ini */}
            {isEnded ? (
              <Card className="mb-8 p-6 text-center">
                <h2 className="font-semibold text-lg mb-2">Periode magang telah berakhir</h2>
                <p className="text-gray-600">Anda dapat melihat rekap aktivitas dan dokumen akhir di bawah ini.</p>
              </Card>
            ) : (
              <>
                {/* Stepper/Progress Hari Ini */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold border-2 ${hasCheckedIn ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-gray-50'}`}>1</div>
                      <div className="text-xs mt-1">Presensi Masuk</div>
                      <div className="text-xs font-semibold text-green-600">{hasCheckedIn}/1</div>
                    </div>
                    <div className="h-1 w-8 bg-gray-300 md:rotate-0 md:w-8 md:h-1" />
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold border-2 ${tugasSelesai > 0 ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-gray-50'}`}>2</div>
                      <div className="text-xs mt-1">Kerjakan Tugas</div>
                      <div className="text-xs font-semibold text-blue-600">{tugasSelesai}/{totalTugas}</div>
                    </div>
                    <div className="h-1 w-8 bg-gray-300 md:rotate-0 md:w-8 md:h-1" />
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold border-2 ${hasLogbook ? 'border-yellow-500 bg-yellow-100' : 'border-gray-300 bg-gray-50'}`}>3</div>
                      <div className="text-xs mt-1">Isi Logbook</div>
                      <div className="text-xs font-semibold text-yellow-600">{hasLogbook}/1</div>
                    </div>
                    <div className="h-1 w-8 bg-gray-300 md:rotate-0 md:w-8 md:h-1" />
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold border-2 ${hasCheckedOut ? 'border-purple-500 bg-purple-100' : 'border-gray-300 bg-gray-50'}`}>4</div>
                      <div className="text-xs mt-1">Presensi Keluar</div>
                      <div className="text-xs font-semibold text-purple-600">{hasCheckedOut}/1</div>
                    </div>
                  </div>
                </div>
                {/* Aksi Hari Ini */}
                <div className="mb-8 grid gap-4 md:grid-cols-4">
                  <Button asChild disabled={hasCheckedIn} className="w-full">
                    <Link href={`/mentor/activities/${activity.id}/presence`}>{hasCheckedIn ? 'Sudah Presensi Masuk' : 'Presensi Masuk'}</Link>
                  </Button>
                  <Button asChild className="w-full" variant={hasCheckedIn ? 'default' : 'outline'} disabled={!hasCheckedIn}>
                    <Link href={`/mentor/activities/${activity.id}/assignments`}>Lihat & Kerjakan Tugas</Link>
                  </Button>
                  <Button asChild className="w-full" variant={hasCheckedIn ? 'default' : 'outline'} disabled={!hasCheckedIn}>
                    <Link href={`/mentor/activities/${activity.id}/logbook`}>{hasLogbook ? 'Lihat Logbook' : 'Isi Logbook'}</Link>
                  </Button>
                  <Button asChild className="w-full" disabled={!hasCheckedIn || hasCheckedOut}>
                    <Link href={`/mentor/activities/${activity.id}/presence`}>{hasCheckedOut ? 'Sudah Presensi Keluar' : 'Presensi Keluar'}</Link>
                  </Button>
                </div>
              </>
            )}
            {/* Grid bawah: Card Siswa (kiri) dan Ringkasan Aktivitas (kanan) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card Siswa/Mahasiswa identik dengan index.tsx: foto, nama, email, telp, universitas, fakultas, prodi, NIM, warna link dan jarak key-value sejajar */}
              <Card className="flex flex-col md:flex-row gap-6 items-center w-full p-6">
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => { if (student?.profile?.photo_file) { setModalFile(student.profile.photo_file.includes('/') ? `/storage/${student.profile.photo_file.replace(/^storage\//, '')}` : `/storage/users/${student.user?.id}/profile_photos/${student.profile.photo_file}`); setModalTitle(studentName); setModalOpen(true); } }}
                    className="focus:outline-none group relative"
                    style={{ cursor: student?.profile?.photo_file ? 'pointer' : 'default' }}
                    aria-label="Lihat foto profil"
                  >
                    <img
                      src={student?.profile?.photo_file ? (student.profile.photo_file.includes('/') ? `/storage/${student.profile.photo_file.replace(/^storage\//, '')}` : `/storage/users/${student.user?.id}/profile_photos/${student.profile.photo_file}`) : '/default-avatar.png'}
                      alt={studentName}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border shadow"
                    />
                  </button>
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="text-lg font-semibold truncate">{studentName}</div>
                  <div className="grid grid-cols-2 gap-x-1 gap-y-1 text-sm mt-1">
                    <span className="font-semibold text-gray-500 dark:text-gray-300">Email</span>
                    <a href={`mailto:${student?.user?.email}`} className="text-primary underline break-all">{student?.user?.email || '-'}</a>
                    <span className="font-semibold text-gray-500 dark:text-gray-300">Telp</span>
                    <a href={`https://wa.me/${student?.user?.phone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-primary underline">{student?.user?.phone || '-'}</a>
                    <span className="font-semibold text-gray-500 dark:text-gray-300">Universitas</span>
                    <span>{student?.university || '-'}</span>
                    <span className="font-semibold text-gray-500 dark:text-gray-300">Fakultas</span>
                    <span>{student?.faculty || '-'}</span>
                    <span className="font-semibold text-gray-500 dark:text-gray-300">Program Studi</span>
                    <span>{student?.study_program || '-'}</span>
                    <span className="font-semibold text-gray-500 dark:text-gray-300">NIM</span>
                    <span>{student?.student_number || '-'}</span>
                  </div>
                  <div className="mt-2">
                    <Button asChild size="sm" variant="secondary">
                      <Link href={`/mentor/activities/${activity?.id}/profile`}>
                        Lihat Profil Lengkap
                      </Link>
                    </Button>
                  </div>
                </div>
                {/* Modal Preview Foto */}
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                  <DialogContent className="max-w-xs md:max-w-md">
                    <div className="flex flex-col items-center gap-2">
                      <img src={modalFile || ''} alt={modalTitle || ''} className="w-64 h-64 object-cover rounded-lg border" />
                      <div className="font-semibold text-center">{modalTitle}</div>
                      <DialogClose asChild>
                        <Button variant="outline" className="mt-2">Tutup</Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </Card>
              {/* Card Ringkasan Aktivitas */}
              <Card className="p-6 flex flex-col gap-2 h-full justify-center">
                <div className="font-semibold mb-2">Ringkasan Aktivitas</div>
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="font-semibold">Presensi:</span>
                    <span className="font-bold">{hadirCount}/{totalHariMagang}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="font-semibold">Logbook:</span>
                    <span className="font-bold">{logbookSummary?.filled_days ?? 0}/{logbookSummary?.total_days || totalPresensi}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="font-semibold">Tugas:</span>
                    <span className="font-bold">{tugasSelesai}/{totalTugas}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-sm mt-2">
                  {activity?.final_presentation && (
                    <div>
                      <a href={activity.final_presentation} target="_blank" rel="noopener noreferrer" className="text-primary underline">Preview/Download Presentasi Final</a>
                    </div>
                  )}
                  {activity?.final_report && (
                    <div>
                      <a href={activity.final_report} target="_blank" rel="noopener noreferrer" className="text-primary underline">Preview/Download Laporan Akhir</a>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
