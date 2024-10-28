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
                'fecha_solicitud' => 'required|date',
                'fecha_entrega' => 'nullable|date',
                'total_estimado' => 'required|numeric|min:0',
                'estado' => 'required|string|max:20',
                'clave_departamento' => 'required|string',
                'user_id' => 'required|integer|exists:users,id',
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

            $newFolio = '';

            DB::transaction(function () use ($request, $requisicionData, &$newFolio) {
                // Generar el folio
                $clave_departamento = $request->input('clave_departamento');
                $fecha_solicitud = $request->input('fecha_solicitud');
                $year = date('Y', strtotime($fecha_solicitud));

                // Obtener el último folio generado para la clave_departamento y el año actual
                $lastFolio = Folio::where('clave_departamento', $clave_departamento)
                    ->whereYear('fecha_solicitud', $year)
                    ->orderBy('folio', 'desc')
                    ->first();

                if ($lastFolio) {
                    // Extraer el número de secuencia del último folio
                    $lastSequence = (int)substr($lastFolio->folio, -2);
                    $newSequence = str_pad($lastSequence + 1, 2, '0', STR_PAD_LEFT);
                } else {
                    // Si no hay folios anteriores, empezar desde 01
                    $newSequence = '01';
                }

                $newFolio = $clave_departamento . $year . '-' . $newSequence;

                // Crear el Folio
                $folio = Folio::create([
                    'folio' => $newFolio,
                    'fecha_solicitud' => $request->input('fecha_solicitud'),
                    'fecha_entrega' => $request->input('fecha_entrega'),
                    'total_estimado' => $request->input('total_estimado'),
                    'estado' => $request->input('estado'),
                    'clave_departamento' => $request->input('clave_departamento'),
                    'user_id' => $request->input('user_id'),
                ]);

                // Crear las Requisiciones asociadas al Folio
                foreach ($requisicionData['requisiciones'] as $requisicion) {
                    $requisicion['folio'] = $folio->folio;
                    Requisicion::create($requisicion);
                }
            });

            // Registro de éxito en el log
            Log::info('Folio y requisiciones creadas con éxito.', [
                'folio' => $newFolio,
                'usuario' => $request->user()->email // Ejemplo: Registro del usuario que realizó la acción
            ]);

            return response()->json(['message' => 'Folio y requisiciones creadas con éxito.'], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Devolver errores de validación
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Registro de error en el log
            Log::error('Error al crear folio y requisiciones.', [
                'message' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json(['message' => 'Hubo un problema al crear el folio y las requisiciones.'], 500);
        }
    }

    public function getFoliosByUser(Request $request, $userId)
    {
        try {
            $query = Folio::where('user_id', $userId)->with('requisiciones')->orderBy('created_at', 'desc');

            // Búsqueda por término
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('folio', 'like', "%$searchTerm%")
                        ->orWhere('fecha_solicitud', 'like', "%$searchTerm%")
                        ->orWhere('fecha_entrega', 'like', "%$searchTerm%")
                        ->orWhere('total_estimado', 'like', "%$searchTerm%")
                        ->orWhere('estado', 'like', "%$searchTerm%")
                        ->orWhere('clave_departamento', 'like', "%$searchTerm%")
                        ->orWhereHas('requisiciones', function ($qr) use ($searchTerm) {
                            $qr->where('descripcion_bienes_servicios', 'like', "%$searchTerm%");
                        });
                });
            }

            // Paginación
            $folios = $query->paginate(6); // 5 registros por página por defecto

            // Si no se encuentran folios, devolver un mensaje apropiado
            if ($folios->isEmpty()) {
                return response()->json(['message' => 'No se encontraron folios para este usuario.'], 404);
            }

            // Devolver los folios paginados con sus requisiciones
            return response()->json($folios, 200);
        } catch (\Exception $e) {
            Log::error('Error al obtener folios y requisiciones por usuario.', [
                'message' => $e->getMessage(),
                'user_id' => $userId
            ]);

            return response()->json(['message' => 'Hubo un problema al obtener los folios y las requisiciones.'], 500);
        }
    }

    public function getFoliosByUserRole(Request $request)
    {
        try {
            $user = $request->user();
            $role = $user->rol; // Asume que el rol del usuario está almacenado en el atributo 'role'

            // Determina el estado según el rol del usuario
            $estado = match ($role) {
                'financiero' => 'enviada',
                'vinculacion' => 'primera_autorizacion',
                'direccion' => 'segunda_autorizacion',
                'materiales' => 'tercera_autorizacion',
                default => null,
            };

            if (is_null($estado)) {
                return response()->json(['message' => 'Rol de usuario no válido.'], 403);
            }

            $query = Folio::where('estado', $estado)
                          ->with('requisiciones')
                          ->orderBy('created_at', 'desc');

            // Búsqueda por término
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('folio', 'like', "%$searchTerm%")
                      ->orWhere('fecha_solicitud', 'like', "%$searchTerm%")
                      ->orWhere('fecha_entrega', 'like', "%$searchTerm%")
                      ->orWhere('total_estimado', 'like', "%$searchTerm%")
                      ->orWhere('estado', 'like', "%$searchTerm%")
                      ->orWhere('clave_departamento', 'like', "%$searchTerm%")
                      ->orWhereHas('requisiciones', function ($qr) use ($searchTerm) {
                          $qr->where('descripcion_bienes_servicios', 'like', "%$searchTerm%");
                      });
                });
            }

            // Paginación
            $folios = $query->paginate(6); // 6 registros por página

            // Si no se encuentran folios, devolver un mensaje apropiado
            if ($folios->isEmpty()) {
                return response()->json(['message' => 'No se encontraron folios para este usuario con el estado especificado.'], 404);
            }

            // Devolver los folios paginados con sus requisiciones
            return response()->json($folios, 200);
        } catch (\Exception $e) {
            Log::error('Error al obtener folios y requisiciones por rol de usuario.', [
                'message' => $e->getMessage(),
                'user_id' => $user->id
            ]);

            return response()->json(['message' => 'Hubo un problema al obtener los folios y las requisiciones.'], 500);
        }
    }
}
