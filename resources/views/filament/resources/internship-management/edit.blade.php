{{-- Internship Edit Page --}}
@php
    $student = $record->internshipApplication->student ?? null;
    $user = $student?->user;
    $mentor = $record->mentor;
    $mentorUser = $mentor?->user;
    $application = $record->internshipApplication;
@endphp
<form method="POST" action="{{ route('internship-management.update', $record->id) }}" enctype="multipart/form-data" class="space-y-8">
    @csrf
    @method('PUT')
    <div class="flex items-center justify-between border-b pb-4 mb-4">
        <div>
            <h1 class="text-2xl font-bold text-primary-700">Edit Internship</h1>
            <p class="text-sm text-gray-500">Update internship data and manage documents.</p>
        </div>
        <div class="flex flex-col items-end gap-2">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                Application: {{ ucfirst($application?->status) ?? '-' }}
            </span>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                Activity: {{ ucfirst($record->status) ?? '-' }}
            </span>
        </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="font-semibold text-lg mb-2 text-primary-600 flex items-center gap-2">
                <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Student Information
            </h2>
            <dl class="divide-y divide-gray-100 text-sm">
                <div class="py-2 flex justify-between"><dt>Name</dt><dd class="font-medium">{{ $user?->name }}</dd></div>
                <div class="py-2 flex justify-between"><dt>Email</dt><dd>{{ $user?->email }}</dd></div>
                <div class="py-2 flex justify-between"><dt>Phone</dt><dd>{{ $user?->phone }}</dd></div>
                <div class="py-2 flex justify-between"><dt>University</dt><dd>{{ $student?->university }}</dd></div>
                <div class="py-2 flex justify-between"><dt>Faculty</dt><dd>{{ $student?->faculty }}</dd></div>
                <div class="py-2 flex justify-between"><dt>Study Program</dt><dd>{{ $student?->study_program }}</dd></div>
                <div class="py-2 flex justify-between"><dt>Entry Year</dt><dd>{{ $student?->entry_year }}</dd></div>
                <div class="py-2 flex justify-between"><dt>Semester/Grade</dt><dd>{{ $student?->semester_or_grade }}</dd></div>
                <div class="py-2 flex justify-between"><dt>Advisor</dt><dd>{{ $student?->advisor_name }}</dd></div>
            </dl>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="font-semibold text-lg mb-2 text-primary-600 flex items-center gap-2">
                <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 01.88 7.903A4.992 4.992 0 0112 21a4.992 4.992 0 01-4.88-6.097A4 4 0 118 7" /></svg>
                Mentor Information
            </h2>
            <dl class="divide-y divide-gray-100 text-sm">
                <div class="py-2 flex justify-between"><dt>Name</dt><dd class="font-medium">{{ $mentorUser?->name }}</dd></div>
                <div class="py-2 flex justify-between"><dt>Email</dt><dd>{{ $mentorUser?->email }}</dd></div>
                <div class="py-2 flex justify-between"><dt>Division</dt><dd>{{ $mentor?->division }}</dd></div>
                <div class="py-2 flex justify-between"><dt>Expertise</dt><dd>{{ $mentor?->expertise }}</dd></div>
                <div class="py-2 flex justify-between"><dt>Position</dt><dd>{{ $mentor?->position }}</dd></div>
            </dl>
        </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 class="font-semibold text-lg text-primary-600 flex items-center gap-2">
                <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a4 4 0 014-4h3m4 0a4 4 0 00-4-4V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2h6a2 2 0 002-2v-2" /></svg>
                Application & Documents
            </h2>
            <div class="mb-2">
                <label class="block text-sm font-medium">Status</label>
                <select name="status" class="form-select w-full mt-1">
                    <option value="pending" @selected($record->status=='pending')>Pending</option>
                    <option value="active" @selected($record->status=='active')>Active</option>
                    <option value="canceled" @selected($record->status=='canceled')>Canceled</option>
                    <option value="completed" @selected($record->status=='completed')>Completed</option>
                </select>
            </div>
            <div class="mb-2">
                <label class="block text-sm font-medium">Start Date</label>
                <input type="date" name="start_date" class="form-input w-full mt-1" value="{{ $record->start_date }}">
            </div>
            <div class="mb-2">
                <label class="block text-sm font-medium">End Date</label>
                <input type="date" name="end_date" class="form-input w-full mt-1" value="{{ $record->end_date }}">
            </div>
            <div class="mb-2">
                <label class="block text-sm font-medium">Mentor</label>
                <select name="mentor_id" class="form-select w-full mt-1">
                    <option value="">- Select Mentor -</option>
                    @foreach(\App\Models\Mentor::with('user')->get() as $mentorOption)
                        <option value="{{ $mentorOption->id }}" @selected($record->mentor_id == $mentorOption->id)>{{ $mentorOption->user->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="mb-2">
                <label class="block text-sm font-medium">Feedback</label>
                <textarea name="feedback" class="form-textarea w-full mt-1">{{ $record->feedback }}</textarea>
            </div>
            <div class="mb-2">
                <label class="block text-sm font-medium">Application Letter</label>
                @if($application?->application_letter)
                    <a href="{{ Storage::url($application->application_letter) }}" target="_blank" class="text-blue-600 underline">Download</a>
                @else - @endif
            </div>
            <div class="mb-2">
                <label class="block text-sm font-medium">CV</label>
                @if($application?->cv_file)
                    <a href="{{ Storage::url($application->cv_file) }}" target="_blank" class="text-blue-600 underline">Download</a>
                @else - @endif
            </div>
            <div class="mb-2">
                <label class="block text-sm font-medium">Other Documents</label>
                @if($application?->other_supporting_documents)
                    <ul class="list-disc ml-4">
                    @foreach($application->other_supporting_documents as $doc)
                        <li><a href="{{ Storage::url($doc) }}" target="_blank" class="text-blue-600 underline">Download</a></li>
                    @endforeach
                    </ul>
                @else - @endif
            </div>
            <div class="mb-2">
                <label class="block text-sm font-medium">Admin Notes</label>
                <input type="text" class="form-input w-full mt-1" value="{{ $application?->admin_notes }}" readonly>
            </div>
            <div class="mb-2">
                <label class="block text-sm font-medium">Rejection Reason</label>
                <input type="text" class="form-input w-full mt-1" value="{{ $application?->rejection_reason }}" readonly>
            </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 class="font-semibold text-lg mb-2 text-primary-600 flex items-center gap-2">
                <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 1.343-3 3v1a3 3 0 003 3 3 3 0 003-3v-1c0-1.657-1.343-3-3-3z" /></svg>
                Activity & Output
            </h2>
            <div class="mb-2">
                <label class="block text-sm font-medium">Final Presentation</label>
                @if($record->final_presentation)
                    <a href="{{ Storage::url($record->final_presentation) }}" target="_blank" class="text-blue-600 underline">Download</a>
                @endif
                <input type="file" name="final_presentation" class="form-input w-full mt-1">
            </div>
            <div class="mb-2">
                <label class="block text-sm font-medium">Final Report</label>
                @if($record->final_report)
                    <a href="{{ Storage::url($record->final_report) }}" target="_blank" class="text-blue-600 underline">Download</a>
                @endif
                <input type="file" name="final_report" class="form-input w-full mt-1">
            </div>
            <div class="mb-2">
                <label class="block text-sm font-medium">Completion Letter</label>
                @if($record->completion_letter)
                    <a href="{{ Storage::url($record->completion_letter) }}" target="_blank" class="text-blue-600 underline">Download</a>
                @endif
                <input type="file" name="completion_letter" class="form-input w-full mt-1">
            </div>
            <div class="mb-2">
                <label class="block text-sm font-medium">Certificate</label>
                @if($record->completion_certificate)
                    <a href="{{ Storage::url($record->completion_certificate) }}" target="_blank" class="text-blue-600 underline">Download</a>
                @endif
                <input type="file" name="completion_certificate" class="form-input w-full mt-1">
            </div>
            <div class="mb-2">
                <label class="block text-sm font-medium">Feedback</label>
                <textarea name="feedback" class="form-textarea w-full mt-1">{{ $record->feedback }}</textarea>
            </div>
            @if($record->mentor_id === null && $record->status === 'active')
                <a href="{{ url('/admin/internship-managements/'.$record->id.'/assign-mentor') }}" class="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition">Assign Mentor</a>
            @endif
        </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="font-semibold text-lg mb-2 text-primary-600 flex items-center gap-2">
                <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" /></svg>
                Logbook & Presences
            </h2>
            <ul class="text-sm list-disc ml-4">
                <li><a href="/admin/logbooks?tableFilters[activity_id][value]={{ $record->id }}" class="text-blue-600 underline">View Logbook</a></li>
                <li><a href="/admin/presences?tableFilters[activity_id][value]={{ $record->id }}" class="text-blue-600 underline">View Presences</a></li>
            </ul>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="font-semibold text-lg mb-2 text-primary-600 flex items-center gap-2">
                <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-3-3v6" /></svg>
                Assignments & Final Assessment
            </h2>
            <ul class="text-sm list-disc ml-4">
                <li><a href="/admin/assignments?tableFilters[activity_id][value]={{ $record->id }}" class="text-blue-600 underline">View Assignments</a></li>
                <li><a href="/admin/final-assessments?tableFilters[activity_id][value]={{ $record->id }}" class="text-blue-600 underline">View Final Assessment</a></li>
            </ul>
        </div>
    </div>
    <div class="flex justify-end">
        <button type="submit" class="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold">Save Changes</button>
    </div>
</form>

