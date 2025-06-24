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
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import React, { useRef } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import FilePreviewButton from '@/components/ui/file-preview-button';
import { Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';

dayjs.locale('id');

interface InternshipActivity {
  id: number;
  final_report: string | null;
  final_presentation: string | null;
  feedback: string | null;
}

interface Props {
  internshipActivity: InternshipActivity;
}

const ReportPage: React.FC<Props> = ({ internshipActivity }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { data, setData, post, processing, errors, progress } = useForm({
    final_report: null as File | null,
    final_presentation: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = React.useState<string|null>(null);
  const [previewTitle, setPreviewTitle] = React.useState<string>('');

  // Sub nav items (same as [id].tsx)
  const navItems = [
    { key: 'index', title: 'Daftar Aktivitas', href: '/internship-activities' },
    { key: 'presence', title: 'Presensi', href: `/internship-activities/${internshipActivity.id}/presence` },
      { key: 'assignments', title: 'Tugas dari Mentor', href: `/internship-activities/${internshipActivity.id}/assignments` },
    { key: 'logbook', title: 'Logbook Harian', href: `/internship-activities/${internshipActivity.id}/logbook` },
    { key: 'report', title: 'Laporan Akhir', href: `/internship-activities/${internshipActivity.id}/report` },
    { key: 'assessment', title: 'Penilaian & Sertifikat', href: `/internship-activities/${internshipActivity.id}/final-assessment` },
  ];

  // Ambil data user jika ingin menampilkan info tambahan
  const { auth } = usePage().props as any;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('internship-activities.report.update', internshipActivity.id), {
      forceFormData: true,
      onSuccess: () => {
        if (formRef.current) formRef.current.reset();
      },
    });
  };

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Aktivitas Magang', href: '/internship-activities' },
      { title: `Laporan Akhir` }
    ]}>
      <div className="px-4 py-6">
        <Heading title="Laporan Akhir Magang" description="Unggah dan kelola laporan akhir serta presentasi magang Anda di sini. Pastikan file yang diunggah sudah benar dan sesuai ketentuan." />
        <div className="flex flex-col lg:flex-row lg:space-x-8 mb-8">
          <aside className="w-full max-w-xl lg:w-48 mb-8 lg:mb-0">
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
          <main className="flex-1">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Dokumen Card */}
              <Card className="p-6 w-full lg:w-1/2 shadow-lg border border-gray-200 bg-white">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">Status Dokumen Akhir</h2>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>
                      <span className="font-semibold">Laporan Akhir:</span> {internshipActivity.final_report ? <span className="text-green-600">Sudah diunggah</span> : <span className="text-red-500">Belum diunggah</span>}
                      {internshipActivity.final_report && (
                        <a
                          href={`/storage/${internshipActivity.final_report}`}
                          download
                          className="ml-2 text-blue-600 underline text-xs hover:text-blue-800"
                        >
                          Download
                        </a>
                      )}
                    </li>
                    <li>
                      <span className="font-semibold">Presentasi Akhir:</span> {internshipActivity.final_presentation ? <span className="text-green-600">Sudah diunggah</span> : <span className="text-red-500">Belum diunggah</span>}
                      {internshipActivity.final_presentation && (
                        <a
                          href={`/storage/${internshipActivity.final_presentation}`}
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
                <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Presentasi */}
                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Presentasi Akhir (PDF/PPT)</label>
                    {internshipActivity.final_presentation ? (
                      <div className="mb-2 flex items-center gap-2">
                        <FilePreviewButton
                          label="Lihat Presentasi"
                          onClick={() => {
                            setPreviewUrl(`/storage/${internshipActivity.final_presentation}`);
                            setPreviewTitle('Presentasi Akhir');
                          }}
                          className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-black focus:ring-2 focus:ring-primary"
                        >
                          <Eye className="w-5 h-5 text-gray-700" />
                        </FilePreviewButton>
                      </div>
                    ) : null}
                    <input
                      type="file"
                      accept=".pdf,.ppt,.pptx"
                      onChange={e => setData('final_presentation', e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    {errors.final_presentation && <div className="text-xs text-red-500 mt-1">{errors.final_presentation}</div>}
                  </div>
                  {/* Laporan */}
                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Laporan Akhir (PDF)</label>
                    {internshipActivity.final_report ? (
                      <div className="mb-2 flex items-center gap-2">
                        <FilePreviewButton
                          label="Lihat Laporan"
                          onClick={() => {
                            setPreviewUrl(`/storage/${internshipActivity.final_report}`);
                            setPreviewTitle('Laporan Akhir');
                          }}
                          className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-black focus:ring-2 focus:ring-primary"
                        >
                          <Eye className="w-5 h-5 text-gray-700" />
                        </FilePreviewButton>
                      </div>
                    ) : null}
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={e => setData('final_report', e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    {errors.final_report && <div className="text-xs text-red-500 mt-1">{errors.final_report}</div>}
                  </div>
                  <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
                    <Button type="submit" disabled={processing} className="w-full md:w-auto">{processing ? 'Menyimpan...' : 'Simpan Dokumen'}</Button>
                  </div>
                  {progress && (
                    <div className="col-span-1 md:col-span-2 mt-2 text-xs text-gray-500">Mengunggah: {progress.percentage}%</div>
                  )}
                </form>
              </Card>
              {/* Right: Feedback Card */}
              <Card className="p-6 w-full lg:w-1/2 shadow-lg border border-gray-200 bg-white">
                <div className="mb-4">
                  <div className="font-semibold text-gray-800 mb-1">Feedback Mentor</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-4 min-h-[80px] text-gray-800 whitespace-pre-line text-sm" style={{fontFamily: 'inherit'}}>
                  {internshipActivity.feedback ? internshipActivity.feedback : <span className="text-gray-400 italic">Belum ada feedback dari mentor.</span>}
                </div>
                {internshipActivity.mentor?.user?.name && (
                  <div className="mt-3 text-xs text-gray-500 text-right">{internshipActivity.mentor.user.name}</div>
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

export default ReportPage;
