<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $dados = $request->validate([
            'email' => 'required|email',
            'senha' => 'required|string',
        ]);

        if (Auth::attempt([
            'email' => $dados['email'],
            'password' => $dados['senha'],
            'ativo' => true,
        ])) {
            $request->session()->regenerate();

            return response()->json([
                'message' => 'Login realizado com sucesso.',
                'usuario' => Auth::user(),
            ]);
        }

        return response()->json([
            'message' => 'E-mail ou senha inválidos.'
        ], 401);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout realizado com sucesso.'
        ]);
    }
}