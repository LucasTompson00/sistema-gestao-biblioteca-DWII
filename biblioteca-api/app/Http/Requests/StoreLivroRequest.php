<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLivroRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titulo' => ['required', 'string', 'max:150'],
            'isbn' => ['required', 'string', 'max:20', 'unique:livros,isbn'],
            'sinopse' => ['required', 'string'],
            'capa' => ['required_without:arquivo_capa', 'nullable', 'string', 'max:200'],
            'arquivo_capa' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'ano_publicacao' => ['required', 'integer'],
            'autores' => ['required', 'array', 'min:1'],
            'autores.*' => ['integer', 'distinct', 'exists:autores,id'],
            'generos' => ['required', 'array', 'min:1'],
            'generos.*' => ['integer', 'distinct', 'exists:generos,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'titulo.required' => 'O título do livro é obrigatório.',
            'isbn.required' => 'O ISBN é obrigatório.',
            'sinopse.required' => 'A sinopse é obrigatória.',
            'capa.required_without' => 'Informe um endereço de capa ou envie uma imagem.',
            'capa.string' => 'O endereço da capa deve ser um texto.',
            'arquivo_capa.image' => 'O arquivo enviado deve ser uma imagem.',
            'arquivo_capa.mimes' => 'A capa deve estar nos formatos JPG, JPEG, PNG ou WEBP.',
            'arquivo_capa.max' => 'A imagem da capa deve ter no máximo 2 MB.',
            'ano_publicacao.required' => 'O ano de publicação é obrigatório.',
            'ano_publicacao.integer' => 'O ano de publicação deve ser um número.',
            'autores.required' => 'Selecione pelo menos um autor.',
            'autores.array' => 'Os autores devem ser enviados em uma lista.',
            'autores.min' => 'Selecione pelo menos um autor.',
            'autores.*.exists' => 'Um dos autores selecionados não existe.',
            'generos.required' => 'Selecione pelo menos um gênero.',
            'generos.array' => 'Os gêneros devem ser enviados em uma lista.',
            'generos.min' => 'Selecione pelo menos um gênero.',
            'generos.*.exists' => 'Um dos gêneros selecionados não existe.',
            'isbn.unique' => 'Este ISBN já está cadastrado.',
        ];
    }
}
