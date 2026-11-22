<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLivroRequest;
use App\Http\Requests\UpdateLivroRequest;
use App\Models\Livro;
use Illuminate\Support\Facades\DB;

class LivroController extends Controller
{
    public function index()
    {
        $livros = Livro::with([
            'autores',
            'generos',
            'exemplares',
        ])->get();

        return response()->json($livros);
    }

    public function store(StoreLivroRequest $request)
    {
        $dados = $request->validated();

        $livro = DB::transaction(function () use ($dados) {
            $autores = $dados['autores'];
            $generos = $dados['generos'];

            unset($dados['autores'], $dados['generos']);

            $livro = Livro::create($dados);

            $livro->autores()->sync($autores);
            $livro->generos()->sync($generos);

            return $livro;
        });

        $livro->load([
            'autores',
            'generos',
            'exemplares',
        ]);

        return response()->json($livro, 201);
    }

    public function show(Livro $livro)
    {
        $livro->load([
            'autores',
            'generos',
            'exemplares',
        ]);

        return response()->json($livro);
    }

    public function update(UpdateLivroRequest $request, Livro $livro)
    {
        $dados = $request->validated();

        $autores = $dados['autores'] ?? null;
        $generos = $dados['generos'] ?? null;

        unset($dados['autores'], $dados['generos']);

        DB::transaction(function () use (
            $dados,
            $livro,
            $autores,
            $generos
        ) {
            $livro->update($dados);

            if ($autores !== null) {
                $livro->autores()->sync($autores);
            }

            if ($generos !== null) {
                $livro->generos()->sync($generos);
            }
        });

        $livro->load([
            'autores',
            'generos',
            'exemplares',
        ]);

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
