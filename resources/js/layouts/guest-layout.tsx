/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import React from 'react';
import { Head } from '@inertiajs/react';

export default function GuestLayout({ children, title }: { children: React.ReactNode; title?: string }) {
    return (
        <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
            <Head title={title || 'SIPRIMA Magang'} />
            <header className="w-full py-4 flex justify-center items-center bg-white dark:bg-gray-900 shadow">
                <img src="/logo.svg" alt="SIPRIMA Magang" className="h-10" />
            </header>
            <main className="flex-1 flex flex-col items-center justify-center px-4">
                {children}
            </main>
            <footer className="w-full py-4 text-center text-xs text-gray-400 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                &copy; {new Date().getFullYear()} SIPRIMA Magang
            </footer>
        </div>
    );
}

