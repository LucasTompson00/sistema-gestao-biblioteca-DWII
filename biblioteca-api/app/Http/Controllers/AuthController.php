<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $dados = $request->validate([
            'email' => 'required|email',
            'senha' => 'required|string',
        ], [
            'email.required' => 'O e-mail é obrigatório.',
            'email.email' => 'Digite um e-mail válido.',
            'senha.required' => 'A senha é obrigatória.',
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

    public function register(Request $request)
    {
        $dados = $request->validate([
            'nome' => 'required|string|max:100',
            'email' => 'required|email|max:100|unique:usuarios,email',
            'senha' => 'required|string|min:6|confirmed',
        ], [
            'nome.required' => 'O nome é obrigatório.',
            'nome.max' => 'O nome deve ter no máximo 100 caracteres.',
            'email.required' => 'O e-mail é obrigatório.',
            'email.email' => 'Digite um e-mail válido.',
            'email.max' => 'O e-mail deve ter no máximo 100 caracteres.',
            'email.unique' => 'Este e-mail já está cadastrado.',
            'senha.required' => 'A senha é obrigatória.',
            'senha.min' => 'A senha deve ter pelo menos 6 caracteres.',
            'senha.confirmed' => 'As senhas não coincidem.',
        ]);

        $usuario = Usuario::create([
            'nome' => $dados['nome'],
            'email' => $dados['email'],
            'senha' => $dados['senha'],
        ]);

        return response()->json([
            'message' => 'Cadastro realizado com sucesso.',
            'usuario' => $usuario,
        ], 201);
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
