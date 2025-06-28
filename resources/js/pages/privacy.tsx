/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import React from 'react';
import GuestLayout from '@/layouts/guest-layout';
import { Head } from '@inertiajs/react';

export default function PrivacyPage() {
    return (
        <GuestLayout title="Kebijakan Privasi">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-6 mt-8">
                <Head title="Kebijakan Privasi" />
                <h1 className="text-2xl font-bold mb-4">Kebijakan Privasi SIPRIMA Magang</h1>
                <ol className="list-decimal ml-6 space-y-2 text-justify">
                    <li>
                        Data pribadi pengguna (nama, email, nomor telepon, dsb) dikumpulkan untuk keperluan administrasi, pelaporan, dan pengelolaan magang.
                    </li>
                    <li>
                        Data hanya akan diakses oleh pihak yang berwenang di institusi dan tidak akan dibagikan ke pihak ketiga tanpa izin, kecuali diwajibkan oleh hukum.
                    </li>
                    <li>
                        Pengguna dapat meminta perubahan atau penghapusan data pribadi dengan menghubungi admin SIPRIMA Magang.
                    </li>
                    <li>
                        Data aktivitas (presensi, logbook, tugas, foto) dapat digunakan untuk evaluasi, pelaporan, dan dokumentasi internal institusi.
                    </li>
                    <li>
                        Aplikasi menggunakan teknologi keamanan untuk melindungi data pengguna dari akses tidak sah.
                    </li>
                </ol>
                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                    Dengan menggunakan aplikasi ini, Anda dianggap telah membaca dan menyetujui kebijakan privasi ini.
                </div>
            </div>
        </GuestLayout>
    );
}
