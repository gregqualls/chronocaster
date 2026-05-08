<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LiveEventController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\SegmentController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\UnitController;
use Illuminate\Support\Facades\Route;

Route::get('/now', fn () => [
    'now' => now()->toIso8601String(),
    'epoch_ms' => (int) (microtime(true) * 1000),
]);

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login',    [AuthController::class, 'login']);
Route::post('/auth/logout',   [AuthController::class, 'logout']);
Route::get('/auth/me',        [AuthController::class, 'me']);

Route::middleware('auth')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/stats', [StatsController::class, 'index']);

    Route::apiResource('programs', ProgramController::class);
    Route::apiResource('units', UnitController::class);

    Route::get('units/{unit}/segments',                  [SegmentController::class, 'index']);
    Route::post('units/{unit}/segments',                 [SegmentController::class, 'store']);
    Route::put('units/{unit}/segments/{segment}',        [SegmentController::class, 'update']);
    Route::patch('units/{unit}/segments/{segment}',      [SegmentController::class, 'update']);
    Route::delete('units/{unit}/segments/{segment}',     [SegmentController::class, 'destroy']);
    Route::post('units/{unit}/segments/reorder',         [SegmentController::class, 'reorder']);

    Route::get('units/{unit}/state',     [LiveEventController::class, 'show']);
    Route::post('units/{unit}/start',    [LiveEventController::class, 'start']);
    Route::post('units/{unit}/pause',    [LiveEventController::class, 'pause']);
    Route::post('units/{unit}/resume',   [LiveEventController::class, 'resume']);
    Route::post('units/{unit}/advance',  [LiveEventController::class, 'advance']);
    Route::post('units/{unit}/stop',     [LiveEventController::class, 'stop']);
});
