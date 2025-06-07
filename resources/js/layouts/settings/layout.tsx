import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { auth } = usePage().props as any;
    const role = auth?.user?.role;

    const sidebarNavItems: NavItem[] = [
        { title: 'Account', href: '/settings/account', icon: null },
        { title: 'Profile', href: '/settings/profile', icon: null },
        { title: 'Password', href: '/settings/password', icon: null },
        { title: 'Appearance', href: '/settings/appearance', icon: null },
        { title: 'Social Media', href: '/settings/social-media', icon: null },
        ...(role === 'admin' ? [{ title: 'Admin Profile', href: '/settings/admin-profile', icon: null }] : []),
        ...(role === 'mentor' ? [{ title: 'Mentor Profile', href: '/settings/mentor-profile', icon: null }] : []),
        ...(role === 'student' ? [{ title: 'Student Profile', href: '/settings/student-profile', icon: null }] : []),
    ];

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            <Heading title="Settings" description="Manage your account settings" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === item.href,
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
