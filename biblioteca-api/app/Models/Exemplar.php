<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['livro_id', 'codigo', 'status'])]
class Exemplar extends Model
{
    protected $table = 'exemplares';

    public function livro()
    {
        return $this->belongsTo(Livro::class);
    }

    public function emprestimos()
    {
        return $this->hasMany(Emprestimo::class);
    }
}