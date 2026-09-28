<?php

use App\Http\Controllers\AutorController;
use App\Http\Controllers\LivroController;
use Illuminate\Support\Facades\Route;

Route::apiResource('livros', LivroController::class);
Route::apiResource('autores', AutorController::class)->parameters(['autores' => 'autor']);