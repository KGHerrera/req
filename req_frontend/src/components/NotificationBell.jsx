import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import axiosClient from '../axiosClient';
import { useStateContext } from '../context/contextprovider';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useStateContext();

  const fetchUnreadCount = async () => {
    if (!user?.id) return; // Asegurarse de que existe el usuario

    try {
      const response = await axiosClient.get(`/notifications/unread-count/${user.id}`);
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchNotifications = async (page = 1) => {
    if (!user?.id) return; // Asegurarse de que existe el usuario

    try {
      const response = await axiosClient.get(`/notifications?page=${page}`);
      if (page === 1) {
        setNotifications(response.data.notifications.data);
      } else {
        setNotifications(prev => [...prev, ...response.data.notifications.data]);
      }
      setHasMore(response.data.has_more);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    if (!user?.id) return;

    try {
      await axiosClient.post(`/notifications/${notificationId}/mark-as-viewed`);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, viewed: true }
            : notification
        )
      );
      await fetchUnreadCount(); // Actualizar el contador inmediatamente
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Efecto para cargar el contador inicial y configurar el intervalo
  useEffect(() => {
    if (user?.id) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]); // Dependencia del efecto al usuario

  // Efecto para cargar notificaciones cuando se abre el modal
  useEffect(() => {
    if (isModalOpen && user?.id) {
      fetchNotifications(1);
    }
  }, [isModalOpen, user]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setCurrentPage(1);
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchNotifications(nextPage);
  };

  // Función para manejar el cierre del modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNotifications([]);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Botón de la campana */}
      <button 
        className="btn btn-link text-white position-relative me-4" 
        onClick={handleOpenModal}
        data-bs-toggle="modal" 
        data-bs-target="#notificationsModal"
      >
        <FaBell className="fs-5" />
        {unreadCount > 0 && (
          <span className="position-absolute top-0 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
            <span className="visually-hidden">notificaciones no leídas</span>
          </span>
        )}
      </button>

      {/* Modal de Notificaciones */}
      <div 
        className="modal fade" 
        id="notificationsModal" 
        tabIndex="-1" 
        aria-labelledby="notificationsModalLabel" 
        aria-hidden="true"
        onHide={handleCloseModal}
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="notificationsModalLabel">
                Notificaciones
              </h4>
              <button 
                type="button" 
                className="btn-close" 
                data-bs-dismiss="modal" 
                aria-label="Close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              {!user ? (
                <p className="text-center text-muted py-4">
                  Cargando...
                </p>
              ) : notifications.length === 0 ? (
                <p className="text-center text-muted py-4">
                  No hay notificaciones
                </p>
              ) : (
                <div className="notification-list">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`card mb-3 ${!notification.viewed ? 'bg-light' : ''}`}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <p className="mb-1">{notification.message}</p>
                            <small className="text-muted d-block">
                              Folio: {notification.folio}
                            </small>
                            <small className="text-muted d-block">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </small>
                          </div>
                          {!notification.viewed && (
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Marcar como leída
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {hasMore && (
                    <div className="text-center">
                      <button
                        className="btn btn-outline-primary w-100"
                        onClick={loadMore}
                      >
                        Cargar más
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationBell;