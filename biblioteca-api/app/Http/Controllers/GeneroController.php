<?php

namespace App\Http\Controllers;

use App\Models\Genero;
use App\Http\Requests\StoreGeneroRequest;
use App\Http\Requests\UpdateGeneroRequest;

class GeneroController extends Controller
{
    public function index()
    {
        $generos = Genero::with('livros')->get();

        return response()->json($generos);
    }

    public function store(StoreGeneroRequest $request)
    {
        $dados = $request->validated();

        $genero = Genero::create($dados);
        $genero->load('livros');

        return response()->json($genero, 201);
    }

    public function show(Genero $genero)
    {
        $genero->load('livros');

        return response()->json($genero);
    }

    public function update(UpdateGeneroRequest $request, Genero $genero)
    {
        $dados = $request->validated();

        $genero->update($dados);
        $genero->load('livros');

        return response()->json($genero);
    }

    public function destroy(Genero $genero)
    {
        if ($genero->livros()->exists()) {
            return response()->json([
                'message' => 'Não é possível excluir um gênero que possui livros associados.'
            ], 409);
        }

        $genero->delete();

        return response()->noContent();
    }
}
