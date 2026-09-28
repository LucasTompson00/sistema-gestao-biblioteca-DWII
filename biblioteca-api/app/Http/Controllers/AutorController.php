<?php

namespace App\Http\Controllers;

use App\Models\Autor;
use Illuminate\Http\Request;

class AutorController extends Controller
{
    public function index()
    {
        $autores = Autor::with('livros')->get();

        return response()->json($autores);
    }

    public function store(Request $request)
    {
        $dados = $request->validate([
            'nome' => 'required|string|max:255',
        ]);

        $autor = Autor::create($dados);

        return response()->json($autor, 201);
    }

    public function show(Autor $autor)
    {
        $autor->load('livros');

        return response()->json($autor);
    }

    public function update(Request $request, Autor $autor)
    {
        $dados = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
        ]);

        $autor->update($dados);

        return response()->json($autor);
    }

    public function destroy(Autor $autor)
    {
        $autor->delete();

        return response()->noContent();
    }
}