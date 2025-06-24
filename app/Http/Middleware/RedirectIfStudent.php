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

class RedirectIfStudent
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if ($user && in_array($user->role, ['student', 'user'])) {
            $uri = $request->getRequestUri();
            if (Str::startsWith($uri, '/mentor')) {
                $newUri = substr($uri, strlen('/mentor'));
                return redirect($newUri ?: '/dashboard');
            }
        }
        return $next($request);
    }
}
