<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::rename('users', 'usuarios');

        Schema::table('usuarios', function (Blueprint $table) {
            $table->renameColumn('name', 'nome');
            $table->renameColumn('password', 'senha');
            $table->string('perfil', 30)->default('usuario');
            $table->boolean('ativo')->default(true);
        });
    }

    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->dropColumn(['perfil', 'ativo']);
            $table->renameColumn('nome', 'name');
            $table->renameColumn('senha', 'password');
        });

        Schema::rename('usuarios', 'users');
    }
};