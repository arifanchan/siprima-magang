<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RedirectIfMentor
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if ($user && $user->role === 'mentor') {
            $uri = $request->getRequestUri();
            // if already on mentor area, proceed
            if (Str::startsWith($uri, '/mentor')) {
                return $next($request);
            }
            // redirect to equivalent mentor route
            $newUri = '/mentor' . $uri;
            return redirect($newUri);
        }
        return $next($request);
    }
}
