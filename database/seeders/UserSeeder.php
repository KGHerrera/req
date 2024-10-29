<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        $users = [
            ['name' => 'admin', 'email' => 'admin@gmail.com', 'rol' => 'admin', 'clave_departamento' => 'ADM'],
            ['name' => 'user', 'email' => 'user@gmail.com', 'rol' => 'user', 'clave_departamento' => 'D001'],
            ['name' => 'financiero', 'email' => 'financiero@gmail.com', 'rol' => 'financiero', 'clave_departamento' => 'D002'],
            ['name' => 'vinculacion', 'email' => 'vinculacion@gmail.com', 'rol' => 'vinculacion', 'clave_departamento' => 'D003'],
            ['name' => 'direccion', 'email' => 'direccion@gmail.com', 'rol' => 'direccion', 'clave_departamento' => 'D004'],
            ['name' => 'materiales', 'email' => 'materiales@gmail.com', 'rol' => 'materiales', 'clave_departamento' => 'D005'],
        ];

        foreach ($users as $userData) {
            User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'rol' => $userData['rol'],
                'clave_departamento' => $userData['clave_departamento'],
                'password' => Hash::make('password'), // Cifrado de la contraseña
            ]);
        }
    }
}


