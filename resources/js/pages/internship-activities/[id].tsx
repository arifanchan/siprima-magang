import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React from 'react';

const internshipNavItems = [
  { key: 'index', title: 'Daftar Aktivitas', href: '/internship-activities' },
  { key: 'presence', title: 'Presensi', href: '#' },
  { key: 'logbook', title: 'Logbook Harian', href: '#' },
  { key: 'assignments', title: 'Tugas dari Mentor', href: '#' },
  { key: 'final-report', title: 'Laporan Akhir', href: '#' },
  { key: 'assessment', title: 'Penilaian & Sertifikat', href: '#' },
  { key: 'feedback', title: 'Feedback/Notifikasi', href: '#' },
];

export default function InternshipActivityDetailPage() {
  const { internshipActivity, today_assignments } = usePage().props as any;
  // UI/UX: Stepper & aksi hari ini
  const today = new Date().toISOString().slice(0, 10);
  const hasCheckedIn = internshipActivity.today_presence?.check_in;
  const hasCheckedOut = internshipActivity.today_presence?.check_out;
  const hasLogbook = internshipActivity.today_logbook;
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
              {internshipNavItems.map((item) => (
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
                <div>{today}</div>
                <div>Presensi Masuk</div>
                <div>{internshipActivity.today_presence?.check_in || '-'}</div>
                <div>Presensi Keluar</div>
                <div>{internshipActivity.today_presence?.check_out || '-'}</div>
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
            <div className="grid md:grid-cols-2 gap-2 mb-6">
              <Card className="p-6">
                <h2 className="font-semibold text-lg mb-4">Periode Magang</h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>Periode</div>
                  <div>{internshipActivity.start_date} - {internshipActivity.end_date}</div>
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


