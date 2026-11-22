<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmprestimoRequest;
use App\Http\Requests\UpdateEmprestimoRequest;
use App\Models\Emprestimo;
use App\Services\EmprestimoService;

class EmprestimoController extends Controller
{
    public function index()
    {
        $emprestimos = Emprestimo::with([
            'usuario',
            'exemplar.livro',
        ])
            ->orderByDesc('data_emprestimo')
            ->get();

        return response()->json($emprestimos);
    }

    public function store(
        StoreEmprestimoRequest $request,
        EmprestimoService $service
    ) {
        $dados = $request->validated();

        $emprestimo = $service->registrar(
            $dados['usuario_id'],
            $dados['exemplar_id'],
            $dados['data_prevista']
        );

        return response()->json($emprestimo, 201);
    }

    public function show(Emprestimo $emprestimo)
    {
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
