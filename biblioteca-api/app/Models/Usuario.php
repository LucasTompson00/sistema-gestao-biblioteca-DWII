<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;

#[Fillable(['nome', 'email', 'senha', 'perfil', 'ativo'])]
#[Hidden(['senha', 'remember_token'])]
class Usuario extends Authenticatable
{
    use HasFactory, Notifiable;

    protected function casts(): array
    {
        return [
            'senha' => 'hashed',
            'ativo' => 'boolean',
        ];
    }

    public function getAuthPassword()
    {
        return $this->senha;
    }

    public function emprestimos()
    {
        return $this->hasMany(Emprestimo::class);
    }
}