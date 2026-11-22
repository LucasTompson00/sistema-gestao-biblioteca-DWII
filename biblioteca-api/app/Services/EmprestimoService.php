<?php

namespace App\Services;

use App\Exceptions\RegraEmprestimoException;
use App\Models\Emprestimo;
use App\Models\Exemplar;
use Illuminate\Support\Facades\DB;

class EmprestimoService
{
    public function registrar(
        int $usuarioId,
        int $exemplarId,
        string $dataPrevista
    ): Emprestimo {
        return DB::transaction(function () use (
            $usuarioId,
            $exemplarId,
            $dataPrevista
        ) {
            $exemplar = Exemplar::whereKey($exemplarId)
                ->lockForUpdate()
                ->firstOrFail();

            $emprestimoAtivo = Emprestimo::where('exemplar_id', $exemplar->id)
                ->where('situacao', 'ativo')
                ->whereNull('data_devolucao')
                ->exists();

            if ($exemplar->status !== 'disponivel' || $emprestimoAtivo) {
                throw new RegraEmprestimoException(
                    'Este exemplar não está disponível para empréstimo.'
                );
            }

            $emprestimo = Emprestimo::create([
                'usuario_id' => $usuarioId,
                'exemplar_id' => $exemplar->id,
                'data_emprestimo' => now(),
                'data_prevista' => $dataPrevista,
                'data_devolucao' => null,
                'situacao' => 'ativo',
            ]);

            $exemplar->update([
                'status' => 'emprestado',
            ]);

            return $emprestimo->load([
                'usuario',
                'exemplar.livro',
            ]);
        });
    }

    public function atualizarPrevisao(
        Emprestimo $emprestimo,
        string $dataPrevista
    ): Emprestimo {
        return DB::transaction(function () use (
            $emprestimo,
            $dataPrevista
        ) {
            $emprestimo = Emprestimo::whereKey($emprestimo->id)
                ->lockForUpdate()
                ->firstOrFail();

            if (
                $emprestimo->situacao !== 'ativo' ||
                $emprestimo->data_devolucao !== null
            ) {
                throw new RegraEmprestimoException(
                    'Não é possível alterar um empréstimo que não está ativo.'
                );
            }

            $emprestimo->update([
                'data_prevista' => $dataPrevista,
            ]);

            return $emprestimo->load([
                'usuario',
                'exemplar.livro',
            ]);
        });
    }

    public function devolver(Emprestimo $emprestimo): Emprestimo
    {
        return DB::transaction(function () use ($emprestimo) {
            $emprestimo = Emprestimo::whereKey($emprestimo->id)
                ->firstOrFail();

            $exemplar = Exemplar::whereKey($emprestimo->exemplar_id)
                ->lockForUpdate()
                ->firstOrFail();

            $emprestimo = Emprestimo::whereKey($emprestimo->id)
                ->lockForUpdate()
                ->firstOrFail();

            if (
                $emprestimo->situacao !== 'ativo' ||
                $emprestimo->data_devolucao !== null
            ) {
                throw new RegraEmprestimoException(
                    'Este empréstimo já foi devolvido ou não está ativo.'
                );
            }

            $emprestimo->update([
                'data_devolucao' => now(),
                'situacao' => 'devolvido',
            ]);

            $exemplar->update([
                'status' => 'disponivel',
            ]);

            return $emprestimo->load([
                'usuario',
                'exemplar.livro',
            ]);
        });
    }


    public function excluir(Emprestimo $emprestimo): void
    {
        DB::transaction(function () use ($emprestimo) {
            $emprestimo = Emprestimo::whereKey($emprestimo->id)
                ->lockForUpdate()
                ->firstOrFail();

            if (
                $emprestimo->situacao !== 'devolvido' ||
                $emprestimo->data_devolucao === null
            ) {
                throw new RegraEmprestimoException(
                    'Não é possível excluir um empréstimo que ainda não foi devolvido.'
                );
            }

            $emprestimo->delete();
        });
    }
}
