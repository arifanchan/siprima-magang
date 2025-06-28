@extends('filament::page')

@section('content')
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <x-filament::card>
            <div class="text-lg font-bold">Total Users</div>
            <div class="text-3xl">{{ $stats['users'] }}</div>
        </x-filament::card>
        <x-filament::card>
            <div class="text-lg font-bold">Total Students</div>
            <div class="text-3xl">{{ $stats['students'] }}</div>
        </x-filament::card>
        <x-filament::card>
            <div class="text-lg font-bold">Total Mentors</div>
            <div class="text-3xl">{{ $stats['mentors'] }}</div>
        </x-filament::card>
        <x-filament::card>
            <div class="text-lg font-bold">Internship Applications</div>
            <div class="text-3xl">{{ $stats['applications'] }}</div>
        </x-filament::card>
        <x-filament::card>
            <div class="text-lg font-bold">Internship Activities</div>
            <div class="text-3xl">{{ $stats['activities'] }}</div>
        </x-filament::card>
        <x-filament::card>
            <div class="text-lg font-bold">Active Activities</div>
            <div class="text-3xl">{{ $stats['active_activities'] }}</div>
        </x-filament::card>
        <x-filament::card>
            <div class="text-lg font-bold">Completed Activities</div>
            <div class="text-3xl">{{ $stats['completed_activities'] }}</div>
        </x-filament::card>
    </div>
@endsection

