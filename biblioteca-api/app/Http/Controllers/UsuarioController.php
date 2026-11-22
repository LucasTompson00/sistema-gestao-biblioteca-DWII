<?php

namespace App\Http\Controllers;

use App\Models\Usuario;

class UsuarioController extends Controller
{
    public function index()
    {
        $usuarios = Usuario::where('perfil', 'usuario')
            ->where('ativo', true)
            ->orderBy('nome')
            ->get(['id', 'nome', 'email']);

        return response()->json($usuarios);
    }
}
