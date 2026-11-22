<?php

namespace App\Http\Controllers;

use App\Models\Emprestimo;
use App\Models\Exemplar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmprestimoController extends Controller
{
    public function index()
    {
        $emprestimos = Emprestimo::with([
            'usuario',
            'exemplar.livro'
        ])
            ->orderByDesc('data_emprestimo')
            ->get();

        return response()->json($emprestimos);
    }

    public function store(Request $request)
    {
        $dados = $request->validate([
            'usuario_id' => 'required|exists:usuarios,id',
            'exemplar_id' => 'required|exists:exemplares,id',
            'data_prevista' => 'required|date|after_or_equal:today',
        ]);

        $emprestimo = DB::transaction(function () use ($dados) {
            $exemplar = Exemplar::whereKey($dados['exemplar_id'])
                ->lockForUpdate()
                ->firstOrFail();

            $emprestimoAtivo = Emprestimo::where('exemplar_id', $exemplar->id)
                ->where('situacao', 'ativo')
                ->whereNull('data_devolucao')
                ->exists();

            if ($exemplar->status !== 'disponivel' || $emprestimoAtivo) {
                return null;
            }

            $emprestimo = Emprestimo::create([
                'usuario_id' => $dados['usuario_id'],
                'exemplar_id' => $exemplar->id,
                'data_emprestimo' => now(),
                'data_prevista' => $dados['data_prevista'],
                'data_devolucao' => null,
                'situacao' => 'ativo',
            ]);

            $exemplar->update([
                'status' => 'emprestado',
            ]);

            return $emprestimo;
        });

        if (!$emprestimo) {
            return response()->json([
                'message' => 'Este exemplar não está disponível para empréstimo.',
            ], 409);
        }

        $emprestimo->load([
            'usuario',
            'exemplar.livro'
        ]);

        return response()->json($emprestimo, 201);
    }

    public function show(Emprestimo $emprestimo)
    {
        $emprestimo->load([
            'usuario',
            'exemplar.livro'
        ]);

        return response()->json($emprestimo);
    }

    public function update(Request $request, Emprestimo $emprestimo)
    {
        if (
            $emprestimo->data_devolucao !== null ||
            $emprestimo->situacao !== 'ativo'
        ) {
            return response()->json([
                'message' => 'Não é possível alterar um empréstimo que não está ativo.',
            ], 409);
        }

        $dados = $request->validate([
            'data_prevista' => 'sometimes|required|date|after_or_equal:today',
        ]);

        $emprestimo->update($dados);

        $emprestimo->load([
            'usuario',
            'exemplar.livro'
        ]);

        return response()->json($emprestimo);
    }

    public function devolver(Emprestimo $emprestimo)
    {
        $resultado = DB::transaction(function () use ($emprestimo) {
            $emprestimo = Emprestimo::whereKey($emprestimo->id)
                ->lockForUpdate()
                ->firstOrFail();

            if (
                $emprestimo->data_devolucao !== null ||
                $emprestimo->situacao !== 'ativo'
            ) {
                return null;
            }

            $exemplar = Exemplar::whereKey($emprestimo->exemplar_id)
                ->lockForUpdate()
                ->firstOrFail();

            $emprestimo->update([
                'data_devolucao' => now(),
                'situacao' => 'devolvido',
            ]);

            $exemplar->update([
                'status' => 'disponivel',
            ]);

            return $emprestimo;
        });

        if (!$resultado) {
            return response()->json([
                'message' => 'Este empréstimo já foi devolvido ou não está ativo.',
            ], 409);
        }

        $resultado->load([
            'usuario',
            'exemplar.livro'
        ]);

        return response()->json($resultado);
    }

    public function destroy(Emprestimo $emprestimo)
    {
        if (
            $emprestimo->data_devolucao === null ||
            $emprestimo->situacao !== 'devolvido'
        ) {
            return response()->json([
                'message' => 'Não é possível excluir um empréstimo que ainda não foi devolvido.',
            ], 409);
        }

        $emprestimo->delete();

        return response()->noContent();
    }
}
