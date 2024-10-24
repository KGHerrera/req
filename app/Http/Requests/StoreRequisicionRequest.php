<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequisicionRequest extends FormRequest
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
            'partida_presupuestal' => 'required|string|max:6',
            'cantidad' => 'required|integer|min:1',
            'unidad' => 'required|string|max:20',
            'descripcion_bienes_servicios' => 'required|string|max:100',
            'costo_estimado' => 'required|numeric|min:0',
            'folio' => 'required|string|exists:folios,folio|max:15',
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
            'partida_presupuestal.required' => 'La partida presupuestal es obligatoria.',
            'partida_presupuestal.string' => 'La partida presupuestal debe ser una cadena de texto.',
            'partida_presupuestal.max' => 'La partida presupuestal no puede tener más de 6 caracteres.',
            'cantidad.required' => 'La cantidad es obligatoria.',
            'cantidad.integer' => 'La cantidad debe ser un número entero.',
            'cantidad.min' => 'La cantidad debe ser al menos 1.',
            'unidad.required' => 'La unidad es obligatoria.',
            'unidad.string' => 'La unidad debe ser una cadena de texto.',
            'unidad.max' => 'La unidad no puede tener más de 20 caracteres.',
            'descripcion_bienes_servicios.required' => 'La descripción de bienes y servicios es obligatoria.',
            'descripcion_bienes_servicios.string' => 'La descripción de bienes y servicios debe ser una cadena de texto.',
            'descripcion_bienes_servicios.max' => 'La descripción de bienes y servicios no puede tener más de 100 caracteres.',
            'costo_estimado.required' => 'El costo estimado es obligatorio.',
            'costo_estimado.numeric' => 'El costo estimado debe ser un número.',
            'costo_estimado.min' => 'El costo estimado no puede ser negativo.',
            'folio.required' => 'El folio es obligatorio.',
            'folio.string' => 'El folio debe ser una cadena de texto.',
            'folio.exists' => 'El folio no existe.',
            'folio.max' => 'El folio no puede tener más de 10 caracteres.',
        ];
    }
}

