import { useForm, usePage, Head } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';

const studentFields = [
  { name: 'student_number', label: 'Student Number' },
  { name: 'study_program', label: 'Study Program' },
  { name: 'faculty', label: 'Faculty' },
  { name: 'university', label: 'University' },
  { name: 'entry_year', label: 'Entry Year' },
  { name: 'bio', label: 'Bio' },
  { name: 'ktp_file', label: 'KTP File' },
  { name: 'ktm_file', label: 'KTM File' },
  { name: 'other_identity_file', label: 'Other Identity File' },
  { name: 'transcript_file', label: 'Transcript File' },
  { name: 'advisor_name', label: 'Advisor Name' },
  { name: 'advisor_phone', label: 'Advisor Phone' },
  // DSS fields (hidden from user form, but available in DB):
  // { name: 'dss_status', label: 'DSS Status' },
  // { name: 'dss_score', label: 'DSS Score' },
  // { name: 'dss_recommendation', label: 'DSS Recommendation' },
  // { name: 'dss_notes', label: 'DSS Notes' },
];

type StudentProfileForm = {
  student_number: string;
  study_program: string;
  faculty: string;
  university: string;
  entry_year: string;
  bio: string;
  ktp_file: string;
  ktm_file: string;
  other_identity_file: string;
  transcript_file: string;
  advisor_name: string;
  advisor_phone: string;
};

export default function StudentProfileSettings() {
  const { student } = usePage().props as any;
  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<StudentProfileForm>({
    student_number: student?.student_number ?? '',
    study_program: student?.study_program ?? '',
    faculty: student?.faculty ?? '',
    university: student?.university ?? '',
    entry_year: student?.entry_year ?? '',
    bio: student?.bio ?? '',
    ktp_file: student?.ktp_file ?? '',
    ktm_file: student?.ktm_file ?? '',
    other_identity_file: student?.other_identity_file ?? '',
    transcript_file: student?.transcript_file ?? '',
    advisor_name: student?.advisor_name ?? '',
    advisor_phone: student?.advisor_phone ?? '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    patch(route('student-profile.update'), { preserveScroll: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Student Profile', href: '/settings/student-profile' }]}>
      <Head title="Student Profile Settings" />
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="Student Profile" description="Lengkapi data mahasiswa Anda" />
          <form onSubmit={submit} className="space-y-6">
            {studentFields.map(field => (
              <div className="grid gap-2" key={field.name}>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  className="mt-1 block w-full"
                  value={data[field.name as keyof StudentProfileForm]}
                  onChange={e => setData(field.name as keyof StudentProfileForm, e.target.value)}
                  placeholder={field.label}
                />
                <InputError className="mt-2" message={errors[field.name]} />
              </div>
            ))}
            <div className="flex items-center gap-4">
              <Button disabled={processing}>Save</Button>
              {recentlySuccessful && <p className="text-sm text-neutral-600">Saved</p>}
            </div>
          </form>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}

