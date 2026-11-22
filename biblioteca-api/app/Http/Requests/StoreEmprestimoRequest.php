<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmprestimoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'usuario_id' => 'required|exists:usuarios,id',
            'exemplar_id' => 'required|exists:exemplares,id',
            'data_prevista' => 'required|date|after_or_equal:today',
        ];
    }

    public function messages(): array
    {
        return [
            'usuario_id.required' => 'Selecione um usuário.',
            'usuario_id.exists' => 'O usuário selecionado não existe.',
            'exemplar_id.required' => 'Selecione um exemplar.',
            'exemplar_id.exists' => 'O exemplar selecionado não existe.',
            'data_prevista.required' => 'A data prevista é obrigatória.',
            'data_prevista.date' => 'Informe uma data válida.',
            'data_prevista.after_or_equal' => 'A data prevista não pode ser anterior à data atual.',
        ];
    }
}
