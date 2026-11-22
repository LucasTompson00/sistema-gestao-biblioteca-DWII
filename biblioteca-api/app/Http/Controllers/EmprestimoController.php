<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmprestimoRequest;
use App\Http\Requests\UpdateEmprestimoRequest;
use App\Models\Emprestimo;
use App\Services\EmprestimoService;
use Illuminate\Http\Request;

class EmprestimoController extends Controller
{
    public function index(Request $request)
    {
        $consulta = Emprestimo::with([
            'usuario',
            'exemplar.livro',
        ]);

        if ($request->user()->perfil !== 'bibliotecario') {
            $consulta->where('usuario_id', $request->user()->id);
        }

        $emprestimos = $consulta
            ->orderByDesc('data_emprestimo')
            ->get();

        return response()->json($emprestimos);
    }


    public function store(
        StoreEmprestimoRequest $request,
        EmprestimoService $service
    ) {
        $dados = $request->validated();

        $usuarioId = $request->user()->perfil === 'bibliotecario'
            ? $dados['usuario_id']
            : $request->user()->id;

        $emprestimo = $service->registrar(
            $usuarioId,
            $dados['exemplar_id'],
            $dados['data_prevista']
        );

        return response()->json($emprestimo, 201);
    }


    public function show(Request $request, Emprestimo $emprestimo)
    {
        if (
            $request->user()->perfil !== 'bibliotecario' &&
            (int) $emprestimo->usuario_id !== (int) $request->user()->id
        ) {
            return response()->json([
                'message' => 'Você não tem permissão para consultar este empréstimo.'
            ], 403);
        }

        $emprestimo->load([
            'usuario',
            'exemplar.livro',
        ]);

        return response()->json($emprestimo);
    }

    public function update(
        UpdateEmprestimoRequest $request,
        Emprestimo $emprestimo,
        EmprestimoService $service
    ) {
        $dados = $request->validated();

        $emprestimo = $service->atualizarPrevisao(
            $emprestimo,
            $dados['data_prevista']
        );

        return response()->json($emprestimo);
    }

    public function destroy(
        Emprestimo $emprestimo,
        EmprestimoService $service
    ) {
        $service->excluir($emprestimo);

        return response()->noContent();
    }
}
