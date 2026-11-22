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
        $regras = [
            'exemplar_id' => ['required', 'exists:exemplares,id'],
            'data_prevista' => ['required', 'date', 'after_or_equal:today'],
        ];

        if ($this->user()->perfil === 'bibliotecario') {
            $regras['usuario_id'] = ['required', 'exists:usuarios,id'];
        } else {
            $regras['usuario_id'] = ['prohibited'];
        }

        return $regras;
    }

    public function messages(): array
    {
        return [
            'usuario_id.required' => 'Selecione um usuário para o empréstimo.',
            'usuario_id.exists' => 'O usuário selecionado não existe.',
            'usuario_id.prohibited' => 'Você não pode informar outro usuário no empréstimo.',
            'exemplar_id.required' => 'Selecione um exemplar.',
            'exemplar_id.exists' => 'O exemplar selecionado não existe.',
            'data_prevista.required' => 'A data prevista para devolução é obrigatória.',
            'data_prevista.date' => 'Informe uma data válida.',
            'data_prevista.after_or_equal' => 'A data prevista não pode ser anterior à data atual.',
        ];
    }
}
