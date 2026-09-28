<?php

namespace App\Http\Controllers;

use App\Models\Livro;
use Illuminate\Http\Request;

class LivroController extends Controller
{
    public function index()
    {
        $livros = Livro::with(['autores', 'generos', 'exemplares'])->get();

        return response()->json($livros);
    }

    public function store(Request $request)
    {
        $dados = $request->validate([
            'titulo' => ['required', 'string', 'max:150'],
            'isbn' => ['required', 'string', 'max:20'],
            'sinopse' => ['required', 'string'],
            'capa' => ['required', 'string', 'max:200'],
            'ano_publicacao' => ['required', 'integer'],
        ]);

        $livro = Livro::create($dados);

        return response()->json($livro, 201);
    }

    public function show(Livro $livro)
    {
        $livro->load(['autores', 'generos', 'exemplares']);

        return response()->json($livro);
    }

    public function update(Request $request, Livro $livro)
    {
        $dados = $request->validate([
            'titulo' => ['sometimes', 'string', 'max:150'],
            'isbn' => ['sometimes', 'string', 'max:20'],
            'sinopse' => ['sometimes', 'string'],
            'capa' => ['sometimes', 'string', 'max:200'],
            'ano_publicacao' => ['sometimes', 'integer'],
        ]);

        $livro->update($dados);

        return response()->json($livro);
    }

    public function destroy(Livro $livro)
    {
        $livro->delete();

        return response()->json(null, 204);
    }
}