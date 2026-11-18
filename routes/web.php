<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('speedometer');
});

Route::get('/hello', function () {
    return Inertia::render('Hello');
});
