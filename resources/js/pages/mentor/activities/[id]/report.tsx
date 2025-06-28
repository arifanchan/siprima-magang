/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import React, { useRef } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import FilePreviewButton from '@/components/ui/file-preview-button';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { Eye } from 'lucide-react';

dayjs.locale('id');

const MentorReportPage = () => {
  const { activity, student } = usePage().props as any;
  const formRef = useRef<HTMLFormElement>(null);
  const { data, setData, post, processing, errors } = useForm({
    feedback: activity.feedback || '',
  });
  // Subnav konsisten dengan student
  const subNavItems = [
    { key: 'summary', title: 'Ringkasan', href: `/mentor/activities/${activity?.id}` },
    { key: 'profile', title: 'Profil Mahasiswa', href: `/mentor/activities/${activity?.id}/profile` },
    { key: 'presence', title: 'Presensi', href: `/mentor/activities/${activity?.id}/presence` },
    { key: 'assignments', title: 'Tugas', href: `/mentor/activities/${activity?.id}/assignments` },
    { key: 'logbook', title: 'Logbook', href: `/mentor/activities/${activity?.id}/logbook` },
      { key: 'report', title: 'Laporan', href: `/mentor/activities/${activity?.id}/report` },
    { key: 'final-assessment', title: 'Penilaian Akhir', href: `/mentor/activities/${activity?.id}/final-assessment` },
  ];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('mentor.activities.report.feedback', activity.id), {
      onSuccess: () => {
        if (formRef.current) formRef.current.reset();
      },
    });
  };
  // Helper untuk konversi path file ke URL publik
  const getPublicUrl = (path: string | null) => {
    if (!path) return null;
    return path.startsWith('/storage/') ? path : `/storage/${path}`;
  };
  // State & logic untuk preview modal
  const [previewUrl, setPreviewUrl] = React.useState<string|null>(null);
  const [previewTitle, setPreviewTitle] = React.useState<string>('');
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const handlePreview = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
    setPreviewOpen(true);
  };
  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewUrl(null);
    setPreviewTitle('');
  };
  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Daftar Bimbingan', href: '/mentor/activities' },
      { title: 'Laporan Akhir' }
    ]}>
      <div className="px-4 py-6">
        <Heading title="Laporan Akhir Magang" description="Unggah dan review laporan akhir serta presentasi magang mahasiswa di sini. Berikan feedback/catatan jika diperlukan." />
        <div className="flex flex-col lg:flex-row lg:space-x-8 mb-8">
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
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Card Dokumen Akhir (kiri) */}
              <Card className="p-6 w-full lg:w-1/2 shadow-lg border border-gray-200 bg-white">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">Status Dokumen Akhir</h2>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>
                      <span className="font-semibold">Laporan Akhir:</span> {activity.final_report ? <span className="text-green-600">Sudah diunggah</span> : <span className="text-red-500">Belum diunggah</span>}
                      {activity.final_report && (
                        <a
                          href={getPublicUrl(activity.final_report)}
                          download
                          className="ml-2 text-blue-600 underline text-xs hover:text-blue-800"
                        >
                          Download
                        </a>
                      )}
                    </li>
                    <li>
                      <span className="font-semibold">Presentasi Akhir:</span> {activity.final_presentation ? <span className="text-green-600">Sudah diunggah</span> : <span className="text-red-500">Belum diunggah</span>}
                      {activity.final_presentation && (
                        <a
                          href={getPublicUrl(activity.final_presentation)}
                          download
                          className="ml-2 text-blue-600 underline text-xs hover:text-blue-800"
                        >
                          Download
                        </a>
                      )}
                    </li>
                  </ul>
                  <div className="mt-2 text-xs text-gray-500">Format file: PDF untuk laporan, PDF/PPT untuk presentasi. Maksimal 10MB per file.</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Presentasi */}
                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Presentasi Akhir (PDF/PPT)</label>
                    {activity.final_presentation ? (
                        <div className="mb-2 flex items-center gap-2">
                            <FilePreviewButton
                                label="Lihat Presentasi"
                                onClick={() => {
                                    setPreviewUrl(`/storage/${activity.final_presentation}`);
                                    setPreviewTitle('Presentasi Akhir');
                                }}
                                className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-black focus:ring-2 focus:ring-primary"
                            >
                                <Eye className="w-5 h-5 text-gray-700" />
                            </FilePreviewButton>
                        </div>
                    ) : null}
                  </div>
                  {/* Laporan */}
                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Laporan Akhir (PDF)</label>
                    {activity.final_report ? (
                        <div className="mb-2 flex items-center gap-2">
                            <FilePreviewButton
                                label="Lihat Laporan"
                                onClick={() => {
                                    setPreviewUrl(`/storage/${activity.final_report}`);
                                    setPreviewTitle('Laporan Akhir');
                                }}
                                className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-black focus:ring-2 focus:ring-primary"
                            >
                                <Eye className="w-5 h-5 text-gray-700" />
                            </FilePreviewButton>
                        </div>
                    ) : null}
                  </div>
                </div>
              </Card>
              {/* Card Feedback Mentor (kanan) */}
              <Card className="p-6 w-full lg:w-1/2 shadow-lg border border-gray-200 bg-white">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Feedback / Catatan untuk Mahasiswa</h2>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <textarea
                      id="feedback"
                      className="w-full border rounded p-2 min-h-[80px]"
                      value={data.feedback}
                      onChange={e => setData('feedback', e.target.value)}
                      placeholder="Tulis feedback atau catatan di sini..."
                    />
                    {errors.feedback && <div className="text-red-500 text-sm mt-1">{errors.feedback}</div>}
                  </div>
                  <Button type="submit" disabled={processing} className="mt-2">Simpan Feedback</Button>
                </form>
                {activity.feedback && (
                  <div className="mt-4 text-sm text-gray-700">
                    <span className="font-semibold">Feedback terakhir: </span>
                    <span>{activity.feedback}</span>
                  </div>
                )}
              </Card>
            </div>
            {/* Dialog Preview */}
            <Dialog open={!!previewUrl} onOpenChange={open => !open && setPreviewUrl(null)}>
              <DialogContent className="max-w-3xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-lg">{previewTitle}</div>
                  <DialogClose asChild>
                    <Button size="icon" variant="ghost" className="text-gray-500 hover:text-black">✕</Button>
                  </DialogClose>
                </div>
                {previewUrl && (previewUrl.endsWith('.pdf') ? (
                  <iframe src={previewUrl} className="w-full h-[60vh] border rounded" />
                ) : previewUrl.match(/\.(ppt|pptx)$/i) ? (
                  <iframe
                    src={`https://docs.google.com/gview?url=${window.location.origin}${previewUrl}&embedded=true`}
                    className="w-full h-[60vh] border rounded"
                  />
                ) : (
                  <div className="w-full h-[60vh] flex items-center justify-center bg-gray-50 rounded">
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Buka file di tab baru</a>
                  </div>
                ))}
              </DialogContent>
            </Dialog>
          </main>
        </div>
      </div>
    </AppLayout>
  );
};

export default MentorReportPage;
