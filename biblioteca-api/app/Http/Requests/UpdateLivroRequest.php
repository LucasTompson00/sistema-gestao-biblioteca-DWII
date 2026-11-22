<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLivroRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titulo' => ['sometimes', 'required', 'string', 'max:150'],
            'isbn' => ['sometimes', 'required', 'string', 'max:20'],
            'sinopse' => ['sometimes', 'required', 'string'],
            'capa' => ['sometimes', 'required', 'string', 'max:200'],
            'ano_publicacao' => ['sometimes', 'required', 'integer'],
            'autores' => ['sometimes', 'required', 'array', 'min:1'],
            'autores.*' => ['integer', 'distinct', 'exists:autores,id'],
            'generos' => ['sometimes', 'required', 'array', 'min:1'],
            'generos.*' => ['integer', 'distinct', 'exists:generos,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'titulo.required' => 'O título do livro é obrigatório.',
            'isbn.required' => 'O ISBN é obrigatório.',
            'sinopse.required' => 'A sinopse é obrigatória.',
            'capa.required' => 'A capa do livro é obrigatória.',
            'ano_publicacao.required' => 'O ano de publicação é obrigatório.',
            'ano_publicacao.integer' => 'O ano de publicação deve ser um número.',
            'autores.required' => 'Selecione pelo menos um autor.',
            'autores.*.exists' => 'Um dos autores selecionados não existe.',
            'generos.required' => 'Selecione pelo menos um gênero.',
            'generos.*.exists' => 'Um dos gêneros selecionados não existe.',
        ];
    }
}
