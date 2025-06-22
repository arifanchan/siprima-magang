// Halaman daftar/riwayat pengajuan magang
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Card } from '@/components/ui/card';
import Heading from "@/components/heading";
import dayjs from 'dayjs';

const internshipNavItems = [
  { title: 'Riwayat Pengajuan', key: 'index', href: '/internship-applications' },
  { title: 'Pengajuan Baru', key: 'create', href: '/internship-applications/create' },
];

export default function InternshipApplicationsIndex({ applications = [], user, profile, student }: any) {
  // Jika user belum punya data student, arahkan ke pengisian profil/mahasiswa
  if (!student) {
    return (
      <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Pengajuan Magang', href: '/internship-applications' }]}>
        <div className="px-4 py-6">
            <Heading title="Riwayat Pengajuan" description="Anda belum melengkapi data siswa/mahasiswa. Silakan lengkapi profil Anda terlebih dahulu." />
          <Link href="/profile/student/edit" className="btn btn-primary">Lengkapi Data Siswa/Mahasiswa</Link>
        </div>
      </AppLayout>
    );
  }

  // Jika belum ada pengajuan, arahkan ke halaman create
  if (!applications || applications.length === 0) {
    return (
      <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Pengajuan Magang', href: '/internship-applications' }]}>
        <div className="px-4 py-6">
            <Heading title="Riwayat Pengajuan" description="Belum ada pengajuan magang. Ajukan magang pertama Anda untuk memulai proses magang di kantor kami." />
            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {internshipNavItems.map((item) => {
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
            </div>
        </div>
        </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Pengajuan Magang', href: '/internship-applications' }]}>
      <div className="px-4 py-6">
          <Heading title="Riwayat Pengajuan" description="Berikut adalah daftar pengajuan magang yang telah Anda buat. Anda dapat melihat detail setiap pengajuan atau membuat pengajuan baru." />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
          <aside className="w-full max-w-xl lg:w-48">
            <nav className="flex flex-col space-y-1 space-x-0">
              {internshipNavItems.map((item) => {
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
            <Card className="max-w-2xl mx-auto p-6 mb-8">
              <h2 className="font-semibold text-lg mb-4">Data Siswa/Mahasiswa</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nama</Label>
                  <Input value={user?.name || '-'} readOnly disabled />
                </div>
                <div>
                  <Label>Universitas/Sekolah</Label>
                  <Input value={student?.university || '-'} readOnly disabled />
                </div>
                <div>
                  <Label>Program Studi</Label>
                  <Input value={student?.study_program || '-'} readOnly disabled />
                </div>
                <div>
                  <Label>Fakultas</Label>
                  <Input value={student?.faculty || '-'} readOnly disabled />
                </div>
              </div>
            </Card>
            <Card className="max-w-2xl mx-auto p-6">
              <h2 className="font-semibold text-lg mb-4">Riwayat Pengajuan Magang</h2>
              <div className="overflow-x-auto">
                <table className="table-auto w-full border">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">No</th>
                      <th className="border px-2 py-1">Tanggal Pengajuan</th>
                      <th className="border px-2 py-1">Status</th>
                      <th className="border px-2 py-1">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-4">Belum ada pengajuan magang</td></tr>
                    ) : (
                      applications.map((app: any, i: number) => (
                        <tr key={app.id}>
                          <td className="border px-4 py-2 text-sm text-center">{i+1}</td>
                          <td className="border px-4 py-2 text-sm text-center">{dayjs(app.created_at).format('DD MMMM YYYY')}</td>
                          <td className="px-4 py-2 border capitalize text-sm text-center">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold
                                ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${app.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                                ${app.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                            `}>
                                {app.status}
                            </span>
                          </td>
                          <td className="border px-4 py-2 text-sm text-center">
                            <Link href={`/internship-applications/${app.id}`} className="ttext-primary underline hover:text-primary focus:text-primary transition-colors">Lihat</Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button asChild>
                  <Link href="/internship-applications/create">Ajukan Magang Baru</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
