<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFolioRequest;
use App\Models\Folio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FolioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $folios = Folio::all();
        return response()->json($folios);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFolioRequest $request)
    {
        $validatedData = $request->validated();
        $folio = Folio::create($validatedData);
        return response()->json(['message' => 'Folio creado con éxito.', 'folio' => $folio], 201);
    }


    public function updateFolioEstado(Request $request, $id)
    {
        try {
            $user = $request->user();
            $role = $user->rol; // Asume que el rol del usuario está almacenado en el atributo 'rol'

            // Validar el nuevo estado
            $newEstado = $request->input('estado');
            $motivoRechazo = $request->input('motivo_rechazo');
            $validEstados = ['enviada', 'primera_autorizacion', 'segunda_autorizacion', 'tercera_autorizacion', 'rechazada'];

            if (!in_array($newEstado, $validEstados)) {
                return response()->json(['message' => 'Estado no válido.'], 400);
            }

            // Validar el motivo de rechazo si el nuevo estado es "rechazada"
            if ($newEstado === 'rechazada' && empty($motivoRechazo)) {
                return response()->json(['message' => 'Motivo de rechazo es requerido.'], 400);
            }

            // Encontrar el folio por ID
            $folio = Folio::find($id);

            if (!$folio) {
                return response()->json(['message' => 'Folio no encontrado.'], 404);
            }

            // Actualizar el estado del folio y el motivo de rechazo si aplica
            $folio->estado = $newEstado;
            if ($newEstado === 'rechazada') {
                $folio->motivo_rechazo = $motivoRechazo;
            } else {
                $folio->motivo_rechazo = null; // Limpiar el motivo de rechazo si el estado no es "rechazada"
            }
            $folio->save();

            return response()->json(['message' => 'Estado del folio actualizado correctamente.'], 200);
        } catch (\Exception $e) {
            Log::error('Error al actualizar el estado del folio.', [
                'message' => $e->getMessage(),
                'folio_id' => $id,
                'user_id' => $user->id
            ]);

            return response()->json(['message' => 'Hubo un problema al actualizar el estado del folio.'], 500);
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(Folio $folio)
    {
        return response()->json($folio);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
