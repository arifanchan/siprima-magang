/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import React from 'react';
import GuestLayout from '@/layouts/guest-layout';
import { Head } from '@inertiajs/react';

export default function LicensePage() {
    return (
        <GuestLayout title="Perjanjian Lisensi">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-6 mt-8">
                <h1 className="text-2xl font-bold mb-4">Perjanjian Lisensi SIPRIMA Magang</h1>
                <ol className="list-decimal ml-6 space-y-2 text-justify">
                    <li>
                        Aplikasi SIPRIMA Magang dikembangkan khusus untuk keperluan administrasi, pelaksanaan, dan evaluasi program magang di lingkungan institusi ini.
                    </li>
                    <li>
                        Seluruh hak cipta dan hak kekayaan intelektual atas aplikasi, kode sumber, desain, dan konten dipegang oleh institusi pengembang.
                    </li>
                    <li>
                        Pengguna hanya diperbolehkan menggunakan aplikasi ini untuk keperluan magang di institusi ini dan dilarang memperbanyak, mendistribusikan, atau memodifikasi aplikasi tanpa izin tertulis dari institusi pengembang.
                    </li>
                    <li>
                        Dilarang menggunakan aplikasi ini untuk tujuan komersial, penjualan, atau penggunaan di luar institusi tanpa persetujuan resmi.
                    </li>
                    <li>
                        Pelanggaran terhadap perjanjian lisensi dapat berakibat pada penghentian akses, tuntutan hukum, atau sanksi lain sesuai peraturan yang berlaku.
                    </li>
                </ol>
                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                    Dengan menggunakan aplikasi ini, Anda dianggap telah membaca dan menyetujui perjanjian lisensi ini.
                </div>
            </div>
        </GuestLayout>
    );
}
