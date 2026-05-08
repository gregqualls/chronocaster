<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'chronocaster-backend',
        'status' => 'ok',
    ]);
});
