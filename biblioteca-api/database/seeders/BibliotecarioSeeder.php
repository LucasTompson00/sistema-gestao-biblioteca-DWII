<?php

namespace Database\Seeders;

use App\Models\Usuario;
use Illuminate\Database\Seeder;
use RuntimeException;

class BibliotecarioSeeder extends Seeder
{
    public function run(): void
    {
        $senha = config('biblioteca.bibliotecario.senha');

        if (!is_string($senha) || trim($senha) === '') {
            throw new RuntimeException(
                'A senha deve ser igual a do arquivo .env.'
            );
        }

        Usuario::updateOrCreate(
            [
                'email' => config('biblioteca.bibliotecario.email'),
            ],
            [
                'nome' => config('biblioteca.bibliotecario.nome'),
                'senha' => $senha,
                'perfil' => 'bibliotecario',
                'ativo' => true,
            ]
        );
    }
}
