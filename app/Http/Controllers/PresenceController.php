

    // Edit presensi
    public function update(Request $request, $id)
    {
        $presence = Presence::findOrFail($id);
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
