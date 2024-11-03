<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationsController extends Controller
{
    /**
     * Create a new notification.
     */
    public function createNotification(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'message' => 'required|string|max:255',
            'folio' => 'required|string|max:15',
        ]);

        $notification = Notification::create([
            'user_id' => $validatedData['user_id'],
            'message' => $validatedData['message'],
            'folio' => $validatedData['folio'],
        ]);

        return response()->json($notification, 201);
    }

    public function getUserNotifications(Request $request)
    {
        $userId = $request->user()->id; // Obtener el ID del usuario autenticado
        $notifications = Notification::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate(5); // Cargar 5 notificaciones por página

        return response()->json([
            'notifications' => $notifications,
            'has_more' => $notifications->hasMorePages(),
        ]);
    }




    public function getUnreadCount($userId)
    {
        $unreadCount = Notification::where('user_id', $userId)
            ->where('viewed', false)
            ->count();

        return response()->json(['unread_count' => $unreadCount]);
    }

    /**
     * Mark a notification as viewed.
     */
    public function markAsViewed($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->viewed = true;
        $notification->save();

        return response()->json($notification);
    }
}
