

    // Edit assignment
    public function update(Request $request, $id)
    {
        $assignment = Assignment::findOrFail($id);
        $assignment->update($request->only(['title', 'description', 'due_date', 'status']));
        return redirect()->back()->with('status', 'Tugas berhasil diupdate.');
    }

    // Hapus assignment
    public function destroy($id)
    {
        $assignment = Assignment::findOrFail($id);
        $assignment->delete();
        return redirect()->back()->with('status', 'Tugas berhasil dihapus.');
    }
}
