<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateExemplarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'livro_id' => ['sometimes', 'required', 'exists:livros,id'],
            'codigo' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('exemplares', 'codigo')->ignore($this->route('exemplar')->id),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'livro_id.required' => 'Selecione um livro.',
            'livro_id.exists' => 'O livro selecionado não existe.',
            'codigo.required' => 'O código do exemplar é obrigatório.',
            'codigo.string' => 'O código deve ser um texto.',
            'codigo.max' => 'O código deve ter no máximo 50 caracteres.',
            'codigo.unique' => 'Já existe um exemplar com este código.',
        ];
    }
}
