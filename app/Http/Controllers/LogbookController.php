<?php

namespace App\Http\Controllers;

use App\Models\Logbook;
use Illuminate\Http\Request;

class LogbookController extends Controller
{
    // Edit logbook
    public function update(Request $request, $id)
    {
        $logbook = Logbook::findOrFail($id);
        $activityDate = $request->input('date', $logbook->date);
        $today = now()->toDateString();
        $internship = $logbook->internshipActivity;
        $start = $internship ? $internship->start_date : null;
        $end = $internship ? $internship->end_date : null;

        // Validasi tanggal logbook
        if (!$start || !$end) {
            return redirect()->back()->withErrors(['date' => 'Periode magang tidak ditemukan.']);
        }
        if ($activityDate < $start || $activityDate > $end) {
            return redirect()->back()->withErrors(['date' => 'Tanggal logbook harus dalam periode magang.']);
        }
        if ($activityDate > $today) {
            return redirect()->back()->withErrors(['date' => 'Logbook tidak dapat diisi untuk tanggal ke depan.']);
        }

        // Handle file upload for evidence_harian
        if ($request->hasFile('evidence_harian')) {
            $user = $request->user();
            if ($logbook->evidence_harian) {
                \Storage::delete('public/' . $logbook->evidence_harian);
            }
            $filename = now()->format('Y-m-d') . '_' . $request->file('evidence_harian')->getClientOriginalName();
            $relativePath = 'users/' . $user->id . '/internship/logbooks/' . $filename;
            $request->file('evidence_harian')->storeAs('users/' . $user->id . '/internship/logbooks', $filename, 'public');
            $logbook->evidence_harian = $relativePath;
        }
        $logbook->update($request->only(['activity', 'description', 'progress', 'status']));
        $logbook->save();
        return redirect()->back()->with('status', 'Logbook berhasil diupdate.');
    }

    // Hapus logbook
    public function destroy($id)
    {
        $logbook = Logbook::findOrFail($id);
        $logbook->delete();
        return redirect()->back()->with('status', 'Logbook berhasil dihapus.');
    }
}
