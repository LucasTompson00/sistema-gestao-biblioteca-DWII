<?php

namespace App\Http\Controllers;

use App\Models\Genero;
use Illuminate\Http\Request;

class GeneroController extends Controller
{
    public function index()
    {
        $generos = Genero::with('livros')->get();

        return response()->json($generos);
    }

    public function store(Request $request)
    {
        $dados = $request->validate([
            'nome' => 'required|string|max:255',
        ]);

        $genero = Genero::create($dados);

        return response()->json($genero, 201);
    }

    public function show(Genero $genero)
    {
        $genero->load('livros');

        return response()->json($genero);
    }

    public function update(Request $request, Genero $genero)
    {
        $dados = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
        ]);

        $genero->update($dados);

        return response()->json($genero);
    }

    public function destroy(Genero $genero)
    {
        $genero->delete();

        return response()->noContent();
    }
}