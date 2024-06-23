<?php

namespace App\Http\Requests;

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'rol' => 'required|string|max:255',
            'clave_departamento' => 'required|string|exists:departamentos,clave_departamento',
            'password' => [
                'required',
                Password::min(8)->letters()
            ]
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El campo nombre es obligatorio.',
            'name.string' => 'El campo nombre debe ser una cadena de texto.',
            'name.max' => 'El campo nombre no debe exceder los 255 caracteres.',
            
            'email.required' => 'El campo correo electrónico es obligatorio.',
            'email.email' => 'El campo correo electrónico debe ser una dirección de correo válida.',
            'email.unique' => 'El correo electrónico ya está registrado.',
            
            'rol.required' => 'El campo rol es obligatorio.',
            'rol.string' => 'El campo rol debe ser una cadena de texto.',
            'rol.max' => 'El campo rol no debe exceder los 255 caracteres.',
            
            'clave_departamento.required' => 'El campo clave de departamento es obligatorio.',
            'clave_departamento.string' => 'El campo clave de departamento debe ser una cadena de texto.',
            'clave_departamento.exists' => 'La clave de departamento no existe.',
            
            'password.required' => 'El campo contraseña es obligatorio.',
            'password.min' => 'El campo contraseña debe tener al menos 8 caracteres.',
            'password.letters' => 'El campo contraseña debe contener al menos una letra.'
        ];
    }
}

