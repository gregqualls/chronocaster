<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::resource('programs', ProgramController::class);
Route::resource('programs.units', SessionController::class);
Route::resource('units.segments', SegmentController::class);
Route::get('/labels', [LabelController::class, 'index']);
Route::post('/labels', [LabelController::class, 'update']);
Route::get('/login', [Auth\Auth0IndexController::class, 'login'])->name('login');
Route::get('/callback', [Auth\Auth0IndexController::class, 'callback']);
Route::get('/logout', [Auth\Auth0IndexController::class, 'logout'])->name('logout');
