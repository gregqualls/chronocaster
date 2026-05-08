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
