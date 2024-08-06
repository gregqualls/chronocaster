<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Auth0\SDK\Auth0;

class Auth0IndexController extends Controller
{
    public function login()
    {
        $auth0 = new Auth0([
            'domain' => config('auth0.domain'),
            'client_id' => config('auth0.client_id'),
            'client_secret' => config('auth0.client_secret'),
            'redirect_uri' => config('auth0.redirect_uri'),
            'audience' => config('auth0.audience'),
            'scope' => 'openid profile email',
            'persist_id_token' => true,
            'persist_access_token' => true,
            'persist_refresh_token' => true,
        ]);

        return $auth0->login();
    }

    public function callback()
    {
        $auth0 = new Auth0([
            'domain' => config('auth0.domain'),
            'client_id' => config('auth0.client_id'),
            'client_secret' => config('auth0.client_secret'),
            'redirect_uri' => config('auth0.redirect_uri'),
        ]);

        $userInfo = $auth0->getUser();

        // Log in the user using Auth0 user information
        // You can customize this as needed
        return redirect('/');
    }

    public function logout()
    {
        $auth0 = new Auth0([
            'domain' => config('auth0.domain'),
            'client_id' => config('auth0.client_id'),
            'client_secret' => config('auth0.client_secret'),
            'redirect_uri' => config('auth0.redirect_uri'),
        ]);

        $auth0->logout();

        // Log out from Laravel session
        auth()->logout();

        return redirect('/');
    }
}
