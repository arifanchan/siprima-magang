<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\MediaSosialUpdateRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MediaSosialController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $mediaSosial = $user->mediaSosial;
        return Inertia::render('settings/social-media', [
            'mediaSosial' => $mediaSosial,
        ]);
    }

    public function update(MediaSosialUpdateRequest $request)
    {
        $user = $request->user();
        $mediaSosial = $user->mediaSosial;
        if (!$mediaSosial) {
            $mediaSosial = $user->mediaSosial()->create($request->validated());
        } else {
            $mediaSosial->update($request->validated());
        }
        return redirect()->route('media-sosial.edit')->with('status', 'Social media updated successfully.');
    }
}

