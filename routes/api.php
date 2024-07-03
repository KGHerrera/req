<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompraController;
use App\Http\Controllers\FolioController;
use App\Http\Controllers\FolioRequisicionController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rutas públicas que no requieren autenticación
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

// Rutas protegidas que requieren autenticación con Sanctum
Route::middleware('auth:sanctum')->group(function () {

    // Cerrar sesión del usuario
    Route::post('logout', [AuthController::class, 'logout']);

    Route::get('/folios/usuario/{userId}', [FolioRequisicionController::class, 'getFoliosByUser']);

    Route::get('/folio-requisicion/user-role', [FolioRequisicionController::class, 'getFoliosByUserRole']);
    Route::patch('/folios/{id}/estado', [FolioController::class, 'updateFolioEstado']);

    // Obtener información del usuario autenticado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
   

    // Ruta para crear folio y requisiciones
    Route::post('folio-requisicion', [FolioRequisicionController::class, 'store']);

    Route::post('orden-compra', [CompraController::class, 'store']);

    
});
