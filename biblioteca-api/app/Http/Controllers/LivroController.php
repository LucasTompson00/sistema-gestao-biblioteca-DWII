<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLivroRequest;
use App\Http\Requests\UpdateLivroRequest;
use App\Models\Livro;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

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

        $arquivoCapa = $dados['arquivo_capa'] ?? null;

        unset($dados['arquivo_capa']);

        if ($arquivoCapa) {
            $dados['capa'] = $arquivoCapa->store('capas', 'public');
        }

        try {
            $livro = DB::transaction(function () use ($dados) {
                $autores = $dados['autores'];
                $generos = $dados['generos'];

                unset($dados['autores'], $dados['generos']);

                $livro = Livro::create($dados);

                $livro->autores()->sync($autores);
                $livro->generos()->sync($generos);

                return $livro;
            });
        } catch (Throwable $erro) {
            if ($arquivoCapa) {
                Storage::disk('public')->delete($dados['capa']);
            }

            throw $erro;
        }

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

        $arquivoCapa = $dados['arquivo_capa'] ?? null;

        unset($dados['arquivo_capa']);

        $capaAntiga = $livro->capa;

        if ($arquivoCapa) {
            $dados['capa'] = $arquivoCapa->store('capas', 'public');
        }

        $capaNova = $dados['capa'] ?? $capaAntiga;

        try {
            DB::transaction(function () use (
                $dados,
                $livro
            ) {
                $autores = $dados['autores'] ?? null;
                $generos = $dados['generos'] ?? null;

                unset($dados['autores'], $dados['generos']);

                $livro->update($dados);

                if ($autores !== null) {
                    $livro->autores()->sync($autores);
                }

                if ($generos !== null) {
                    $livro->generos()->sync($generos);
                }
            });
        } catch (Throwable $erro) {
            if ($arquivoCapa) {
                Storage::disk('public')->delete($capaNova);
            }

            throw $erro;
        }

        if ($capaNova !== $capaAntiga) {
            $this->excluirCapaArmazenada($capaAntiga);
        }

        $livro->load([
            'autores',
            'generos',
            'exemplares',
        ]);

        return response()->json($livro);
    }

    public function downloadCapa(Livro $livro)
    {
        $caminho = $livro->capa;

        if (
            !$caminho ||
            filter_var($caminho, FILTER_VALIDATE_URL) ||
            !Storage::disk('public')->exists($caminho)
        ) {
            return response()->json([
                'message' => 'Arquivo de capa não encontrado.',
            ], 404);
        }

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disco */
        $disco = Storage::disk('public');

        return $disco->download(
            $caminho,
            basename($caminho)
        );
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

        $this->excluirCapaArmazenada($livro->capa);

        return response()->noContent();
    }

    private function excluirCapaArmazenada(?string $caminho): void
    {
        if (
            $caminho &&
            !filter_var($caminho, FILTER_VALIDATE_URL)
        ) {
            Storage::disk('public')->delete($caminho);
        }
    }
}
