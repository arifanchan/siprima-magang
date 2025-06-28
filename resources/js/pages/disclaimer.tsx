/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import React from 'react';
import GuestLayout from '@/layouts/guest-layout';
import { Head } from '@inertiajs/react';

export default function DisclaimerPage() {
    return (
        <GuestLayout title="Disclaimer">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-6 mt-8">
                <h1 className="text-2xl font-bold mb-4">Disclaimer SIPRIMA Magang</h1>
                <ol className="list-decimal ml-6 space-y-2 text-justify">
                    <li>
                        Informasi dan data yang ditampilkan dalam aplikasi SIPRIMA Magang disediakan apa adanya dan untuk tujuan administrasi serta edukasi.
                    </li>
                    <li>
                        Institusi pengembang tidak bertanggung jawab atas kerugian atau kerusakan yang timbul akibat penggunaan aplikasi ini di luar ketentuan yang berlaku.
                    </li>
                    <li>
                        Setiap pengguna bertanggung jawab penuh atas data, dokumen, dan aktivitas yang dilakukan melalui akun masing-masing.
                    </li>
                    <li>
                        Aplikasi dapat mengalami perubahan, pembaruan, atau gangguan teknis sewaktu-waktu tanpa pemberitahuan sebelumnya.
                    </li>
                    <li>
                        Jika terdapat perbedaan antara data di aplikasi dan dokumen resmi institusi, maka yang berlaku adalah dokumen resmi institusi.
                    </li>
                </ol>
                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                    Dengan menggunakan aplikasi ini, Anda dianggap telah membaca dan memahami disclaimer ini.
                </div>
            </div>
        </GuestLayout>
    );
}
