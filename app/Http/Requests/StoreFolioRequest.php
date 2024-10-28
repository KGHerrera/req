<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFolioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // Aquí puedes agregar la lógica para determinar si el usuario está autorizado para hacer esta solicitud.
        // Por defecto, devuelve true para permitir que cualquier usuario autenticado haga esta solicitud.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'folio' => 'required|string|max:15|unique:folios,folio',
            'fecha_solicitud' => 'required|date',
            'fecha_entrega' => 'nullable|date|after_or_equal:fecha_solicitud',
            'total_estimado' => 'required|numeric|min:0',
            'estado' => 'required|string|max:20',
            'clave_departamento' => 'required|string',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'folio.required' => 'El folio es obligatorio.',
            'folio.string' => 'El folio debe ser una cadena de texto.',
            'folio.max' => 'El folio no puede tener más de 15 caracteres.',
            'folio.unique' => 'El folio ya existe.',
            'fecha_solicitud.required' => 'La fecha de solicitud es obligatoria.',
            'fecha_solicitud.date' => 'La fecha de solicitud no tiene un formato válido.',
            'fecha_entrega.date' => 'La fecha de entrega no tiene un formato válido.',
            'fecha_entrega.after_or_equal' => 'La fecha de entrega debe ser igual o posterior a la fecha de solicitud.',
            'total_estimado.required' => 'El total estimado es obligatorio.',
            'total_estimado.numeric' => 'El total estimado debe ser un número.',
            'total_estimado.min' => 'El total estimado no puede ser negativo.',
            'estado.required' => 'El estado es obligatorio.',
            'estado.string' => 'El estado debe ser una cadena de texto.',
            'estado.max' => 'El estado no puede tener más de 20 caracteres.',
            'clave_departamento.required' => 'La clave del departamento es obligatoria.',
            'clave_departamento.string' => 'La clave del departamento debe ser una cadena de texto.',
        ];
    }
}

