<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['nome', 'biografia'])]
class Autor extends Model
{
    protected $table = 'autores';

    public function livros()
    {
        return $this->belongsToMany(Livro::class);
    }
}