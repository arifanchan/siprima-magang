import { useForm, usePage, Head } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';

const socialFields = [
  { name: 'instagram', label: 'Instagram' },
  { name: 'facebook', label: 'Facebook' },
  { name: 'x', label: 'X (Twitter)' },
  { name: 'youtube', label: 'YouTube' },
  { name: 'linkedin', label: 'LinkedIn' },
  { name: 'tiktok', label: 'TikTok' },
  { name: 'thread', label: 'Thread' },
];

type SocialMediaForm = {
  instagram: string;
  facebook: string;
  x: string;
  youtube: string;
  linkedin: string;
  tiktok: string;
  thread: string;
};

export default function SocialMediaSettings() {
  const { mediaSosial } = usePage().props as any;
  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<SocialMediaForm>({
    instagram: mediaSosial?.instagram ?? '',
    facebook: mediaSosial?.facebook ?? '',
    x: mediaSosial?.x ?? '',
    youtube: mediaSosial?.youtube ?? '',
    linkedin: mediaSosial?.linkedin ?? '',
    tiktok: mediaSosial?.tiktok ?? '',
    thread: mediaSosial?.thread ?? '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    patch(route('media-sosial.update'), { preserveScroll: true });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Social Media', href: '/settings/social-media' }]}>
      <Head title="Social Media Settings" />
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="Social Media" description="Kelola tautan media sosial Anda" />
          <form onSubmit={submit} className="space-y-6">
            {socialFields.map(field => (
              <div className="grid gap-2" key={field.name}>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  className="mt-1 block w-full"
                  value={data[field.name as keyof SocialMediaForm]}
                  onChange={e => setData(field.name as keyof SocialMediaForm, e.target.value)}
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

