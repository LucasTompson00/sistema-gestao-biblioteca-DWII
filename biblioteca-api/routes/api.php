<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AutorController;
use App\Http\Controllers\DevolucaoController;
use App\Http\Controllers\EmprestimoController;
use App\Http\Controllers\ExemplarController;
use App\Http\Controllers\GeneroController;
use App\Http\Controllers\LivroController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    Route::middleware('auth:sanctum')->group(function () {

        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/me', [AuthController::class, 'updateMe']);
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::middleware('perfil:usuario,bibliotecario')->group(function () {

            Route::apiResource('livros', LivroController::class)
                ->only(['index', 'show']);

            Route::apiResource('autores', AutorController::class)
                ->parameters(['autores' => 'autor'])
                ->only(['index', 'show']);

            Route::apiResource('generos', GeneroController::class)
                ->parameters(['generos' => 'genero'])
                ->only(['index', 'show']);

            Route::apiResource('exemplares', ExemplarController::class)
                ->parameters(['exemplares' => 'exemplar'])
                ->only(['index', 'show']);

            Route::apiResource('emprestimos', EmprestimoController::class)
                ->parameters(['emprestimos' => 'emprestimo'])
                ->only(['index', 'show']);

            Route::post('/emprestimos', [EmprestimoController::class, 'store']);
        });

        Route::middleware('perfil:bibliotecario')->group(function () {

            Route::apiResource('livros', LivroController::class)
                ->except(['index', 'show']);

            Route::apiResource('autores', AutorController::class)
                ->parameters(['autores' => 'autor'])
                ->except(['index', 'show']);

            Route::apiResource('generos', GeneroController::class)
                ->parameters(['generos' => 'genero'])
                ->except(['index', 'show']);

            Route::apiResource('exemplares', ExemplarController::class)
                ->parameters(['exemplares' => 'exemplar'])
                ->except(['index', 'show']);

            Route::apiResource('emprestimos', EmprestimoController::class)
                ->parameters(['emprestimos' => 'emprestimo'])
                ->except(['index', 'show', 'store']);

            Route::patch(
                '/emprestimos/{emprestimo}/devolucao',
                DevolucaoController::class
            );
        });
    });
});
