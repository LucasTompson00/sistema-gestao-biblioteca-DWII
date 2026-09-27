<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['nome'])]
class Genero extends Model
{
    protected $table = 'generos';

    public function livros()
    {
        return $this->belongsToMany(Livro::class);
    }
}