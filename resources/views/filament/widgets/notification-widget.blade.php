<div>
    <h3 class="text-lg font-bold mb-2">Notifikasi</h3>
    <ul class="space-y-2">
        @forelse ($this->getNotifications() as $notification)
            <li class="p-2 bg-white rounded shadow flex flex-col">
                <span class="font-semibold">{{ $notification->data['title'] ?? 'Notifikasi' }}</span>
                <span class="text-sm text-gray-600">{{ $notification->data['body'] ?? $notification->data['message'] ?? '-' }}</span>
                @if(isset($notification->data['url']))
                    <a href="{{ $notification->data['url'] }}" class="text-blue-600 text-xs mt-1" target="_blank">Lihat detail</a>
                @endif
                <span class="text-xs text-gray-400 mt-1">{{ $notification->created_at->diffForHumans() }}</span>
            </li>
        @empty
            <li class="text-gray-500">Tidak ada notifikasi.</li>
        @endforelse
    </ul>
</div>

