<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Support\Facades\Storage;

#[Fillable(['titulo', 'isbn', 'sinopse', 'capa', 'ano_publicacao'])]
class Livro extends Model
{
    protected $table = 'livros';

    protected $appends = ['capa_url'];

    public function getCapaUrlAttribute(): ?string
    {
        $capa = $this->attributes['capa'] ?? null;

        if (!$capa) {
            return null;
        }

        if (filter_var($capa, FILTER_VALIDATE_URL)) {
            return $capa;
        }

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disco */
        $disco = Storage::disk('public');

        return $disco->url($capa);
    }

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
