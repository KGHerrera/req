<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Compra;
use App\Models\OrdenCompra;
use Illuminate\Support\Facades\Storage;

class CompraController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Validar los datos de la Compra
            $request->validate([
                'no_orden_compra' => 'nullable',
                'proveedor' => 'required|string|max:255',
                'fecha_entrega' => 'nullable|date',
                'IVA' => 'required|numeric|min:0',
                'total' => 'required|numeric|min:0',
                'ordenes_compra' => 'required|array',
                'ordenes_compra.*.precio_unitario' => 'required|numeric|min:0',
                'ordenes_compra.*.importe_parcial' => 'required|numeric|min:0',
                'ordenes_compra.*.id_requisicion' => 'required|integer|exists:requisicions,id_requisicion',
            ]);

            $compraData = $request->only(['proveedor', 'fecha_entrega', 'IVA', 'total']);
            $ordenesCompraData = $request->input('ordenes_compra');

            DB::transaction(function () use ($compraData, $ordenesCompraData) {
                // Crear la Compra
                $compra = Compra::create($compraData);

                // Obtener el ID de la Compra creada
                $idCompra = $compra->no_orden_compra;

                // Crear las Órdenes de Compra asociadas a la Compra
                foreach ($ordenesCompraData as $ordenCompra) {
                    OrdenCompra::create([
                        'precio_unitario' => $ordenCompra['precio_unitario'],
                        'importe_parcial' => $ordenCompra['importe_parcial'],
                        'id_requisicion' => $ordenCompra['id_requisicion'],
                        'no_orden_compra' => $idCompra, // Asignar el ID de la Compra como número de orden de compra
                    ]);
                }
            });

            // Registro de éxito en el log
            Log::info('Compra y órdenes de compra creadas con éxito.', [
                'proveedor' => $compraData['proveedor'],
                'usuario' => $request->user()->email,
            ]);

            return response()->json(['message' => 'Compra y órdenes de compra creadas con éxito.'], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Devolver errores de validación
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Registro de error en el log
            Log::error('Error al crear compra y órdenes de compra.', [
                'message' => $e->getMessage(),
                'request' => $request->all(),
            ]);

            return response()->json(['message' => 'Hubo un problema al crear la compra y las órdenes de compra.'], 500);
        }
    }

    public function index(Request $request)
    {
        try {
            // Obtener los parámetros de búsqueda y paginación
            $search = $request->query('search', '');
            $perPage = $request->query('per_page', 10); // Número de elementos por página
            $page = $request->query('page', 1);

            // Construir la consulta de compras
            $query = Compra::with('ordenesCompra.requisicion');

            // Aplicar filtro de búsqueda si se proporciona
            if (!empty($search)) {
                $query->where('proveedor', 'like', '%' . $search . '%');
            }

            // Ordenar por la fecha de creación en orden descendente
            $query->orderBy('created_at', 'desc'); // Cambia 'created_at' por el campo que desees ordenar

            // Obtener los resultados paginados
            $compras = $query->paginate($perPage, ['*'], 'page', $page);

            // Transformar los datos en el formato deseado
            $data = $compras->map(function ($compra) {
                return [
                    'no_orden_compra' => $compra->no_orden_compra,
                    'proveedor' => $compra->proveedor,
                    'fecha_entrega' => $compra->fecha_entrega,
                    'IVA' => $compra->IVA,
                    'total' => $compra->total,
                    'ordenes_compra' => $compra->ordenesCompra->map(function ($orden) {
                        return [
                            'id_compra' => $orden->id_compra,
                            'precio_unitario' => $orden->precio_unitario,
                            'importe_parcial' => $orden->importe_parcial,
                            'id_requisicion' => $orden->id_requisicion,
                            'folio' => optional($orden->requisicion)->folio,
                            'evidencia_de_entrega' => $orden->evidencia_de_entrega,
                        ];
                    }),
                ];
            });

            return response()->json([
                'data' => $data,
                'current_page' => $compras->currentPage(),
                'last_page' => $compras->lastPage(),
                'per_page' => $compras->perPage(),
                'total' => $compras->total(),
            ], 200);
        } catch (\Exception $e) {
            // Registro de error en el log
            Log::error('Error al obtener las compras.', [
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Hubo un problema al obtener las compras.'], 500);
        }
    }



    public function subirEvidencia($id_compra, Request $request)
    {
        try {
            // Validar la solicitud y la existencia de la orden de compra
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Ajusta los tipos de archivo y el tamaño según tus requisitos
            ]);

            // Obtener la orden de compra por su ID
            $ordenCompra = OrdenCompra::where('id_compra', $id_compra)->firstOrFail();

            // Guardar la imagen en el servidor
            $imagen = $request->file('image');
            $imageName = 'requisicion_' . time() . '.' . $imagen->getClientOriginalExtension();
            $path = $imagen->storeAs('public/evidencias', $imageName);

            // Actualizar el campo de evidencia_entrega en la orden de compra
            $ordenCompra->evidencia_de_entrega = $path;
            $ordenCompra->save();

            return response()->json(['message' => 'Evidencia de entrega subida correctamente.'], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Devolver errores de validación
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Registro de error en el log con detalles adicionales


            return response()->json(['message' => 'Hubo un problema al subir la evidencia de entrega.'], 500);
        }
    }

    public function eliminarEvidencia($id_compra)
    {
        try {
            // Obtener la orden de compra por su ID
            $ordenCompra = OrdenCompra::where('id_compra', $id_compra)->firstOrFail();

            // Verificar si existe una evidencia de entrega asociada
            if ($ordenCompra->evidencia_de_entrega) {
                // Eliminar el archivo físicamente del servidor
                $filePath = storage_path('app/' . $ordenCompra->evidencia_de_entrega);
                if (file_exists($filePath)) {
                    unlink($filePath); // Eliminar archivo
                }

                // Actualizar el campo de evidencia_de_entrega a null
                $ordenCompra->evidencia_de_entrega = null;
                $ordenCompra->save();

                return response()->json(['message' => 'Evidencia de entrega eliminada correctamente.'], 200);
            } else {
                return response()->json(['message' => 'No hay evidencia de entrega asociada a esta orden de compra.'], 404);
            }

        } catch (\Exception $e) {
            // Manejo de errores
            return response()->json(['message' => 'Hubo un problema al eliminar la evidencia de entrega.'], 500);
        }
    }

    public function generateReport($id, Request $request)
    {
        try {
            $compra = Compra::with('ordenesCompra.requisicion')->findOrFail($id);
            $fechaActual = now()->format('d-m-Y');

            \Log::info('Compra Data:', [
                'compra' => $compra->toArray(),
                'areaSolicitante' => $request->input('areaSolicitante'),
                'noOrdenCompra' => $request->input('noOrdenCompra')
            ]);

            $data = [
                'compra' => $compra,
                'ordenes_compra' => $compra->ordenesCompra,
                'logoPath' => public_path('img/logo.png'),
                'logoPath2' => public_path('img/itsj.png'),
                'firmas' => [
                    'MMMD. MANUEL IVAN GALLEGOS PÉREZ<br>JEFE DE DEPARTAMENTO DE RECURSOS MATERIALES',
                    'LIC. CARLOS ISRAEL HERNÁNDEZ GUERRA<br>SUBDIRECTOR DE SERVICIOS ADMINISTRATIVOS'
                ],
                'areaSolicitante' => $request->input('areaSolicitante'),
                'noOrdenCompra' => $request->input('noOrdenCompra'),
                'proveedor' => $compra->proveedor ?? 'N/A',
                'fechaActual' => $fechaActual,
                'fechaEntrega' => $compra->fecha_entrega ?? 'N/A',
            ];

            $pdf = app('dompdf.wrapper')->loadView('reportecompra', $data);
            return $pdf->download('reporte_compra_' . $compra->id . '.pdf');
        } catch (\Exception $e) {
            \Log::error('Error generating report: ' . $e->getMessage());
            return response()->json(['message' => 'Error al generar el reporte'], 500);
        }
    }



}
