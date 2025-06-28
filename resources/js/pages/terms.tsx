/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import React from 'react';
import GuestLayout from '@/layouts/guest-layout';
import { Head } from '@inertiajs/react';

export default function TermsPage() {
    return (
        <GuestLayout title="Syarat & Ketentuan">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-6 mt-8">
                <Head title="Syarat & Ketentuan" />
                <h1 className="text-2xl font-bold mb-4">Syarat & Ketentuan SIPRIMA Magang</h1>
                <ol className="list-decimal ml-6 space-y-2 text-justify">
                    <li>
                        Pengguna wajib memberikan data yang benar, akurat, dan terbaru saat mendaftar dan menggunakan layanan SIPRIMA Magang.
                    </li>
                    <li>
                        Pengguna bertanggung jawab atas keamanan akun dan sandi masing-masing.
                    </li>
                    <li>
                        Dilarang menggunakan aplikasi untuk tujuan yang melanggar hukum, menipu, atau merugikan pihak lain.
                    </li>
                    <li>
                        SIPRIMA Magang berhak mengubah, menambah, atau menghapus fitur dan kebijakan sewaktu-waktu dengan pemberitahuan.
                    </li>
                    <li>
                        Pelanggaran terhadap syarat & ketentuan dapat berakibat pada pembatasan akses, penghapusan akun, atau sanksi lain sesuai kebijakan institusi.
                    </li>
                </ol>
                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                    Dengan menggunakan aplikasi ini, Anda dianggap telah membaca dan menyetujui seluruh syarat & ketentuan yang berlaku.
                </div>
            </div>
        </GuestLayout>
    );
}
