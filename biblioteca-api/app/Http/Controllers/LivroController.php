<?php

namespace App\Http\Controllers;

use App\Models\Livro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
            'autores' => ['required', 'array', 'min:1'],
            'autores.*' => ['integer', 'distinct', 'exists:autores,id'],
            'generos' => ['required', 'array', 'min:1'],
            'generos.*' => ['integer', 'distinct', 'exists:generos,id'],
        ]);

        $livro = DB::transaction(function () use ($dados) {
            $autores = $dados['autores'];
            $generos = $dados['generos'];

            unset($dados['autores'], $dados['generos']);

            $livro = Livro::create($dados);

            $livro->autores()->sync($autores);
            $livro->generos()->sync($generos);

            return $livro;
        });

        $livro->load(['autores', 'generos', 'exemplares']);

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
            'titulo' => ['sometimes', 'required', 'string', 'max:150'],
            'isbn' => ['sometimes', 'required', 'string', 'max:20'],
            'sinopse' => ['sometimes', 'required', 'string'],
            'capa' => ['sometimes', 'required', 'string', 'max:200'],
            'ano_publicacao' => ['sometimes', 'required', 'integer'],
            'autores' => ['sometimes', 'array', 'min:1'],
            'autores.*' => ['integer', 'distinct', 'exists:autores,id'],
            'generos' => ['sometimes', 'array', 'min:1'],
            'generos.*' => ['integer', 'distinct', 'exists:generos,id'],
        ]);

        $autores = $dados['autores'] ?? null;
        $generos = $dados['generos'] ?? null;

        unset($dados['autores'], $dados['generos']);

        DB::transaction(function () use ($dados, $livro, $autores, $generos) {
            $livro->update($dados);

            if ($autores !== null) {
                $livro->autores()->sync($autores);
            }

            if ($generos !== null) {
                $livro->generos()->sync($generos);
            }
        });

        $livro->load(['autores', 'generos', 'exemplares']);

        return response()->json($livro);
    }

    public function destroy(Livro $livro)
    {
        if ($livro->exemplares()->exists()) {
            return response()->json([
                'message' => 'Não é possível excluir um livro que possui exemplares cadastrados.',
            ], 409);
        }

        DB::transaction(function () use ($livro) {
            $livro->autores()->detach();
            $livro->generos()->detach();
            $livro->delete();
        });

        return response()->noContent();
    }
}
