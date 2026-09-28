<?php

use App\Http\Controllers\LivroController;
use Illuminate\Support\Facades\Route;

Route::apiResource('livros', LivroController::class);