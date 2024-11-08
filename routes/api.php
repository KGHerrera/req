<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompraController;
use App\Http\Controllers\FolioController;
use App\Http\Controllers\FolioRequisicionController;
use App\Http\Controllers\NotificationsController;
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
    // Otras rutas...
    Route::get('users', [UserController::class, 'index']);
    Route::post('users', [UserController::class, 'store']);
    Route::put('users/{user}', [UserController::class, 'update']);
    Route::delete('users/{user}', [UserController::class, 'destroy']);

    // Ruta para crear folio y requisiciones
    Route::post('folio-requisicion', [FolioRequisicionController::class, 'store']);

    Route::post('orden-compra', [CompraController::class, 'store']);
    Route::get('ordenes-compra', [CompraController::class, 'index']);

    Route::post('ordenes-compra/{id_compra}/subir-evidencia', [CompraController::class, 'subirEvidencia']);
    Route::delete('ordenes-compra/{id_compra}/eliminar-evidencia', [CompraController::class, 'eliminarEvidencia']);


    Route::get('/notifications/unread-count/{userId}', [NotificationsController::class, 'getUnreadCount']);

    // Ruta para obtener las notificaciones con paginación
    Route::get('/notifications', [NotificationsController::class, 'getUserNotifications']);

    // Ruta para marcar una notificación como vista
    Route::post('/notifications/{id}/mark-as-viewed', [NotificationsController::class, 'markAsViewed']);
});
