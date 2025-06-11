// Halaman detail satu pengajuan magang
import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import dayjs from 'dayjs';
import { useState } from 'react';
import FilePreviewButton from '@/components/ui/file-preview-button';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import Heading from "@/components/heading";

const internshipNavItems = [
  { title: 'Riwayat Pengajuan', key: 'index', href: '/internship-applications' },
  { title: 'Pengajuan Baru', key: 'create', href: '/internship-applications/create' },
];

export default function InternshipApplicationShow({ user, profile, student, application }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFile, setModalFile] = useState<string|null>(null);

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Pengajuan Magang', href: '/internship-applications' },
      { title: 'Detail', href: '#' },
    ]}>
      {/* Modal Preview Dokumen dengan Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl w-full">
          <DialogClose asChild>
            <button className="absolute top-2 right-2 text-xl">&times;</button>
          </DialogClose>
          {modalFile && (modalFile.match(/\.(jpg|jpeg|png)$/i)
            ? <img src={modalFile} alt="Preview Dokumen" className="max-h-[70vh] mx-auto" />
            : <iframe src={modalFile} title="Preview Dokumen" className="w-full min-h-[60vh]" />)}
        </DialogContent>
      </Dialog>
      <div className="px-4 py-6">
          <Heading title="Detail Pengajuan" description="Berikut adalah detail pengajuan magang Anda. Anda dapat melihat informasi lengkap mengenai pengajuan ini." />
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
              <h2 className="font-semibold text-lg mb-4">Detail Pengajuan</h2>
              {!application ? (
                <div className="text-center py-8 text-muted-foreground">Data pengajuan tidak ditemukan.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tanggal Pengajuan</Label>
                    <Input value={application.created_at ? dayjs(application.created_at).format('DD MMMM YYYY') : '-'} readOnly disabled />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Input value={application.status || '-'} readOnly disabled />
                  </div>
                  <div>
                    <Label>Tanggal Mulai</Label>
                    <Input value={application.start_date || '-'} readOnly disabled />
                  </div>
                  <div>
                    <Label>Tanggal Selesai</Label>
                    <Input value={application.end_date || '-'} readOnly disabled />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label>Surat Pengantar</Label>
                    {application.application_letter ? (
                      <FilePreviewButton
                        label={<span className="flex items-center gap-1"><Eye className="w-4 h-4" /> Lihat</span>}
                        onClick={() => {
                          setModalFile(application.application_letter.startsWith('http') ? application.application_letter : `/storage/${application.application_letter}`);
                          setModalOpen(true);
                        }}
                      />
                    ) : (
                      <span className="text-muted-foreground">Belum diupload</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label>CV</Label>
                    {application.cv_file ? (
                      <FilePreviewButton
                        label={<span className="flex items-center gap-1"><Eye className="w-4 h-4" /> Lihat</span>}
                        onClick={() => {
                          setModalFile(application.cv_file.startsWith('http') ? application.cv_file : `/storage/${application.cv_file}`);
                          setModalOpen(true);
                        }}
                      />
                    ) : (
                      <span className="text-muted-foreground">Belum diupload</span>
                    )}
                  </div>
                  <div>
                    <Label>Dokumen Lainnya</Label>
                    {application.other_supporting_documents ? (
                      <ul className="list-disc ml-6 mt-1">
                        {(Array.isArray(application.other_supporting_documents)
                          ? application.other_supporting_documents
                          : JSON.parse(application.other_supporting_documents || '[]'))
                          .map((doc: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2">
                              <FilePreviewButton
                                label={<span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {`Dokumen ${idx + 1}`}</span>}
                                onClick={() => {
                                  setModalFile(doc.startsWith('http') ? doc : `/storage/${doc}`);
                                  setModalOpen(true);
                                }}
                              />
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground">Tidak ada dokumen tambahan</span>
                    )}
                  </div>
                  <div>
                    <Label>Deskripsi</Label>
                    <Input value={application.description || '-'} readOnly disabled />
                  </div>
                  {application.admin_notes && (
                    <div className="md:col-span-2">
                      <Label>Catatan Admin</Label>
                      <Input value={application.admin_notes} readOnly disabled />
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
