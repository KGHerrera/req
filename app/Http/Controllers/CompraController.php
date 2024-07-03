<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Compra;
use App\Models\OrdenCompra;

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
}
