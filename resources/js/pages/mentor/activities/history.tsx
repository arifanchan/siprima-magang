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

export default function MentorActivitiesHistory() {
  const { activities } = usePage().props as any;

  const navItems = [
    { key: 'active', title: 'Daftar Bimbingan Aktif', href: '/mentor/activities' },
    { key: 'history', title: 'Riwayat Bimbingan', href: '/mentor/activities/history' },
  ];
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Daftar Bimbingan', href: '/mentor/activities' },
    { title: 'Riwayat Bimbingan', href: '/mentor/activities/history' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Riwayat Bimbingan Magang" />
      <div className="px-4 py-6">
        <Heading title="Riwayat Bimbingan Magang" description="Lihat seluruh riwayat kegiatan magang yang telah Anda bimbing." />
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
              <div className="w-full overflow-x-auto">
                {activities && activities.length > 0 ? (
                  <table className="min-w-[700px] w-full text-sm border rounded-lg overflow-hidden bg-white dark:bg-neutral-900">
                    <thead className="bg-neutral-100 dark:bg-neutral-800">
                      <tr>
                        <th className="py-3 px-4 text-left font-semibold">No</th>
                        <th className="py-3 px-4 text-left font-semibold">Nama Mahasiswa</th>
                        <th className="py-3 px-4 text-left font-semibold">Periode</th>
                        <th className="py-3 px-4 text-left font-semibold">Status</th>
                        <th className="py-3 px-4 text-left font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((activity: any, idx: number) => {
                        const student = activity.internshipApplication?.student;
                        const studentObj = Array.isArray(student) ? student[0] : student;
                        const user = studentObj?.user || {};
                        const startDate = activity.start_date ? activity.start_date : '-';
                        const endDate = activity.end_date ? activity.end_date : '-';
                        return (
                          <tr key={activity.id} className="border-b last:border-b-0 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition">
                            <td className="py-2 px-4">{idx + 1}</td>
                            <td className="py-2 px-4">{user?.name || '-'}</td>
                            <td className="py-2 px-4">{startDate} s/d {endDate}</td>
                            <td className="py-2 px-4 capitalize">{activity.status}</td>
                            <td className="py-2 px-4">
                              <Link href={`/mentor/activities/${activity.id}`}>
                                <Button size="sm" variant="outline">Lihat Detail</Button>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-gray-500">Belum ada riwayat bimbingan magang.</div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
