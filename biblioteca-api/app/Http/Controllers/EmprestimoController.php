<?php

namespace App\Http\Controllers;

use App\Models\Emprestimo;
use Illuminate\Http\Request;

class EmprestimoController extends Controller
{
    public function index()
    {
        $emprestimos = Emprestimo::with(['usuario', 'exemplar'])->get();

        return response()->json($emprestimos);
    }

    public function store(Request $request)
    {
        $dados = $request->validate([
            'usuario_id' => 'required|exists:usuarios,id',
            'exemplar_id' => 'required|exists:exemplares,id',
            'data_emprestimo' => 'required|date',
            'data_prevista' => 'required|date',
            'data_devolucao' => 'nullable|date',
            'situacao' => 'required|string|max:20',
        ]);

        $emprestimo = Emprestimo::create($dados);

        return response()->json($emprestimo, 201);
    }

    public function show(Emprestimo $emprestimo)
    {
        $emprestimo->load(['usuario', 'exemplar']);

        return response()->json($emprestimo);
    }

    public function update(Request $request, Emprestimo $emprestimo)
    {
        $dados = $request->validate([
            'usuario_id' => 'sometimes|required|exists:usuarios,id',
            'exemplar_id' => 'sometimes|required|exists:exemplares,id',
            'data_emprestimo' => 'sometimes|required|date',
            'data_prevista' => 'sometimes|required|date',
            'data_devolucao' => 'sometimes|nullable|date',
            'situacao' => 'sometimes|required|string|max:20',
        ]);

        $emprestimo->update($dados);

        return response()->json($emprestimo);
    }

    public function destroy(Emprestimo $emprestimo)
    {
        $emprestimo->delete();

        return response()->noContent();
    }
}