<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emprestimos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios');
            $table->foreignId('exemplar_id')->constrained('exemplares');
            $table->timestamp('data_emprestimo');
            $table->date('data_prevista');
            $table->timestamp('data_devolucao')->nullable();
            $table->string('situacao', 20);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emprestimos');
    }
};