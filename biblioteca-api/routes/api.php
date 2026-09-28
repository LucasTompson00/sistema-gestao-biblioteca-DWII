<?php

use App\Http\Controllers\AutorController;
use App\Http\Controllers\EmprestimoController;
use App\Http\Controllers\ExemplarController;
use App\Http\Controllers\GeneroController;
use App\Http\Controllers\LivroController;
use Illuminate\Support\Facades\Route;

Route::apiResource('livros', LivroController::class);

Route::apiResource('autores', AutorController::class)
    ->parameters(['autores' => 'autor']);

Route::apiResource('generos', GeneroController::class)
    ->parameters(['generos' => 'genero']);

Route::apiResource('exemplares', ExemplarController::class)
    ->parameters(['exemplares' => 'exemplar']);

Route::apiResource('emprestimos', EmprestimoController::class)
    ->parameters(['emprestimos' => 'emprestimo']);