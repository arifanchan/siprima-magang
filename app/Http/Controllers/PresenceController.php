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
}
