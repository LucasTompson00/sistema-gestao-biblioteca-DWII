<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('autor_livro', function (Blueprint $table) {
            $table->foreignId('autor_id')->constrained('autores');
            $table->foreignId('livro_id')->constrained('livros');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('autor_livro');
    }
};