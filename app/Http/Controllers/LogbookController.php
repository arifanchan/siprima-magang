

    // Edit logbook
    public function update(Request $request, $id)
    {
        $logbook = Logbook::findOrFail($id);
        $logbook->update($request->only(['activity', 'description', 'progress', 'status']));
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
