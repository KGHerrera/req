<?php

namespace App\Http\Controllers;

use App\Models\Folio;
use App\Models\Requisicion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; // Importa la clase Log

class FolioRequisicionController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Validar los datos del Folio
            $request->validate([
                'folio' => 'required|string|max:10|unique:folios,folio',
                'fecha_solicitud' => 'required|date',
                'fecha_entrega' => 'nullable|date',
                'total_estimado' => 'required|numeric|min:0',
                'estado' => 'required|string|max:20',
                'clave_departamento' => 'required|string|exists:departamentos,clave_departamento|max:10',
            ]);

            // Validar los datos de las Requisiciones
            $requisicionData = $request->validate([
                'requisiciones' => 'required|array',
                'requisiciones.*.partida_presupuestal' => 'required|string|max:6',
                'requisiciones.*.cantidad' => 'required|integer|min:1',
                'requisiciones.*.unidad' => 'required|string|max:20',
                'requisiciones.*.descripcion_bienes_servicios' => 'required|string|max:100',
                'requisiciones.*.costo_estimado' => 'required|numeric|min:0',
            ]);

            DB::transaction(function () use ($request, $requisicionData) {
                // Crear el Folio
                $folio = Folio::create($request->only([
                    'folio',
                    'fecha_solicitud',
                    'fecha_entrega',
                    'total_estimado',
                    'estado',
                    'clave_departamento'
                ]));

                // Crear las Requisiciones asociadas al Folio
                foreach ($requisicionData['requisiciones'] as $requisicion) {
                    $requisicion['folio'] = $folio->folio;
                    Requisicion::create($requisicion);
                }
            });

            // Registro de éxito en el log
            Log::info('Folio y requisiciones creadas con éxito.', [
                'folio' => $request->input('folio'),
                'usuario' => $request->user()->email // Ejemplo: Registro del usuario que realizó la acción
            ]);

            return response()->json(['message' => 'Folio y requisiciones creadas con éxito.'], 201);

        } catch (\Exception $e) {
            // Registro de error en el log
            Log::error('Error al crear folio y requisiciones.', [
                'message' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json(['message' => 'Hubo un problema al crear el folio y las requisiciones.'], 500);
        }
    }
}
