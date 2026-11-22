<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmprestimoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'data_prevista' => 'required|date|after_or_equal:today',
        ];
    }

    public function messages(): array
    {
        return [
            'data_prevista.required' => 'A data prevista é obrigatória.',
            'data_prevista.date' => 'Informe uma data válida.',
            'data_prevista.after_or_equal' => 'A data prevista não pode ser anterior à data atual.',
        ];
    }
}
