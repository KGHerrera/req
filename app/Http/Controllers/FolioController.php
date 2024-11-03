<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFolioRequest;
use App\Models\Folio;
use App\Models\Notification;
use App\Models\User;
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
            $role = $user->rol; // Assume the user's role is stored in the 'rol' attribute

            // Validate the new status
            $newEstado = $request->input('estado');
            $motivoRechazo = $request->input('motivo_rechazo');
            $validEstados = ['enviada', 'primera_autorizacion', 'segunda_autorizacion', 'tercera_autorizacion', 'rechazada'];

            if (!in_array($newEstado, $validEstados)) {
                return response()->json(['message' => 'Estado no válido.'], 400);
            }

            // Validate the rejection reason if the new status is "rechazada"
            if ($newEstado === 'rechazada' && empty($motivoRechazo)) {
                return response()->json(['message' => 'Motivo de rechazo es requerido.'], 400);
            }

            // Find the folio by ID
            $folio = Folio::find($id);

            if (!$folio) {
                return response()->json(['message' => 'Folio no encontrado.'], 404);
            }

            // Update the status of the folio and the rejection reason if applicable
            $folio->estado = $newEstado;
            if ($newEstado === 'rechazada') {
                $folio->motivo_rechazo = $motivoRechazo;
            } else {
                $folio->motivo_rechazo = null; // Clear rejection reason if status is not "rechazada"
            }
            $folio->save();

            // Create a notification for the user who submitted the folio
            $notificationMessage = "Tus requisiciones con el folio {$folio->folio} ha sido mandada con el estado de {$newEstado}.";
            Notification::create([
                'user_id' => $folio->user_id, // ID of the user to be notified
                'message' => $notificationMessage,
                'folio' => $folio->folio, // Optional: link to the folio if needed
            ]);

            // Notify users based on the new status
            if ($newEstado === 'primera_autorizacion') {
                $vinculacionUsers = User::where('rol', 'vinculacion')->get();
                foreach ($vinculacionUsers as $vinculacionUser) {
                    Notification::create([
                        'user_id' => $vinculacionUser->id,
                        'message' => "Se ha mandado una nueva requisición con el folio {$folio->folio}.",
                        'folio' => $folio->folio,
                    ]);
                }
            } elseif ($newEstado === 'segunda_autorizacion') {
                $direccionUsers = User::where('rol', 'direccion')->get();
                foreach ($direccionUsers as $direccionUser) {
                    Notification::create([
                        'user_id' => $direccionUser->id,
                        'message' => "Se ha mandado una nueva requisición con el folio {$folio->folio}.",
                        'folio' => $folio->folio,
                    ]);
                }
            } elseif ($newEstado === 'tercera_autorizacion') {
                $direccionUsers = User::where('rol', 'materiales')->get();
                foreach ($direccionUsers as $direccionUser) {
                    Notification::create([
                        'user_id' => $direccionUser->id,
                        'message' => "Se ha mandado una nueva requisición con el folio {$folio->folio}.",
                        'folio' => $folio->folio,
                    ]);
                }
            }

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
