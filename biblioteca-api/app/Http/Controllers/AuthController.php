<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $dados = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ], [
            'email.required' => 'O e-mail é obrigatório.',
            'email.email' => 'Digite um e-mail válido.',
            'password.required' => 'A senha é obrigatória.',
        ]);

        $usuario = Usuario::where('email', $dados['email'])
            ->where('ativo', true)
            ->first();

        if (!$usuario || !Hash::check($dados['password'], $usuario->senha)) {
            return response()->json([
                'message' => 'E-mail ou senha inválidos.'
            ], 401);
        }

        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login realizado com sucesso.',
            'token' => $token,
            'usuario' => $usuario,
        ]);
    }

    public function register(Request $request)
    {
        $dados = $request->validate([
            'nome' => 'required|string|max:100',
            'email' => 'required|email|max:100|unique:usuarios,email',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'nome.required' => 'O nome é obrigatório.',
            'nome.max' => 'O nome deve ter no máximo 100 caracteres.',
            'email.required' => 'O e-mail é obrigatório.',
            'email.email' => 'Digite um e-mail válido.',
            'email.max' => 'O e-mail deve ter no máximo 100 caracteres.',
            'email.unique' => 'Este e-mail já está cadastrado.',
            'password.required' => 'A senha é obrigatória.',
            'password.min' => 'A senha deve ter pelo menos 6 caracteres.',
            'password.confirmed' => 'As senhas não coincidem.',
        ]);

        $usuario = Usuario::create([
            'nome' => $dados['nome'],
            'email' => $dados['email'],
            'senha' => $dados['password'],
        ]);

        return response()->json([
            'message' => 'Cadastro realizado com sucesso.',
            'usuario' => $usuario,
        ], 201);
    }

    public function me(Request $request)
    {
        return response()->json([
            'usuario' => $request->user(),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout realizado com sucesso.'
        ]);
    }
}
