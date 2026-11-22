<?php

namespace App\Http\Controllers;

use App\Models\Exemplar;
use App\Http\Requests\StoreExemplarRequest;
use App\Http\Requests\UpdateExemplarRequest;

class ExemplarController extends Controller
{
    public function index()
    {
        $exemplares = Exemplar::with('livro')->get();

        return response()->json($exemplares);
    }

    public function store(StoreExemplarRequest $request)
    {
        $dados = $request->validated();

        $dados['status'] = 'disponivel';

        $exemplar = Exemplar::create($dados);
        $exemplar->load('livro');

        return response()->json($exemplar, 201);
    }

    public function show(Exemplar $exemplar)
    {
        $exemplar->load('livro');

        return response()->json($exemplar);
    }

    public function update(UpdateExemplarRequest $request, Exemplar $exemplar)
    {
        if ($exemplar->status !== 'disponivel') {
            return response()->json([
                'message' => 'Não é possível alterar um exemplar que está emprestado.'
            ], 409);
        }

        $dados = $request->validated();

        $exemplar->update($dados);
        $exemplar->load('livro');

        return response()->json($exemplar);
    }


    public function destroy(Exemplar $exemplar)
    {
        if ($exemplar->status !== 'disponivel' || $exemplar->emprestimos()->exists()) {
            return response()->json([
                'message' => 'Não é possível excluir um exemplar que possui empréstimos associados ou está emprestado.'
            ], 409);
        }

        $exemplar->delete();

        return response()->noContent();
    }
}
