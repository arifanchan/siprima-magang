import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');

export default function InternshipActivityDetailPage() {
  const { internshipActivity, today_assignments, presences, today_logbook } = usePage().props as any;
  // UI/UX: Stepper & aksi hari ini
  // Coba ambil todayPresence dari props, jika tidak ada, filter dari presences
  let todayPresence = internshipActivity.today_presence || usePage().props.today_presence || null;
  // Ambil tanggal hari ini dari todayPresence jika ada, jika tidak pakai tanggal hari ini dari browser
  const today = todayPresence?.date || new Date().toISOString().slice(0, 10);
  if (!todayPresence && presences && Array.isArray(presences)) {
    todayPresence = presences.find((p: any) => p.date === today) || null;
  }
  const hasCheckedIn = todayPresence?.check_in;
  const hasCheckedOut = todayPresence?.check_out;
  const hasLogbook = today_logbook;

  // Cek apakah periode magang sudah berakhir
  const isEnded = internshipActivity.end_date && today > internshipActivity.end_date;

  // Generate dynamic nav items with correct hrefs
  const navItems = [
    { key: 'index', title: 'Daftar Aktivitas', href: '/internship-activities' },
    { key: 'presence', title: 'Presensi', href: `/internship-activities/${internshipActivity.id}/presence` },
    { key: 'logbook', title: 'Logbook Harian', href: `/internship-activities/${internshipActivity.id}/logbook` },
    { key: 'assignments', title: 'Tugas dari Mentor', href: `/internship-activities/${internshipActivity.id}/assignments` },
    { key: 'final-report', title: 'Laporan Akhir', href: `/internship-activities/${internshipActivity.id}/report` },
    { key: 'assessment', title: 'Penilaian & Sertifikat', href: `/internship-activities/${internshipActivity.id}/final-assessment` },
    { key: 'feedback', title: 'Feedback/Notifikasi', href: '#' },
  ];

  // DEBUG: tampilkan isi todayPresence
  console.log('todayPresence', todayPresence);

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Aktivitas Magang', href: '/internship-activities' },
      { title: `Detail #${internshipActivity.id}` }
    ]}>
      <div className="px-4 py-6">
        <Heading title="Beranda Kegiatan Magang" description="Pantau dan lakukan aktivitas magang harian Anda di sini." />
        <div className="flex flex-col lg:flex-row lg:space-x-12 mb-8">
          <aside className="w-full max-w-xl lg:w-48 mb-8 lg:mb-0">
            <nav className="flex flex-col space-y-1 space-x-0">
              {navItems.map((item) => (
                <Button
                  key={item.key}
                  size="sm"
                  variant="ghost"
                  asChild
                  className="w-full justify-start"
                >
                  <Link href={item.href}>{item.title}</Link>
                </Button>
              ))}
            </nav>
          </aside>
          <main className="flex-1">
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
                    </div>
                    <div className="h-1 w-8 bg-gray-300 md:rotate-0 md:w-8 md:h-1" />
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold border-2 ${hasCheckedIn ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-gray-50'}`}>2</div>
                      <div className="text-xs mt-1">Kerjakan Tugas</div>
                    </div>
                    <div className="h-1 w-8 bg-gray-300 md:rotate-0 md:w-8 md:h-1" />
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold border-2 ${hasLogbook ? 'border-yellow-500 bg-yellow-100' : 'border-gray-300 bg-gray-50'}`}>3</div>
                      <div className="text-xs mt-1">Isi Logbook</div>
                    </div>
                    <div className="h-1 w-8 bg-gray-300 md:rotate-0 md:w-8 md:h-1" />
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold border-2 ${hasCheckedOut ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-gray-50'}`}>4</div>
                      <div className="text-xs mt-1">Presensi Keluar</div>
                    </div>
                  </div>
                </div>
                {/* Aksi Hari Ini */}
                <div className="mb-8 grid gap-4 md:grid-cols-4">
                  <Button asChild disabled={hasCheckedIn} className="w-full">
                    <Link href={`/internship-activities/${internshipActivity.id}/presence`}>{hasCheckedIn ? 'Sudah Presensi Masuk' : 'Presensi Masuk'}</Link>
                  </Button>
                  <Button asChild className="w-full" variant={hasCheckedIn ? 'default' : 'outline'} disabled={!hasCheckedIn}>
                    <Link href={`/internship-activities/${internshipActivity.id}/assignments`}>Lihat & Kerjakan Tugas</Link>
                  </Button>
                  <Button asChild className="w-full" variant={hasCheckedIn ? 'default' : 'outline'} disabled={!hasCheckedIn}>
                    <Link href={`/internship-activities/${internshipActivity.id}/logbook`}>{hasLogbook ? 'Lihat Logbook' : 'Isi Logbook'}</Link>
                  </Button>
                  <Button asChild className="w-full" disabled={!hasCheckedIn || hasCheckedOut}>
                    <Link href={`/internship-activities/${internshipActivity.id}/presence`}>{hasCheckedOut ? 'Sudah Presensi Keluar' : 'Presensi Keluar'}</Link>
                  </Button>
                </div>
                {/* Ringkasan Aktivitas Hari Ini */}
                <Card className="mb-8 p-6">
                  <h2 className="font-semibold text-lg mb-4">Ringkasan Aktivitas Hari Ini</h2>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>Tanggal</div>
                    <div>{today ? dayjs(today).format('DD MMMM YYYY') : '-'}</div>
                    <div>Presensi Masuk</div>
                    <div>{todayPresence?.check_in || '-'}</div>
                    <div>Presensi Keluar</div>
                    <div>{todayPresence?.check_out || '-'}</div>
                    <div>Tugas</div>
                    <div>
                      {today_assignments && today_assignments.length > 0
                        ? `${today_assignments.filter((t:any) => t.status === 'completed').length}/${today_assignments.length}`
                        : '0/0'}
                    </div>
                    <div>Logbook</div>
                    <div>{hasLogbook ? 'Sudah diisi' : 'Belum diisi'}</div>
                  </div>
                </Card>
              </>
            )}
            {/* Rekap Aktivitas dan Dokumen Akhir */}
            <div className="grid md:grid-cols-2 gap-2 mb-6">
              <Card className="p-6">
                <h2 className="font-semibold text-lg mb-4">Periode Magang</h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>Tanggal Mulai</div>
                  <div>{internshipActivity.start_date ? dayjs(internshipActivity.start_date).format('DD MMMM YYYY') : '-'}</div>
                  <div>Tanggal Selesai</div>
                  <div>{internshipActivity.end_date ? dayjs(internshipActivity.end_date).format('DD MMMM YYYY') : '-'}</div>
                  <div>Mentor</div>
                  <div>{internshipActivity.mentor_name || internshipActivity.mentor?.user?.name || 'Belum Ditentukan'}</div>
                  <div>Status</div>
                  <div className="capitalize">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold
                      ${internshipActivity.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      ${internshipActivity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${internshipActivity.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                      ${internshipActivity.status === 'canceled' ? 'bg-red-100 text-red-800' : ''}
                    `}>{internshipActivity.status}</span>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <h2 className="font-semibold text-lg mb-4">Dokumen</h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>Presentasi Akhir</div>
                  <div>{internshipActivity.final_presentation ? <a href={internshipActivity.final_presentation} target="_blank" rel="noopener noreferrer" className="text-blue-500">Lihat</a> : 'Belum diunggah'}</div>
                  <div>Laporan Akhir</div>
                  <div>{internshipActivity.final_report ? <a href={internshipActivity.final_report} target="_blank" rel="noopener noreferrer" className="text-blue-500">Lihat</a> : 'Belum diunggah'}</div>
                  <div>Surat Keterangan</div>
                  <div>{internshipActivity.completion_letter ? <a href={internshipActivity.completion_letter} target="_blank" rel="noopener noreferrer" className="text-blue-500">Lihat</a> : 'Belum diunggah'}</div>
                  <div>Sertifikat</div>
                  <div>{internshipActivity.completion_certificate ? <a href={internshipActivity.completion_certificate} target="_blank" rel="noopener noreferrer" className="text-blue-500">Lihat</a> : 'Belum diunggah'}</div>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
