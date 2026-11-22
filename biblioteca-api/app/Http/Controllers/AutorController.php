<?php

namespace App\Http\Controllers;

use App\Models\Autor;
use App\Http\Requests\StoreAutorRequest;
use App\Http\Requests\UpdateAutorRequest;

class AutorController extends Controller
{
    public function index()
    {
        $autores = Autor::with('livros')->get();

        return response()->json($autores);
    }

    public function store(StoreAutorRequest $request)
    {
        $dados = $request->validated();

        $autor = Autor::create($dados);
        $autor->load('livros');

        return response()->json($autor, 201);
    }

    public function show(Autor $autor)
    {
        $autor->load('livros');

        return response()->json($autor);
    }

    public function update(UpdateAutorRequest $request, Autor $autor)
    {
        $dados = $request->validated();

        $autor->update($dados);
        $autor->load('livros');

        return response()->json($autor);
    }

    public function destroy(Autor $autor)
    {
        if ($autor->livros()->exists()) {
            return response()->json([
                'message' => 'Não é possível excluir um autor que possui livros associados.'
            ], 409);
        }

        $autor->delete();

        return response()->noContent();
    }
}
