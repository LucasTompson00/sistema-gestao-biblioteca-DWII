<?php

namespace App\Http\Controllers;

use App\Models\Exemplar;
use Illuminate\Http\Request;

class ExemplarController extends Controller
{
    public function index()
    {
        $exemplares = Exemplar::with('livro')->get();

        return response()->json($exemplares);
    }

    public function store(Request $request)
    {
        $dados = $request->validate([
            'livro_id' => 'required|exists:livros,id',
            'codigo' => 'required|string|max:50',
            'status' => 'required|string|max:20',
        ]);

        $exemplar = Exemplar::create($dados);

        return response()->json($exemplar, 201);
    }

    public function show(Exemplar $exemplar)
    {
        $exemplar->load('livro');

        return response()->json($exemplar);
    }

    public function update(Request $request, Exemplar $exemplar)
    {
        $dados = $request->validate([
            'livro_id' => 'sometimes|required|exists:livros,id',
            'codigo' => 'sometimes|required|string|max:50',
            'status' => 'sometimes|required|string|max:20',
        ]);

        $exemplar->update($dados);

        return response()->json($exemplar);
    }

    public function destroy(Exemplar $exemplar)
    {
        $exemplar->delete();

        return response()->noContent();
    }
}