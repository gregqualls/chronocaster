<?php

use App\Http\Controllers\MeController;
use App\Http\Controllers\StatsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/now', fn () => [
    'now' => now()->toIso8601String(),
    'epoch_ms' => (int) (microtime(true) * 1000),
]);

Route::middleware('auth0')->group(function () {
    Route::get('/me', [MeController::class, 'show']);
    Route::get('/stats', [StatsController::class, 'index']);
});
