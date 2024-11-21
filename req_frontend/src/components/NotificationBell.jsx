import React, { useState, useEffect } from 'react';
import { FaBell, FaCircle, FaCheckCircle } from 'react-icons/fa';
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
    console.log("notificacion enviada");
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
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
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
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0">
            <div className="modal-header bg-primary">
              <h5 className="modal-title d-flex align-items-center text-white" id="notificationsModalLabel">
                <FaBell className="me-2" />
                Notificaciones
              </h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                data-bs-dismiss="modal" 
                aria-label="Close"
                onClick={handleCloseModal}
                style={{ filter: 'brightness(0) invert(1)' }}
              ></button>
            </div>
            <div className="modal-body p-0">
              {!user ? (
                <div className="d-flex justify-content-center align-items-center p-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center p-4">
                  <FaBell className="text-muted mb-2" style={{ fontSize: '2rem' }} />
                  <p className="text-muted mb-0">No hay notificaciones</p>
                </div>
              ) : (
                <div className="notification-list">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`border-bottom ${!notification.viewed ? 'bg-light' : ''}`}
                    >
                      <div className="p-3">
                        <div className="d-flex">
                          {/* Indicador de no leído */}
                          <div className="flex-shrink-0 me-2 pt-1">
                            {!notification.viewed && (
                              <FaCircle className="text-primary" style={{ fontSize: '0.5rem' }} />
                            )}
                          </div>
                          
                          {/* Contenido de la notificación */}
                          <div className="flex-grow-1 me-3">
                            <p className="mb-1" style={{ lineHeight: '1.4' }}>{notification.message}</p>
                            <div className="d-flex flex-wrap align-items-center text-muted" style={{ fontSize: '0.875rem' }}>
                              <span className="me-3">
                                <strong>Folio:</strong> {notification.folio}
                              </span>
                              <span>
                                {new Date(notification.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Botón de marcar como leída */}
                          {!notification.viewed && (
                            <div className="flex-shrink-0">
                              <button
                                className="btn btn-outline-primary btn-sm d-flex align-items-center"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <FaCheckCircle className="me-1" />
                                <span>Leída</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Botón de cargar más */}
                  {hasMore && (
                    <div className="p-3">
                      <button
                        className="btn btn-outline-primary btn-sm w-100 d-flex align-items-center justify-content-center"
                        onClick={loadMore}
                      >
                        Cargar más notificaciones
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