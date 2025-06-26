/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import { type BreadcrumbItem } from '@/types';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';

dayjs.locale('id');

export default function MentorActivitiesIndex() {
  const { activities } = usePage().props as any;

  console.log('activities', activities);

  const navItems = [
    { key: 'active', title: 'Daftar Bimbingan Aktif', href: '/mentor/activities' },
    { key: 'history', title: 'Riwayat Bimbingan', href: '/mentor/activities/history' },
  ];
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Daftar Bimbingan', href: '/mentor/activities' },
  ];

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalFile, setModalFile] = React.useState<string|null>(null);
  const [modalTitle, setModalTitle] = React.useState<string|null>(null);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Daftar Bimbingan Magang" />
      <div className="px-4 py-6">
        <Heading title="Daftar Bimbingan Magang" description="Pantau seluruh riwayat dan status kegiatan magang yang Anda bimbing di sini. Klik detail untuk memantau presensi, logbook, tugas, dan penilaian mahasiswa." />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
          <aside className="w-full max-w-xl lg:w-48">
            <nav className="flex flex-col space-y-1 space-x-0">
              {navItems.map((item) => {
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
          <div className="flex-1">
            <section className="w-full space-y-8">
              <div className="flex flex-col md:flex-row gap-8 w-full">
                {activities.map((activity: any) => {
                  // Perbaikan scope variabel
                  const student = activity.internshipApplication?.student;
                  const studentObj = Array.isArray(student) ? student[0] : student;
                  const user = studentObj?.user || {};
                  const profile = studentObj?.profile || {};
                  const university = studentObj?.university || '-';
                  const faculty = studentObj?.faculty || '-';
                  const studyProgram = studentObj?.study_program || '-';
                  const startDate = activity.start_date ? dayjs(activity.start_date).format('D MMMM YYYY') : '-';
                  const endDate = activity.end_date ? dayjs(activity.end_date).format('D MMMM YYYY') : '-';
                  const today = dayjs();
                  const start = activity.start_date ? dayjs(activity.start_date) : null;
                  const end = activity.end_date ? dayjs(activity.end_date) : null;
                  let daysElapsed = '-';
                  if (start && today.isAfter(start)) {
                    daysElapsed = (today.diff(start, 'day') + 1).toString();
                    if (end && today.isAfter(end)) {
                      daysElapsed = (end.diff(start, 'day') + 1).toString();
                    }
                  }
                  const photoFile = profile?.photo_file;
                  const photoUrl = photoFile
                    ? (photoFile.includes('/') ? `/storage/${photoFile.replace(/^storage\//, '')}` : `/storage/users/${user?.id}/profile_photos/${photoFile}`)
                    : null;
                  return (
                    <Card key={activity.id} className="flex-1 p-6 min-w-0 w-full">
                      <div className="flex items-center gap-4 mb-4">
                        {photoUrl ? (
                          <button
                            type="button"
                            onClick={() => { setModalFile(photoUrl); setModalTitle(user?.name || 'Foto Profil'); setModalOpen(true); }}
                            className="focus:outline-none group relative"
                            style={{ cursor: photoUrl ? 'pointer' : 'default' }}
                            aria-label="Lihat foto profil"
                          >
                            <img
                              src={photoUrl || '/default-avatar.png'}
                              alt={user?.name || 'Foto Profil'}
                              className="w-20 h-20 rounded-full object-cover border shadow hover:brightness-90 transition group-hover:ring-2 group-hover:ring-primary"
                            />
                            {photoUrl && (
                              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-border">
                                Klik untuk preview
                              </span>
                            )}
                          </button>
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 border">
                            <span className="text-xl">?</span>
                          </div>
                        )}
                        <div>
                          <div className="text-lg font-semibold">{user?.name}</div>
                            <div className="text-sm text-muted-foreground">
                                {user.email ? (
                                    <a href={`mailto:${user.email}`} className="text-primary underline hover:text-primary">{user.email}</a>
                                ) : '-'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {user.phone ? (
                                    <a href={`https://wa.me/${user.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary">
                                        {user.phone}
                                    </a>
                                ) : '-'}
                            </div>
                        </div>
                      </div>
                      <div className="w-full overflow-x-auto">
                        <table className="min-w-[340px] w-full text-sm text-gray-700">
                          <tbody>
                            <tr>
                              <td className="py-1 pr-2 font-medium whitespace-nowrap">Universitas</td>
                              <td className="py-1">{university}</td>
                            </tr>
                            <tr>
                              <td className="py-1 pr-2 font-medium whitespace-nowrap">Fakultas</td>
                              <td className="py-1">{faculty}</td>
                            </tr>
                            <tr>
                              <td className="py-1 pr-2 font-medium whitespace-nowrap">Program Studi</td>
                              <td className="py-1">{studyProgram}</td>
                            </tr>
                            <tr>
                              <td className="py-1 pr-2 font-medium whitespace-nowrap">Tanggal Mulai</td>
                              <td className="py-1">{startDate}</td>
                            </tr>
                            <tr>
                              <td className="py-1 pr-2 font-medium whitespace-nowrap">Tanggal Selesai</td>
                              <td className="py-1">{endDate}</td>
                            </tr>
                            <tr>
                              <td className="py-1 pr-2 font-medium whitespace-nowrap">Hari Berjalan</td>
                              <td className="py-1">{daysElapsed} hari</td>
                            </tr>
                            <tr>
                              <td className="py-1 pr-2 font-medium whitespace-nowrap">Status</td>
                              <td className="py-1">{activity.status}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="flex justify-end mt-2">
                        <Link href={`/mentor/activities/${activity.id}`}>
                          <Button size="sm">Lihat Detail</Button>
                        </Link>
                      </div>
                      {/* Modal preview foto konsisten dengan /mentor/profile.tsx */}
                      {modalOpen && modalFile === photoUrl && (
                        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                          <DialogContent className="max-w-2xl w-full">
                            <DialogClose asChild>
                              <button className="absolute top-2 right-2 text-xl">&times;</button>
                            </DialogClose>
                            <img
                              src={modalFile || undefined}
                              alt={modalTitle || 'Foto Profil'}
                              className="max-h-[70vh] mx-auto rounded-lg object-cover border mb-2"
                            />
                            <div className="text-center text-sm font-medium">{modalTitle}</div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </Card>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
