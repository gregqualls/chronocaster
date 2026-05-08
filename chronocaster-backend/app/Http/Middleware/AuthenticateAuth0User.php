<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateAuth0User
{
    public function handle(Request $request, Closure $next): Response
    {
        $auth0 = Auth::guard('auth0-api')->user();

        if (! $auth0) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $sub = $auth0->getAuthIdentifier() ?: ($auth0->sub ?? null);

        if (! $sub) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        $user = User::firstOrNew(['auth0_sub' => $sub]);

        $user->fill([
            'name'  => $auth0->name  ?? $user->name  ?? 'Anonymous',
            'email' => $auth0->email ?? $user->email,
        ]);

        if (! $user->exists) {
            $user->save();
            if ($user->roles()->count() === 0) {
                $user->assignRole('Viewer');
            }
        } elseif ($user->isDirty()) {
            $user->save();
        }

        Auth::setUser($user);
        $request->setUserResolver(fn () => $user);

        return $next($request);
    }
}
