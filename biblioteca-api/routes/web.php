<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/csrf-token', function (Request $request) {
    return response()->json([
        'token' => $request->session()->token(),
    ]);
});

Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/me', function () {
    if (!Auth::check()) {
        return response()->json([
            'message' => 'Usuário não autenticado.'
        ], 401);
    }

    return response()->json([
        'usuario' => Auth::user()
    ]);
});