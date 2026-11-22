<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerificarPerfil
{
    public function handle(
        Request $request,
        Closure $next,
        string ...$perfis
    ): Response {
        $usuario = $request->user();

        if (!$usuario || !in_array($usuario->perfil, $perfis, true)) {
            return response()->json([
                'message' => 'Você não tem permissão para realizar esta ação.'
            ], 403);
        }

        return $next($request);
    }
}
