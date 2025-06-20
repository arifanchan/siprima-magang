<?php

namespace App\Http\Controllers;

use App\Models\Presence;
use Illuminate\Http\Request;

class PresenceController extends Controller
{
    public function update(Request $request, $id)
    {
        $presence = Presence::findOrFail($id);
        $today = now()->toDateString();
        $checkIn = $request->input('check_in', $presence->check_in);
        $checkOut = $request->input('check_out', $presence->check_out);
        $presenceDate = $request->input('date', $presence->date ?? $today);

        // Validasi tanggal presensi
        if ($presenceDate !== $today) {
            return redirect()->back()->withErrors(['date' => 'Presensi hanya dapat dilakukan pada hari ini.']);
        }
        // Validasi jam presensi
        $checkInTime = $checkIn ? date('H:i', strtotime($checkIn)) : null;
        $checkOutTime = $checkOut ? date('H:i', strtotime($checkOut)) : null;
        if ($checkInTime && ($checkInTime < '06:00' || $checkInTime > '18:00')) {
            return redirect()->back()->withErrors(['check_in' => 'Check-in hanya dapat dilakukan antara pukul 06:00 hingga 18:00.']);
        }
        if ($checkOutTime && ($checkOutTime < '06:00' || $checkOutTime > '18:00')) {
            return redirect()->back()->withErrors(['check_out' => 'Check-out hanya dapat dilakukan antara pukul 06:00 hingga 18:00.']);
        }

        $presence->update($request->only(['check_in', 'check_out', 'notes']));
        return redirect()->back()->with('status', 'Presensi berhasil diupdate.');
    }

    // Hapus presensi
    public function destroy($id)
    {
        $presence = Presence::findOrFail($id);
        $presence->delete();
        return redirect()->back()->with('status', 'Presensi berhasil dihapus.');
    }

    public function checkIn(Request $request)
    {
        $user = $request->user();
        $activityId = $request->input('internship_activity_id');
        $today = now()->toDateString();
        $currentTime = now()->format('H:i');
        if ($currentTime < '06:00' || $currentTime > '18:00') {
            return redirect()->back()->withErrors(['check_in' => 'Check-in hanya dapat dilakukan antara pukul 06:00 hingga 18:00.']);
        }
        $presence = Presence::firstOrCreate([
            'internship_activity_id' => $activityId,
            'date' => $today,
        ]);
        if ($presence->check_in) {
            return redirect()->back()->withErrors(['check_in' => 'Anda sudah melakukan presensi masuk hari ini.']);
        }
        $presence->check_in = $currentTime;
        $presence->save();
        // Redirect ke halaman detail magang agar data presensi hari ini langsung ter-refresh
        return redirect()->route('internship-activities.show', ['internship_activity' => $activityId])->with('status', 'Presensi masuk berhasil.');
    }

    public function checkOut(Request $request)
    {
        $user = $request->user();
        $activityId = $request->input('internship_activity_id');
        $today = now()->toDateString();
        $currentTime = now()->format('H:i');
        if ($currentTime < '06:00' || $currentTime > '18:00') {
            return redirect()->back()->withErrors(['check_out' => 'Check-out hanya dapat dilakukan antara pukul 06:00 hingga 18:00.']);
        }
        $presence = Presence::where([
            ['internship_activity_id', '=', $activityId],
            ['date', '=', $today],
        ])->first();
        if (!$presence || !$presence->check_in) {
            return redirect()->back()->withErrors(['check_out' => 'Anda belum melakukan presensi masuk hari ini.']);
        }
        if ($presence->check_out) {
            return redirect()->back()->withErrors(['check_out' => 'Anda sudah melakukan presensi keluar hari ini.']);
        }
        $presence->check_out = $currentTime;
        $presence->save();
        // Redirect ke halaman detail magang agar data presensi hari ini langsung ter-refresh
        return redirect()->route('internship-activities.show', ['internship_activity' => $activityId])->with('status', 'Presensi keluar berhasil.');
    }
}
