import { useForm, usePage, Head } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';

const mentorFields = [
  { name: 'nip', label: 'NIP' },
  { name: 'division', label: 'Division' },
  { name: 'expertise', label: 'Expertise' },
  { name: 'position', label: 'Position' },
  { name: 'bio', label: 'Bio' },
  // DSS fields (hidden from user form, but available in DB):
  // { name: 'dss_status', label: 'DSS Status' },
  // { name: 'dss_score', label: 'DSS Score' },
  // { name: 'dss_recommendation', label: 'DSS Recommendation' },
  // { name: 'dss_notes', label: 'DSS Notes' },
];

type MentorProfileForm = {
  nip: string;
  division: string;
  expertise: string;
  position: string;
  bio: string;
};

export default function MentorProfileSettings() {
  const { mentor } = usePage().props as any;
  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<MentorProfileForm>({
    nip: mentor?.nip ?? '',
    division: mentor?.division ?? '',
    expertise: mentor?.expertise ?? '',
    position: mentor?.position ?? '',
    bio: mentor?.bio ?? '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    patch(route('mentor-profile.update'), { preserveScroll: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Mentor Profile', href: '/settings/mentor-profile' }]}>
      <Head title="Mentor Profile Settings" />
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="Mentor Profile" description="Lengkapi data mentor Anda" />
          <form onSubmit={submit} className="space-y-6">
            {mentorFields.map(field => (
              <div className="grid gap-2" key={field.name}>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  className="mt-1 block w-full"
                  value={data[field.name as keyof MentorProfileForm]}
                  onChange={e => setData(field.name as keyof MentorProfileForm, e.target.value)}
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

