/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

import React from 'react';
import GuestLayout from '@/layouts/guest-layout';
import { Head } from '@inertiajs/react';

export default function ConsentPage() {
    return (
        <GuestLayout title="Persetujuan Penggunaan">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-6 mt-8">
                <Head title="Persetujuan Penggunaan" />
                <h1 className="text-2xl font-bold mb-4">Persetujuan Penggunaan Aplikasi</h1>
                <ol className="list-decimal ml-6 space-y-2 text-justify">
                    <li>
                        <b>Persetujuan Penggunaan Data:</b> Setiap pengguna aplikasi ini menyetujui bahwa data yang diberikan akan digunakan untuk keperluan administrasi, pelaporan, dan pengelolaan magang sesuai dengan ketentuan institusi.
                    </li>
                    <li>
                        <b>Persetujuan Peserta Magang:</b> Peserta magang menyetujui bahwa foto-foto bukti kegiatan, logbook, dan tugas yang diunggah dapat digunakan oleh institusi untuk keperluan dokumentasi, pelaporan, dan publikasi internal.
                    </li>
                    <li>
                        <b>Persetujuan Mentor:</b> Mentor menyetujui untuk menjalankan prinsip keadilan dan objektivitas dalam membimbing, menilai, dan memberikan umpan balik kepada peserta magang.
                    </li>
                    <li>
                        <b>Kebenaran Data:</b> Seluruh pengguna bertanggung jawab atas kebenaran data yang diberikan dan bersedia menerima sanksi jika terbukti memberikan data palsu atau menyesatkan.
                    </li>
                    <li>
                        <b>Kepatuhan Terhadap Aturan:</b> Seluruh pengguna wajib mematuhi seluruh aturan, kebijakan, dan ketentuan yang berlaku di institusi ini serta peraturan perundang-undangan yang relevan.
                    </li>
                </ol>
                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                    Dengan menggunakan aplikasi ini, Anda dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan di atas.
                </div>
            </div>
        </GuestLayout>
    );
}
