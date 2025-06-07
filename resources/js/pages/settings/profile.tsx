import { useForm, usePage, Head, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

type ProfileForm = {
  gender: string;
  birth_date: string;
  address: string;
  occupation: string;
  identity_number: string;
  photo_file: string;
};

export default function ProfileSettings() {
  const { profile } = usePage().props as any;
  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<ProfileForm>({
    gender: profile?.gender ?? '',
    birth_date: profile?.birth_date ?? '',
    address: profile?.address ?? '',
    occupation: profile?.occupation ?? '',
    identity_number: profile?.identity_number ?? '',
    photo_file: profile?.photo_file ?? '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    patch(route('profile.update'), { preserveScroll: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Profile settings', href: '/settings/profile' }]}>
      <Head title="Profile settings" />
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="Profile information" description="Lengkapi data profil Anda" />
          <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                className="mt-1 block w-full border rounded px-2 py-2"
                value={data.gender}
                onChange={e => setData('gender', e.target.value)}
              >
                <option value="">Select gender</option>
                {genderOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <InputError className="mt-2" message={errors.gender} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="birth_date">Birth Date</Label>
              <Input
                id="birth_date"
                type="date"
                className="mt-1 block w-full"
                value={data.birth_date}
                onChange={e => setData('birth_date', e.target.value)}
              />
              <InputError className="mt-2" message={errors.birth_date} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                className="mt-1 block w-full"
                value={data.address}
                onChange={e => setData('address', e.target.value)}
                placeholder="Address"
              />
              <InputError className="mt-2" message={errors.address} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                className="mt-1 block w-full"
                value={data.occupation}
                onChange={e => setData('occupation', e.target.value)}
                placeholder="Occupation"
              />
              <InputError className="mt-2" message={errors.occupation} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="identity_number">Identity Number</Label>
              <Input
                id="identity_number"
                className="mt-1 block w-full"
                value={data.identity_number}
                onChange={e => setData('identity_number', e.target.value)}
                placeholder="Identity Number"
              />
              <InputError className="mt-2" message={errors.identity_number} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="photo_file">Photo File (URL or filename)</Label>
              <Input
                id="photo_file"
                className="mt-1 block w-full"
                value={data.photo_file}
                onChange={e => setData('photo_file', e.target.value)}
                placeholder="Photo file"
              />
              <InputError className="mt-2" message={errors.photo_file} />
            </div>
            {/* Form DSS disembunyikan */}
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

