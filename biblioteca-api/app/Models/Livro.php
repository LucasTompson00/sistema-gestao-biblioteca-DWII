<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['titulo', 'isbn', 'sinopse', 'capa', 'ano_publicacao'])]
class Livro extends Model
{
    protected $table = 'livros';

    public function autores()
    {
        return $this->belongsToMany(Autor::class);
    }

    public function generos()
    {
        return $this->belongsToMany(Genero::class);
    }

    public function exemplares()
    {
        return $this->hasMany(Exemplar::class);
    }
}