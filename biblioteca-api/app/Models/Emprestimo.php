<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'usuario_id',
    'exemplar_id',
    'data_emprestimo',
    'data_prevista',
    'data_devolucao',
    'situacao'
])]
class Emprestimo extends Model
{
    protected $table = 'emprestimos';

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function exemplar()
    {
        return $this->belongsTo(Exemplar::class);
    }
}