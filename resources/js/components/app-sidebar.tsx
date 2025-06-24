/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, User as UserIcon } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { props } = usePage();
    const user = props.auth?.user || props.user || {};
    const role = user.role;
    const activeInternshipActivityId = props.activeInternshipActivityId as number | null;

    let mainNavItems: NavItem[] = [];
    if (role === 'mentor') {
        mainNavItems = [
            {
                title: 'Dashboard',
                href: '/mentor/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Profil',
                href: '/mentor/profile',
                icon: UserIcon,
            },
            // Tambahkan menu lain khusus mentor jika perlu
        ];
    } else {
        mainNavItems = [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Profile',
                href: '/profile',
                icon: UserIcon,
            },
            {
                title: 'Pengajuan Magang',
                href: '/internship-applications',
                icon: Folder,
            },
            {
                title: 'Aktivitas Magang',
                href: activeInternshipActivityId ? `/internship-activities/${activeInternshipActivityId}` : '/internship-activities',
                icon: BookOpen,
            },
        ];
    }

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
