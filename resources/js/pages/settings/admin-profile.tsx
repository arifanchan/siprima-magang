import { useForm, usePage, Head } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';

const adminFields = [
  { name: 'nip', label: 'NIP' },
  { name: 'division', label: 'Division' },
  { name: 'position', label: 'Position' },
  { name: 'bio', label: 'Bio' },
];

type AdminProfileForm = {
  nip: string;
  division: string;
  position: string;
  bio: string;
};

export default function AdminProfileSettings() {
  const { admin } = usePage().props as any;
  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<AdminProfileForm>({
    nip: admin?.nip ?? '',
    division: admin?.division ?? '',
    position: admin?.position ?? '',
    bio: admin?.bio ?? '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    patch(route('admin-profile.update'), { preserveScroll: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Admin Profile', href: '/settings/admin-profile' }]}>
      <Head title="Admin Profile Settings" />
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="Admin Profile" description="Lengkapi data admin Anda" />
          <form onSubmit={submit} className="space-y-6">
            {adminFields.map(field => (
              <div className="grid gap-2" key={field.name}>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  className="mt-1 block w-full"
                  value={data[field.name as keyof AdminProfileForm]}
                  onChange={e => setData(field.name as keyof AdminProfileForm, e.target.value)}
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

