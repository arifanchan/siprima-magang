{{-- Internship Detail Page --}}
@php
    $student = $record->internshipApplication->student ?? null;
    $user = $student?->user;
    $mentor = $record->mentor;
    $mentorUser = $mentor?->user;
    $application = $record->internshipApplication;
@endphp
<div class="space-y-8">
    <div class="flex items-center justify-between border-b pb-4 mb-4">
        <div>
            <h1 class="text-2xl font-bold text-primary-700">Internship Detail</h1>
            <p class="text-sm text-gray-500">Monitor and manage all aspects of this internship in one place.</p>
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
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center mb-2">
                <h2 class="font-semibold text-lg text-primary-600 flex items-center gap-2">
                    <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2a4 4 0 014-4h3m4 0a4 4 0 00-4-4V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2h6a2 2 0 002-2v-2" /></svg>
                    Application & Documents
                </h2>
                @if($application?->status === 'pending')
                    <form method="POST" action="{{ url('/admin/internship-managements/'.$record->id.'/approve') }}">
                        @csrf
                        <button type="submit" class="px-3 py-1 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700 transition">Approve</button>
                    </form>
                @endif
            </div>
            <dl class="divide-y divide-gray-100 text-sm">
                <div class="py-2 flex justify-between"><dt>Status</dt><dd>{{ ucfirst($application?->status) }}</dd></div>
                <div class="py-2 flex justify-between"><dt>Start Date</dt><dd>{{ $application?->start_date }}</dd></div>
                <div class="py-2 flex justify-between"><dt>End Date</dt><dd>{{ $application?->end_date }}</dd></div>
                <div class="py-2 flex justify-between"><dt>Description</dt><dd>{{ $application?->description }}</dd></div>
                <div class="py-2 flex justify-between"><dt>Application Letter</dt><dd>@if($application?->application_letter)<a href="{{ Storage::url($application->application_letter) }}" target="_blank" class="text-blue-600 underline">Download</a>@else - @endif</dd></div>
                <div class="py-2 flex justify-between"><dt>CV</dt><dd>@if($application?->cv_file)<a href="{{ Storage::url($application->cv_file) }}" target="_blank" class="text-blue-600 underline">Download</a>@else - @endif</dd></div>
                <div class="py-2 flex justify-between"><dt>Other Documents</dt><dd>@if($application?->other_supporting_documents)
                    <ul class="list-disc ml-4">
                    @foreach($application->other_supporting_documents as $doc)
                        <li><a href="{{ Storage::url($doc) }}" target="_blank" class="text-blue-600 underline">Download</a></li>
                    @endforeach
                    </ul>
                @else - @endif</dd></div>
                <div class="py-2 flex justify-between"><dt>Admin Notes</dt><dd>{{ $application?->admin_notes }}</dd></div>
                <div class="py-2 flex justify-between"><dt>Rejection Reason</dt><dd>{{ $application?->rejection_reason }}</dd></div>
            </dl>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center mb-2">
                <h2 class="font-semibold text-lg text-primary-600 flex items-center gap-2">
                    <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 1.343-3 3v1a3 3 0 003 3 3 3 0 003-3v-1c0-1.657-1.343-3-3-3z" /></svg>
                    Activity & Output
                </h2>
                @if($record->mentor_id === null && $record->status === 'active')
                    <a href="{{ url('/admin/internship-managements/'.$record->id.'/assign-mentor') }}" class="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition">Assign Mentor</a>
                @endif
            </div>
            <dl class="divide-y divide-gray-100 text-sm">
                <div class="py-2 flex justify-between"><dt>Status</dt><dd>{{ ucfirst($record->status) }}</dd></div>
                <div class="py-2 flex justify-between"><dt>Start Date</dt><dd>{{ $record->start_date }}</dd></div>
                <div class="py-2 flex justify-between"><dt>End Date</dt><dd>{{ $record->end_date }}</dd></div>
                <div class="py-2 flex justify-between"><dt>Final Presentation</dt><dd>@if($record->final_presentation)<a href="{{ Storage::url($record->final_presentation) }}" target="_blank" class="text-blue-600 underline">Download</a>@else - @endif</dd></div>
                <div class="py-2 flex justify-between"><dt>Final Report</dt><dd>@if($record->final_report)<a href="{{ Storage::url($record->final_report) }}" target="_blank" class="text-blue-600 underline">Download</a>@else - @endif</dd></div>
                <div class="py-2 flex justify-between"><dt>Completion Letter</dt><dd>@if($record->completion_letter)<a href="{{ Storage::url($record->completion_letter) }}" target="_blank" class="text-blue-600 underline">Download</a>@else - @endif</dd></div>
                <div class="py-2 flex justify-between"><dt>Certificate</dt><dd>@if($record->completion_certificate)<a href="{{ Storage::url($record->completion_certificate) }}" target="_blank" class="text-blue-600 underline">Download</a>@else - @endif</dd></div>
                <div class="py-2 flex justify-between"><dt>Feedback</dt><dd>{{ $record->feedback }}</dd></div>
            </dl>
            <div class="mt-4 flex gap-2">
                <form method="POST" action="{{ url('/admin/internship-managements/'.$record->id.'/upload-letter') }}" enctype="multipart/form-data">
                    @csrf
                    <label class="block text-xs font-semibold mb-1">Upload Completion Letter:
                        <input type="file" name="completion_letter" class="block mt-1 text-xs" required>
                    </label>
                    <button type="submit" class="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 transition mt-1">Upload</button>
                </form>
                <form method="POST" action="{{ url('/admin/internship-managements/'.$record->id.'/upload-certificate') }}" enctype="multipart/form-data">
                    @csrf
                    <label class="block text-xs font-semibold mb-1">Upload Certificate:
                        <input type="file" name="completion_certificate" class="block mt-1 text-xs" required>
                    </label>
                    <button type="submit" class="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 transition mt-1">Upload</button>
                </form>
            </div>
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
</div>
