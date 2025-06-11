// Halaman form pengajuan magang baru
import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FilePreviewButton from '@/components/ui/file-preview-button';
import dayjs from 'dayjs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import Heading from "@/components/heading";

const internshipNavItems = [
  { title: 'Riwayat Pengajuan', key: 'index', href: '/internship-applications' },
  { title: 'Pengajuan Baru', key: 'create', href: '/internship-applications/create' },
];

export default function InternshipApplicationsCreate({ user, profile, student }: any) {
  const { data, setData, post, processing, errors } = useForm({
    start_date: '',
    end_date: '',
    letter_file: null as File | null,
    cv_file: null as File | null,
    other_supporting_documents: null as FileList | null,
    description: '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    post('/internship-applications', { forceFormData: true });
  }

  return (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Pengajuan Magang', href: '/internship-applications' }, { title: 'Ajukan', href: '/internship-applications/create' }]}>
      <div className="px-4 py-6">
          <Heading title="Pengajuan Baru" description="Isi form berikut untuk mengajukan magang di perusahaan kami. Pastikan semua data sudah benar dan lengkap." />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
          <aside className="w-full max-w-xl lg:w-48">
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
          <div className="flex-1">
            <Card className="max-w-2xl mx-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Data Siswa/Mahasiswa (readonly) */}
                <div>
                  {/*<h2 className="font-semibold text-lg mb-4">Data Siswa/Mahasiswa</h2>*/}
                  {/*  <h2 className="font-semibold text-lg mb-4">Form Pengajuan Magang</h2>*/}
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
                </div>
                {/* Form Pengajuan Magang */}
                <div>
                  {/*<h2 className="font-semibold text-lg mb-4">Form Pengajuan Magang</h2>*/}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_date">Tanggal Mulai</Label>
                      <Input id="start_date" type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} required />
                      <InputError message={errors.start_date} />
                    </div>
                    <div>
                      <Label htmlFor="end_date">Tanggal Selesai</Label>
                      <Input id="end_date" type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} required />
                      <InputError message={errors.end_date} />
                    </div>
                    <div>
                      <Label htmlFor="letter_file">Surat Pengantar</Label>
                      <Input id="letter_file" type="file" onChange={e => setData('letter_file', e.target.files?.[0] || null)} required />
                      <InputError message={errors.letter_file} />
                    </div>
                    <div>
                      <Label htmlFor="cv_file">CV</Label>
                      <Input id="cv_file" type="file" onChange={e => setData('cv_file', e.target.files?.[0] || null)} />
                      <InputError message={errors.cv_file} />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="other_supporting_documents">Dokumen Lainnya (Sertifikat Keahlian, Penghargaan, dsb)</Label>
                      <Input id="other_supporting_documents" type="file" multiple onChange={e => setData('other_supporting_documents', e.target.files)} />
                      <InputError message={errors.other_supporting_documents} />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Deskripsi</Label>
                      <textarea id="description" className="input input-bordered w-full" value={data.description || ''} onChange={e => setData('description', e.target.value)} />
                      <InputError message={errors.description} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="submit" disabled={processing}>Ajukan</Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/internship-applications">Batal</Link>
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
